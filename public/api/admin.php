<?php
// ─────────────────────────────────────────────────────────────────────────────
// Ema Rizos · API del panel de administración
//   GET  /api/admin.php?action=session
//   POST /api/admin.php?action=setup | login | logout
//   GET  /api/admin.php?action=products
//   POST /api/admin.php?action=create_product | update_product | delete_product
//   POST /api/admin.php?action=bulk_discount | upload_image | change_password
// ─────────────────────────────────────────────────────────────────────────────
require __DIR__ . '/_bootstrap.php';

$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
session_name('emarizos_admin');
session_set_cookie_params([
    'lifetime' => 0,
    'path'     => '/api/',
    'secure'   => $secure,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$action = (string)($_GET['action'] ?? '');

// Protección CSRF básica: toda escritura debe venir de fetch() con este encabezado
if ($method === 'POST' && ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'emarizos-admin') {
    fail('Solicitud no permitida', 403);
}

function body(): array
{
    $data = json_decode((string)file_get_contents('php://input'), true);
    return is_array($data) ? $data : [];
}

function require_admin(): void
{
    if (empty($_SESSION['admin_id'])) {
        fail('No autorizado', 401);
    }
}

function admin_count(): int
{
    return (int)db()->query('SELECT COUNT(*) FROM admin_users')->fetchColumn();
}

function validate_credentials(string $email, string $password): void
{
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        fail('Correo inválido');
    }
    if (strlen($password) < 10) {
        fail('La contraseña debe tener al menos 10 caracteres');
    }
}

// ─── Campos editables de producto ────────────────────────────────────────────
const TEXT_FIELDS = [
    'sku' => 64, 'nombre' => 255, 'display_name' => 255, 'categoria' => 100, 'marca' => 100,
    'formato' => 50, 'descripcion' => 5000, 'descripcion_corta' => 500, 'tipo_producto' => 50,
    'paso_rutina' => 50, 'linea' => 80, 'estado_stock' => 20, 'peso_formula' => 20,
    'tipo_cabello' => 20, 'nivel_fijacion' => 20,
];
const INT_FIELDS = ['precio', 'stock', 'score_base'];
const BOOL_FIELDS = ['featured', 'discount_active'];
const LIST_FIELDS = ['preocupaciones', 'preocupaciones_secundarias'];

function clean_product_fields(array $in): array
{
    $out = [];
    foreach (TEXT_FIELDS as $f => $max) {
        if (!array_key_exists($f, $in)) continue;
        $v = $in[$f];
        if ($v === null || trim((string)$v) === '') {
            $out[$f] = null;
        } else {
            $out[$f] = mb_substr(trim((string)$v), 0, $max);
        }
    }
    foreach (INT_FIELDS as $f) {
        if (!array_key_exists($f, $in)) continue;
        $v = $in[$f];
        if ($v === null || $v === '') {
            $out[$f] = $f === 'score_base' ? null : 0;
            continue;
        }
        if (!is_numeric($v)) fail("El campo $f debe ser un número");
        $out[$f] = max(0, (int)$v);
    }
    foreach (BOOL_FIELDS as $f) {
        if (array_key_exists($f, $in)) $out[$f] = $in[$f] ? 1 : 0;
    }
    if (array_key_exists('discount_pct', $in)) {
        $pct = max(0, min(99, (int)$in['discount_pct']));
        $out['discount_pct'] = $pct;
        $out['discount_active'] = $pct > 0 ? 1 : 0;
    }
    foreach (LIST_FIELDS as $f) {
        if (!array_key_exists($f, $in)) continue;
        $v = $in[$f];
        if ($v === null) { $out[$f] = null; continue; }
        if (!is_array($v)) fail("El campo $f debe ser una lista");
        $tags = array_values(array_unique(array_filter(array_map(
            function ($t) { return mb_substr(trim((string)$t), 0, 80); }, $v
        ), 'strlen')));
        $out[$f] = $tags ? json_encode($tags, JSON_UNESCAPED_UNICODE) : null;
    }
    // Campos obligatorios en la base
    foreach (['nombre', 'display_name'] as $req) {
        if (array_key_exists($req, $out) && $out[$req] === null) fail('El nombre es obligatorio');
    }
    if (array_key_exists('tipo_cabello', $out) && $out['tipo_cabello'] === null) $out['tipo_cabello'] = 'todos';
    if (array_key_exists('nivel_fijacion', $out) && $out['nivel_fijacion'] === null) $out['nivel_fijacion'] = 'no_aplica';
    return $out;
}

function fetch_product(int $id): ?array
{
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function delete_uploaded_file(?string $url): void
{
    global $CONFIG;
    $base = rtrim($CONFIG['uploads_url'] ?? '/uploads/products', '/') . '/';
    if (!$url || strpos($url, $base) !== 0) return; // solo borra imágenes subidas por el panel
    $file = basename($url);
    $path = rtrim($CONFIG['uploads_dir'], '/\\') . DIRECTORY_SEPARATOR . $file;
    if (is_file($path)) @unlink($path);
}

// ─── Rutas ───────────────────────────────────────────────────────────────────
switch ($action) {

    case 'session':
        json_out([
            'authed'     => !empty($_SESSION['admin_id']),
            'email'      => $_SESSION['admin_email'] ?? null,
            'needsSetup' => admin_count() === 0,
        ]);

    case 'setup': // Crea el primer administrador (solo funciona si no existe ninguno)
        if ($method !== 'POST') fail('Método no permitido', 405);
        $b = body();
        $setupKey = (string)($CONFIG['setup_key'] ?? '');
        if ($setupKey === '' || !hash_equals($setupKey, (string)($b['setup_key'] ?? ''))) {
            fail('Código de instalación incorrecto', 403);
        }
        $email = strtolower(trim((string)($b['email'] ?? '')));
        $password = (string)($b['password'] ?? '');
        validate_credentials($email, $password);
        $pdo = db();
        $pdo->beginTransaction();
        if ((int)$pdo->query('SELECT COUNT(*) FROM admin_users FOR UPDATE')->fetchColumn() > 0) {
            $pdo->rollBack();
            fail('Ya existe un administrador', 403);
        }
        $stmt = $pdo->prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)');
        $stmt->execute([$email, password_hash($password, PASSWORD_DEFAULT)]);
        $newAdminId = (int)$pdo->lastInsertId();
        $pdo->commit();
        session_regenerate_id(true);
        $_SESSION['admin_id'] = $newAdminId;
        $_SESSION['admin_email'] = $email;
        json_out(['ok' => true]);

    case 'login':
        if ($method !== 'POST') fail('Método no permitido', 405);
        $ip = client_ip();
        $pdo = db();
        $pdo->prepare('DELETE FROM login_attempts WHERE attempted_at < (NOW() - INTERVAL 1 DAY)')->execute();
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM login_attempts WHERE ip = ? AND attempted_at > (NOW() - INTERVAL 15 MINUTE)');
        $stmt->execute([$ip]);
        if ((int)$stmt->fetchColumn() >= 8) {
            fail('Demasiados intentos. Espera 15 minutos.', 429);
        }
        $b = body();
        $email = strtolower(trim((string)($b['email'] ?? '')));
        $password = (string)($b['password'] ?? '');
        $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admin_users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            $pdo->prepare('INSERT INTO login_attempts (ip) VALUES (?)')->execute([$ip]);
            fail('Correo o contraseña incorrectos', 401);
        }
        if (password_needs_rehash($user['password_hash'], PASSWORD_DEFAULT)) {
            $pdo->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
                ->execute([password_hash($password, PASSWORD_DEFAULT), $user['id']]);
        }
        $pdo->prepare('DELETE FROM login_attempts WHERE ip = ?')->execute([$ip]);
        session_regenerate_id(true);
        $_SESSION['admin_id'] = (int)$user['id'];
        $_SESSION['admin_email'] = $user['email'];
        json_out(['ok' => true, 'email' => $user['email']]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        json_out(['ok' => true]);

    case 'change_password':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $b = body();
        $current = (string)($b['current'] ?? '');
        $new = (string)($b['new'] ?? '');
        if (strlen($new) < 10) fail('La nueva contraseña debe tener al menos 10 caracteres');
        $stmt = db()->prepare('SELECT password_hash FROM admin_users WHERE id = ?');
        $stmt->execute([$_SESSION['admin_id']]);
        $hash = $stmt->fetchColumn();
        if (!$hash || !password_verify($current, (string)$hash)) fail('La contraseña actual no es correcta', 401);
        db()->prepare('UPDATE admin_users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($new, PASSWORD_DEFAULT), $_SESSION['admin_id']]);
        json_out(['ok' => true]);

    case 'products':
        require_admin();
        $rows = db()->query('SELECT * FROM products ORDER BY display_name ASC')->fetchAll();
        json_out(array_map('product_out', $rows));

    case 'create_product':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $b = body();
        $fields = clean_product_fields($b);
        if (empty($fields['display_name'])) fail('El nombre es obligatorio');
        if (empty($fields['nombre'])) $fields['nombre'] = $fields['display_name'];
        if (!isset($fields['precio'])) fail('El precio es obligatorio');
        // ID opcional (por ejemplo, el código del POS). Si no viene, se asigna solo.
        if (isset($b['id']) && $b['id'] !== '' && $b['id'] !== null) {
            $id = filter_var($b['id'], FILTER_VALIDATE_INT);
            if ($id === false || $id <= 0) fail('El ID debe ser un número positivo');
            if (fetch_product($id)) fail('Ya existe un producto con ese ID', 409);
            $fields = ['id' => $id] + $fields;
        }
        $cols = array_keys($fields);
        $sql = 'INSERT INTO products (' . implode(', ', $cols) . ') VALUES (' . implode(', ', array_fill(0, count($cols), '?')) . ')';
        db()->prepare($sql)->execute(array_values($fields));
        $newId = isset($fields['id']) ? (int)$fields['id'] : (int)db()->lastInsertId();
        json_out(product_out(fetch_product($newId)), 201);

    case 'update_product':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $b = body();
        $id = filter_var($b['id'] ?? null, FILTER_VALIDATE_INT);
        if (!$id || !fetch_product($id)) fail('Producto no encontrado', 404);
        $fields = clean_product_fields($b['fields'] ?? []);
        if (!$fields) fail('No hay cambios');
        $set = implode(', ', array_map(function ($c) { return "$c = ?"; }, array_keys($fields)));
        $params = array_values($fields);
        $params[] = $id;
        db()->prepare("UPDATE products SET $set WHERE id = ?")->execute($params);
        json_out(product_out(fetch_product($id)));

    case 'delete_product':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $b = body();
        $id = filter_var($b['id'] ?? null, FILTER_VALIDATE_INT);
        $row = $id ? fetch_product($id) : null;
        if (!$row) fail('Producto no encontrado', 404);
        db()->prepare('DELETE FROM products WHERE id = ?')->execute([$id]);
        delete_uploaded_file($row['imagen_url']);
        json_out(['ok' => true]);

    case 'bulk_discount':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $b = body();
        $ids = array_values(array_filter(array_map('intval', (array)($b['ids'] ?? [])), function ($i) { return $i > 0; }));
        $pct = max(0, min(99, (int)($b['pct'] ?? 0)));
        if (!$ids) fail('No hay productos seleccionados');
        $in = implode(',', array_fill(0, count($ids), '?'));
        $stmt = db()->prepare("UPDATE products SET discount_pct = ?, discount_active = ? WHERE id IN ($in)");
        $stmt->execute(array_merge([$pct, $pct > 0 ? 1 : 0], $ids));
        json_out(['ok' => true, 'updated' => $stmt->rowCount()]);

    case 'upload_image':
        if ($method !== 'POST') fail('Método no permitido', 405);
        require_admin();
        $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
        $row = $id ? fetch_product($id) : null;
        if (!$row) fail('Producto no encontrado', 404);
        $file = $_FILES['image'] ?? null;
        if (!$file || !is_array($file) || ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            $code = $file['error'] ?? UPLOAD_ERR_NO_FILE;
            fail($code === UPLOAD_ERR_INI_SIZE || $code === UPLOAD_ERR_FORM_SIZE
                ? 'La imagen es demasiado grande'
                : 'No se recibió la imagen');
        }
        $max = (int)($CONFIG['max_upload_bytes'] ?? 5 * 1024 * 1024);
        if ($file['size'] > $max) fail('La imagen supera el tamaño máximo de ' . round($max / 1048576) . ' MB');
        $info = @getimagesize($file['tmp_name']);
        $types = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
        if (!$info || !isset($types[$info[2]])) fail('Formato no permitido. Usa JPG, PNG o WebP.');
        $ext = $types[$info[2]];
        $dir = rtrim($CONFIG['uploads_dir'], '/\\');
        if (!is_dir($dir) && !mkdir($dir, 0755, true)) fail('No se pudo crear la carpeta de imágenes', 500);
        if (!is_file($dir . '/.htaccess')) {
            // Nunca ejecutar scripts dentro de la carpeta de imágenes
            @file_put_contents($dir . '/.htaccess', implode("\n", [
                'Options -Indexes',
                '<FilesMatch "\.(php\d?|phtml|phar|cgi|pl|py)$">',
                '  Require all denied',
                '</FilesMatch>',
                '',
            ]));
        }
        $name = $id . '-' . time() . '.' . $ext;
        if (!move_uploaded_file($file['tmp_name'], $dir . DIRECTORY_SEPARATOR . $name)) {
            fail('No se pudo guardar la imagen', 500);
        }
        $url = rtrim($CONFIG['uploads_url'] ?? '/uploads/products', '/') . '/' . $name;
        db()->prepare('UPDATE products SET imagen_url = ? WHERE id = ?')->execute([$url, $id]);
        delete_uploaded_file($row['imagen_url']);
        json_out(product_out(fetch_product($id)));

    default:
        fail('Acción no válida', 404);
}
