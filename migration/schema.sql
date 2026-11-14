-- ─────────────────────────────────────────────────────────────────────────────
-- Ema Rizos · Esquema MySQL / MariaDB
-- Importar en phpMyAdmin (pestaña "Importar") sobre la base de datos creada en cPanel.
-- ─────────────────────────────────────────────────────────────────────────────
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id                         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sku                        VARCHAR(64)  NULL,
  nombre                     VARCHAR(255) NOT NULL,
  display_name               VARCHAR(255) NOT NULL,
  categoria                  VARCHAR(100) NULL,
  marca                      VARCHAR(100) NULL,
  formato                    VARCHAR(50)  NULL,
  precio                     INT UNSIGNED NOT NULL DEFAULT 0,
  stock                      INT          NOT NULL DEFAULT 0,
  descripcion                TEXT         NULL,
  descripcion_corta          VARCHAR(500) NULL,
  tipo_producto              VARCHAR(50)  NULL,
  paso_rutina                VARCHAR(50)  NULL,
  linea                      VARCHAR(80)  NULL,
  estado_stock               VARCHAR(20)  NULL,
  peso_formula               VARCHAR(20)  NULL,
  featured                   TINYINT(1)   NOT NULL DEFAULT 0,
  preocupaciones             TEXT         NULL COMMENT 'Lista JSON de etiquetas',
  preocupaciones_secundarias TEXT         NULL COMMENT 'Lista JSON de etiquetas',
  score_base                 INT          NULL,
  tipo_cabello               VARCHAR(20)  NOT NULL DEFAULT 'todos',
  nivel_fijacion             VARCHAR(20)  NOT NULL DEFAULT 'no_aplica',
  discount_pct               TINYINT UNSIGNED NOT NULL DEFAULT 0,
  discount_active            TINYINT(1)   NOT NULL DEFAULT 0,
  imagen_url                 VARCHAR(255) NULL COMMENT 'Imagen subida desde el panel; si es NULL se usa /img/products/{id}.png',
  created_at                 TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_stock (stock),
  KEY idx_categoria (categoria),
  KEY idx_display_name (display_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS admin_users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username      VARCHAR(40)  NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS login_attempts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ip           VARCHAR(45)  NOT NULL,
  attempted_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_ip_time (ip, attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
