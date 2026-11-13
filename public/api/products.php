<?php
// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products.php            → productos con stock (orden alfabético)
// GET /api/products.php?id=123     → un producto (aunque esté agotado)
// Parámetros opcionales: categoria, limit
// ─────────────────────────────────────────────────────────────────────────────
require __DIR__ . '/_bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    fail('Método no permitido', 405);
}

header('Cache-Control: public, max-age=60');

if (isset($_GET['id'])) {
    $id = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    if ($id === false || $id <= 0) {
        fail('ID inválido');
    }
    $stmt = db()->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        fail('Producto no encontrado', 404);
    }
    json_out(product_out($row));
}

$sql = 'SELECT * FROM products WHERE stock > 0';
$params = [];
if (!empty($_GET['categoria'])) {
    $sql .= ' AND categoria = ?';
    $params[] = (string)$_GET['categoria'];
}
$sql .= ' ORDER BY display_name ASC';

$limit = isset($_GET['limit']) ? filter_var($_GET['limit'], FILTER_VALIDATE_INT) : false;
if ($limit !== false && $limit > 0) {
    $sql .= ' LIMIT ' . min((int)$limit, 1000);
}

$stmt = db()->prepare($sql);
$stmt->execute($params);
json_out(array_map('product_out', $stmt->fetchAll()));
