SELECT 
    c.id as category_id,
    c.name as category_name,
    pc.id as product_category_id,
    pc.name as product_category_name
FROM category c
LEFT JOIN product_categories pc ON c.id = pc.category_id
ORDER BY c.id, pc.id;

-- Xem cấu trúc danh mục và variant
SELECT 
    c.name as category_name,
    pc.name as product_category_name,
    vo.name as variant_option_name,
    vv.value as variant_value,
    vv.price as price,
    vv.stock_quantity
FROM category c
JOIN product_categories pc ON c.id = pc.category_id
LEFT JOIN variant_options vo ON pc.id = vo.product_categories_id
LEFT JOIN variant_values vv ON vo.id = vv.variant_options_id
WHERE c.id IN (1, 7, 8, 15) -- Lọc một vài danh mục để xem
ORDER BY c.id, pc.id, vo.id, vv.id
LIMIT 50;

-- Xem thông tin sản phẩm với danh mục và variant
SELECT 
    c.name as category_name,
    pc.name as product_category_name,
    p.name as product_name,
    p.price_base,
    p.is_active,
    vo.name as variant_option,
    vv.value as variant_value,
    vv.price as additional_price
FROM category c
JOIN product_categories pc ON c.id = pc.category_id
JOIN product p ON pc.id = p.product_categories_id
LEFT JOIN variant_options vo ON pc.id = vo.product_categories_id
LEFT JOIN variant_values vv ON vo.id = vv.variant_options_id
WHERE p.is_active = 1 AND c.id IN (1, 7, 8) -- Xem một vài danh mục
ORDER BY c.id, pc.id, p.id, vo.id, vv.id
LIMIT 30;

-- Xem product variant với thông tin đầy đủ
SELECT 
    p.name as product_name,
    p.price_base,
    pv.sku,
    pv.price as variant_price,
    pv.stock_quantity,
    vo.name as variant_option_name,
    vv.value as variant_value,
    (p.price_base + pv.price) as total_price
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
LEFT JOIN variant_options vo ON pv.variant_option_id = vo.id
LEFT JOIN variant_values vv ON vo.id = vv.variant_options_id 
    AND pv.price = vv.price
WHERE p.id IN (1, 11, 21, 30) -- Xem một vài sản phẩm mẫu
ORDER BY p.id, pv.id
LIMIT 50;

-- ===============================================
-- QUERY KIỂM TRA PRODUCT VARIANT VALUES
-- ===============================================

-- Xem thông tin đầy đủ về sản phẩm, variant và values
SELECT 
    p.name as product_name,
    p.price_base,
    pv.sku as variant_sku,
    pv.price as variant_price,
    vo.name as variant_option_name,
    vv.value as variant_value_name,
    vv.price as value_additional_price,
    pvv.quantity,
    (p.price_base + pv.price + COALESCE(vv.price, 0)) as total_price
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN product_variant_values pvv ON pv.id = pvv.variant_id
LEFT JOIN variant_values vv ON pvv.value_id = vv.id
LEFT JOIN variant_options vo ON vv.variant_options_id = vo.id
WHERE p.id IN (1, 11, 21, 30) -- Xem một vài sản phẩm có nhiều variant
    AND pvv.quantity > 0 -- Chỉ xem các variant có quantity > 0
ORDER BY p.id, pv.id, pvv.id
LIMIT 50;

-- Query xem combo sản phẩm (ví dụ: Phở + Size + Topping)
SELECT 
    p.name as product_name,
    GROUP_CONCAT(
        CONCAT(vo.name, ': ', vv.value, ' (+', vv.price, 'đ)')
        SEPARATOR ' | '
    ) as variant_combination,
    p.price_base + SUM(COALESCE(vv.price, 0)) as total_combo_price
FROM product p
JOIN product_variant pv ON p.id = pv.product_id
JOIN product_variant_values pvv ON pv.id = pvv.variant_id
LEFT JOIN variant_values vv ON pvv.value_id = vv.id
LEFT JOIN variant_options vo ON vv.variant_options_id = vo.id
WHERE p.id = 1 AND pvv.quantity > 0 -- Ví dụ với Phở Bò Hà Nội
GROUP BY p.id, p.name, p.price_base
ORDER BY total_combo_price;


SELECT @@global.time_zone, @@session.time_zone;
select * from product_variants