-- ============================================================
-- SCRIPT PARA POBLAR BASE DE DATOS (Railway MySQL)
-- ============================================================

-- 1. VER TABLAS
USE railway;
SHOW TABLES;

-- 2. VER PRODUCTOS ACTUALES
SELECT * FROM products;

-- 3. INSERTAR CATEGORÍAS
INSERT INTO categories (nombre, descripcion, createdAt, updatedAt) VALUES
('Laptops', 'Computadoras portátiles', NOW(), NOW()),
('Periféricos', 'Mouse, teclados y accesorios', NOW(), NOW()),
('Monitores', 'Pantallas y monitores', NOW(), NOW()),
('Audífonos', 'Audífonos y cascos', NOW(), NOW());

-- 4. INSERTAR PRODUCTOS (asumiendo categoryId según el orden anterior)
INSERT INTO products (nombre, precio, descripcion, imageUrl, categoryId, createdAt, updatedAt) VALUES
('Laptop Lenovo IdeaPad 3', 1599.90, 'Laptop básica para estudio y oficina', 'https://via.placeholder.com/300x200?text=Lenovo+IdeaPad+3', 1, NOW(), NOW()),
('Mouse Logitech M280', 59.90, 'Mouse inalámbrico ergonómico', 'https://via.placeholder.com/300x200?text=Mouse+Logitech+M280', 2, NOW(), NOW()),
('Monitor Samsung 27"', 799.00, 'Monitor Full HD de 27 pulgadas', 'https://via.placeholder.com/300x200?text=Monitor+Samsung+27', 3, NOW(), NOW()),
('Teclado Redragon Kumara K552', 189.50, 'Teclado mecánico con iluminación LED', 'https://via.placeholder.com/300x200?text=Teclado+Redragon', 2, NOW(), NOW()),
('Audífonos Sony WH-CH510', 249.00, 'Audífonos inalámbricos con buena autonomía', 'https://via.placeholder.com/300x200?text=Sony+WH-CH510', 4, NOW(), NOW());

-- 5. VER PRODUCTOS INSERTADOS
SELECT p.id, p.nombre, p.precio, c.nombre AS categoria, p.imageUrl
FROM products p
LEFT JOIN categories c ON p.categoryId = c.id;
