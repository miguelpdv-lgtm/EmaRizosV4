<?php
// Copia este archivo como config.php (en la misma carpeta /api) y llena los datos
// de la base de datos que creaste en cPanel → "Bases de datos MySQL".
// config.php NO se sube a git.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'usuariocpanel_emarizos',
    'db_user' => 'usuariocpanel_emarizos',
    'db_pass' => 'CAMBIAR',

    // Carpeta (dentro de public_html) donde se guardan las imágenes subidas desde el panel.
    // Va fuera de la carpeta del build para que no se borre al subir una versión nueva.
    'uploads_dir' => __DIR__ . '/../uploads/products',
    'uploads_url' => '/uploads/products',

    // Tamaño máximo de imagen en bytes (5 MB)
    'max_upload_bytes' => 5 * 1024 * 1024,

    // Código que pide el panel para crear el PRIMER administrador. Después ya no se usa.
    'setup_key' => 'CAMBIAR-por-un-codigo-largo',

    // Solo para desarrollo local (ej. 'http://localhost:5173'). En producción, vacío.
    'allowed_origins' => [],
];
