<?php
// ─────────────────────────────────────────────────────────────────────────────
// Ema Rizos · API · utilidades compartidas
// ─────────────────────────────────────────────────────────────────────────────
declare(strict_types=1);

if (basename($_SERVER['SCRIPT_FILENAME'] ?? '') === basename(__FILE__)) {
    http_response_code(404);
    exit;
}

$configFile = getenv('EMARIZOS_CONFIG') ?: __DIR__ . '/config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Falta api/config.php (copia config.example.php y llena los datos).']);
    exit;
}
$CONFIG = require $configFile;

ini_set('display_errors', '0');
error_reporting(E_ALL);

// Compresión gzip de las respuestas JSON (el catálogo baja de ~50 KB a ~8 KB)
if (extension_loaded('zlib') && !ini_get('zlib.output_compression')) {
    ob_start('ob_gzhandler');
}

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

// ─── CORS (solo para desarrollo local, si se configura) ──────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $CONFIG['allowed_origins'] ?? [];
if ($origin !== '' && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ─── Respuestas ──────────────────────────────────────────────────────────────
function json_out($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $message, int $status = 400): void
{
    json_out(['error' => $message], $status);
}

set_exception_handler(function (Throwable $e) {
    error_log('[emarizos-api] ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    fail('Error interno del servidor.', 500);
});

// ─── Base de datos ───────────────────────────────────────────────────────────
function db(): PDO
{
    static $pdo = null;
    global $CONFIG;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $CONFIG['db_host'] ?? 'localhost',
            (int)($CONFIG['db_port'] ?? 3306),
            $CONFIG['db_name']
        );
        $pdo = new PDO($dsn, $CONFIG['db_user'], $CONFIG['db_pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }
    return $pdo;
}

// ─── Productos: conversión de tipos para el frontend ─────────────────────────
function product_out(array $row): array
{
    foreach (['id', 'precio', 'stock', 'discount_pct'] as $k) {
        $row[$k] = (int)$row[$k];
    }
    $row['score_base'] = $row['score_base'] === null ? null : (int)$row['score_base'];
    $row['featured'] = (bool)(int)$row['featured'];
    $row['discount_active'] = (bool)(int)$row['discount_active'];
    foreach (['preocupaciones', 'preocupaciones_secundarias'] as $k) {
        $decoded = $row[$k] !== null ? json_decode((string)$row[$k], true) : null;
        $row[$k] = is_array($decoded) ? array_values($decoded) : null;
    }
    unset($row['created_at'], $row['updated_at']);
    return $row;
}

function client_ip(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 45);
}
