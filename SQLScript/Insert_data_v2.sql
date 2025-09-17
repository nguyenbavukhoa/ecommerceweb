-- ===============================================
-- CATEGORY (Danh mục chính)
-- ===============================================

INSERT INTO category (id, name, created_at, updated_at) VALUES
(1, 'Món Việt', NOW(), NOW()),
(2, 'Đồ nướng & BBQ', NOW(), NOW()),
(3, 'Lẩu & Nướng', NOW(), NOW()),
(4, 'Món Hàn', NOW(), NOW()),
(5, 'Món Nhật', NOW(), NOW()),
(6, 'Món Thái', NOW(), NOW()),
(7, 'Pizza & Burger', NOW(), NOW()),
(8, 'Trà sữa & Café', NOW(), NOW()),
(9, 'Tráng miệng', NOW(), NOW()),
(10, 'Đồ chay', NOW(), NOW()),
(11, 'Ăn vặt', NOW(), NOW()),
(12, 'Hoa quả & Sinh tố', NOW(), NOW()),
(13, 'Cơm văn phòng', NOW(), NOW()),
(14, 'Bữa sáng', NOW(), NOW()),
(15, 'Thức ăn nhanh', NOW(), NOW());

-- ===============================================
-- PRODUCT_CATEGORIES (Danh mục chi tiết)
-- ===============================================


INSERT INTO product_categories (id, category_id, name, created_at, updated_at) VALUES
-- Món Việt (category_id: 1)
(1, 1, 'Phở', NOW(), NOW()),
(2, 1, 'Bún bò Huế', NOW(), NOW()),
(3, 1, 'Bánh mì', NOW(), NOW()),
(4, 1, 'Cơm tấm', NOW(), NOW()),
(5, 1, 'Bún chả', NOW(), NOW()),
(6, 1, 'Bánh cuốn', NOW(), NOW()),
(7, 1, 'Chè', NOW(), NOW()),
(8, 1, 'Nem rán', NOW(), NOW()),
(9, 1, 'Gỏi cuốn', NOW(), NOW()),

-- Đồ nướng & BBQ (category_id: 2)
(10, 2, 'Thịt nướng', NOW(), NOW()),
(11, 2, 'Hải sản nướng', NOW(), NOW()),
(12, 2, 'Chả cá', NOW(), NOW()),
(13, 2, 'Nem nướng', NOW(), NOW()),
(14, 2, 'Bánh tráng nướng', NOW(), NOW()),

-- Lẩu & Nướng (category_id: 3)
(15, 3, 'Lẩu Thái', NOW(), NOW()),
(16, 3, 'Lẩu chua cay', NOW(), NOW()),
(17, 3, 'Lẩu nướng', NOW(), NOW()),
(18, 3, 'Buffet lẩu nướng', NOW(), NOW()),

-- Món Hàn (category_id: 4)
(19, 4, 'Kimchi', NOW(), NOW()),
(20, 4, 'Bulgogi', NOW(), NOW()),
(21, 4, 'Bibimbap', NOW(), NOW()),
(22, 4, 'Tteokbokki', NOW(), NOW()),
(23, 4, 'Korean Fried Chicken', NOW(), NOW()),
(24, 4, 'Ramen Hàn Quốc', NOW(), NOW()),

-- Món Nhật (category_id: 5)
(25, 5, 'Sushi', NOW(), NOW()),
(26, 5, 'Sashimi', NOW(), NOW()),
(27, 5, 'Ramen', NOW(), NOW()),
(28, 5, 'Tempura', NOW(), NOW()),
(29, 5, 'Donburi', NOW(), NOW()),
(30, 5, 'Yakitori', NOW(), NOW()),

-- Món Thái (category_id: 6)
(31, 6, 'Pad Thai', NOW(), NOW()),
(32, 6, 'Tom Yum', NOW(), NOW()),
(33, 6, 'Green Curry', NOW(), NOW()),
(34, 6, 'Som Tam', NOW(), NOW()),
(35, 6, 'Mango Sticky Rice', NOW(), NOW()),

-- Pizza & Burger (category_id: 7)
(36, 7, 'Pizza Italy', NOW(), NOW()),
(37, 7, 'Pizza Mỹ', NOW(), NOW()),
(38, 7, 'Burger bò', NOW(), NOW()),
(39, 7, 'Burger gà', NOW(), NOW()),
(40, 7, 'Sandwich', NOW(), NOW()),

-- Trà sữa & Café (category_id: 8)
(41, 8, 'Trà sữa trân châu', NOW(), NOW()),
(42, 8, 'Trà sữa kem cheese', NOW(), NOW()),
(43, 8, 'Cà phê đen', NOW(), NOW()),
(44, 8, 'Cà phê sữa', NOW(), NOW()),
(45, 8, 'Smoothie', NOW(), NOW()),
(46, 8, 'Đá xay', NOW(), NOW()),

-- Tráng miệng (category_id: 9)
(47, 9, 'Bánh ngọt', NOW(), NOW()),
(48, 9, 'Kem', NOW(), NOW()),
(49, 9, 'Pudding', NOW(), NOW()),
(50, 9, 'Bánh flan', NOW(), NOW()),
(51, 9, 'Tiramisu', NOW(), NOW()),

-- Đồ chay (category_id: 10)
(52, 10, 'Cơm chay', NOW(), NOW()),
(53, 10, 'Phở chay', NOW(), NOW()),
(54, 10, 'Bún chay', NOW(), NOW()),
(55, 10, 'Bánh mì chay', NOW(), NOW()),
(56, 10, 'Salad', NOW(), NOW()),

-- Ăn vặt (category_id: 11)
(57, 11, 'Bánh tráng', NOW(), NOW()),
(58, 11, 'Chả cá viên', NOW(), NOW()),
(59, 11, 'Bánh căn', NOW(), NOW()),
(60, 11, 'Bánh khọt', NOW(), NOW()),
(61, 11, 'Che cung', NOW(), NOW()),

-- Hoa quả & Sinh tố (category_id: 12)
(62, 12, 'Hoa quả tươi', NOW(), NOW()),
(63, 12, 'Sinh tố', NOW(), NOW()),
(64, 12, 'Nước ép', NOW(), NOW()),
(65, 12, 'Salad trái cây', NOW(), NOW()),

-- Cơm văn phòng (category_id: 13)
(66, 13, 'Cơm hộp', NOW(), NOW()),
(67, 13, 'Cơm trưa', NOW(), NOW()),
(68, 13, 'Set ăn văn phòng', NOW(), NOW()),
(69, 13, 'Cơm dinh dưỡng', NOW(), NOW()),

-- Bữa sáng (category_id: 14)
(70, 14, 'Xôi', NOW(), NOW()),
(71, 14, 'Bánh mì', NOW(), NOW()),
(72, 14, 'Cháo', NOW(), NOW()),
(73, 14, 'Bánh cuốn', NOW(), NOW()),
(74, 14, 'Cà phê sáng', NOW(), NOW()),

-- Thức ăn nhanh (category_id: 15)
(75, 15, 'Gà rán', NOW(), NOW()),
(76, 15, 'Khoai tây chiên', NOW(), NOW()),
(77, 15, 'Hot dog', NOW(), NOW()),
(78, 15, 'Combo fast food', NOW(), NOW()),
(79, 15, 'Mì tôm', NOW(), NOW());


-- ===============================================
-- VARIANT OPTIONS (Các tùy chọn biến thể)
-- ===============================================


INSERT INTO variant_options (id, name, product_categories_id, created_at, updated_at) VALUES
(1, 'Loại phở', 1, NOW(), NOW()),
(2, 'Kích cỡ', 1, NOW(), NOW()),
(3, 'Topping thêm', 1, NOW(), NOW()),

-- Bánh mì (product_categories_id: 3)
(4, 'Loại bánh mì', 3, NOW(), NOW()),
(5, 'Nước uống kèm', 3, NOW(), NOW()),

-- Cơm tấm (product_categories_id: 4)
(6, 'Loại cơm tấm', 4, NOW(), NOW()),
(7, 'Combo', 4, NOW(), NOW()),

-- Pizza (product_categories_id: 36, 37)
(8, 'Kích cỡ pizza', 36, NOW(), NOW()),
(9, 'Đế pizza', 36, NOW(), NOW()),
(10, 'Topping thêm', 36, NOW(), NOW()),
(11, 'Kích cỡ pizza', 37, NOW(), NOW()),
(12, 'Đế pizza', 37, NOW(), NOW()),

-- Burger (product_categories_id: 38, 39)
(13, 'Loại burger', 38, NOW(), NOW()),
(14, 'Set combo', 38, NOW(), NOW()),
(15, 'Loại burger gà', 39, NOW(), NOW()),
(16, 'Set combo', 39, NOW(), NOW()),

-- Trà sữa (product_categories_id: 41, 42)
(17, 'Size', 41, NOW(), NOW()),
(18, 'Độ ngọt', 41, NOW(), NOW()),
(19, 'Topping', 41, NOW(), NOW()),
(20, 'Size', 42, NOW(), NOW()),
(21, 'Độ ngọt', 42, NOW(), NOW()),

-- Cà phê (product_categories_id: 43, 44)
(22, 'Size', 43, NOW(), NOW()),
(23, 'Độ đậm', 43, NOW(), NOW()),
(24, 'Size', 44, NOW(), NOW()),
(25, 'Tỷ lệ sữa', 44, NOW(), NOW()),

-- Gà rán (product_categories_id: 75)
(26, 'Số miếng', 75, NOW(), NOW()),
(27, 'Vị', 75, NOW(), NOW()),
(28, 'Combo', 75, NOW(), NOW()),

-- Lẩu (product_categories_id: 15, 16)
(29, 'Size nồi', 15, NOW(), NOW()),
(30, 'Độ cay', 15, NOW(), NOW()),
(31, 'Size nồi', 16, NOW(), NOW()),
(32, 'Độ cay', 16, NOW(), NOW()),

-- Sushi (product_categories_id: 25)
(33, 'Set sushi', 25, NOW(), NOW()),
(34, 'Loại cá', 25, NOW(), NOW()),

-- Ramen (product_categories_id: 27)
(35, 'Loại nước dùng', 27, NOW(), NOW()),
(36, 'Topping', 27, NOW(), NOW()),
(37, 'Độ cay', 27, NOW(), NOW());

-- ===============================================
-- VARIANT VALUES (Giá trị các biến thể)
-- ===============================================

-- Phở - Loại phở (variant_options_id: 1)
INSERT INTO variant_values (id, value, price, stock_quantity, variant_options_id, created_at, updated_at) VALUES
(1, 'Phở bò tái', 45000, 50, 1, NOW(), NOW()),
(2, 'Phở bò chín', 45000, 50, 1, NOW(), NOW()),
(3, 'Phở gà', 40000, 30, 1, NOW(), NOW()),
(4, 'Phở đặc biệt', 55000, 25, 1, NOW(), NOW()),

-- Phở - Kích cỡ (variant_options_id: 2)
(5, 'Nhỏ', 0, 100, 2, NOW(), NOW()),
(6, 'Vừa', 5000, 100, 2, NOW(), NOW()),
(7, 'Lớn', 10000, 100, 2, NOW(), NOW()),

-- Phở - Topping thêm (variant_options_id: 3)
(8, 'Thêm thịt', 15000, 50, 3, NOW(), NOW()),
(9, 'Thêm trứng', 8000, 50, 3, NOW(), NOW()),
(10, 'Thêm rau thơm', 5000, 50, 3, NOW(), NOW()),

-- Bánh mì - Loại bánh mì (variant_options_id: 4)
(11, 'Bánh mì thịt nướng', 25000, 40, 4, NOW(), NOW()),
(12, 'Bánh mì pate', 20000, 40, 4, NOW(), NOW()),
(13, 'Bánh mì trứng', 18000, 30, 4, NOW(), NOW()),
(14, 'Bánh mì đặc biệt', 35000, 20, 4, NOW(), NOW()),

-- Bánh mì - Nước uống kèm (variant_options_id: 5)
(15, 'Không', 0, 100, 5, NOW(), NOW()),
(16, 'Nước ngọt', 10000, 50, 5, NOW(), NOW()),
(17, 'Cà phê sữa', 15000, 30, 5, NOW(), NOW()),

-- Cơm tấm - Loại cơm tấm (variant_options_id: 6)
(18, 'Cơm tấm sườn', 35000, 30, 6, NOW(), NOW()),
(19, 'Cơm tấm bì', 32000, 30, 6, NOW(), NOW()),
(20, 'Cơm tấm đặc biệt', 45000, 20, 6, NOW(), NOW()),

-- Pizza - Kích cỡ (variant_options_id: 8, 11)
(21, 'Size S (20cm)', 150000, 20, 8, NOW(), NOW()),
(22, 'Size M (25cm)', 220000, 15, 8, NOW(), NOW()),
(23, 'Size L (30cm)', 320000, 10, 8, NOW(), NOW()),
(24, 'Size S (20cm)', 180000, 20, 11, NOW(), NOW()),
(25, 'Size M (25cm)', 250000, 15, 11, NOW(), NOW()),
(26, 'Size L (30cm)', 350000, 10, 11, NOW(), NOW()),

-- Pizza - Đế pizza (variant_options_id: 9, 12)
(27, 'Đế mỏng', 0, 50, 9, NOW(), NOW()),
(28, 'Đế dày', 15000, 50, 9, NOW(), NOW()),
(29, 'Đế phô mai', 25000, 30, 9, NOW(), NOW()),
(30, 'Đế mỏng', 0, 50, 12, NOW(), NOW()),
(31, 'Đế dày', 20000, 50, 12, NOW(), NOW()),

-- Burger - Loại burger bò (variant_options_id: 13)
(32, 'Burger bò classic', 65000, 25, 13, NOW(), NOW()),
(33, 'Burger bò BBQ', 75000, 20, 13, NOW(), NOW()),
(34, 'Double burger', 95000, 15, 13, NOW(), NOW()),

-- Burger - Set combo (variant_options_id: 14, 16)
(35, 'Không combo', 0, 50, 14, NOW(), NOW()),
(36, 'Combo khoai + nước', 25000, 50, 14, NOW(), NOW()),
(37, 'Combo khoai + nước + salad', 35000, 30, 14, NOW(), NOW()),
(38, 'Combo khoai + nước', 25000, 50, 16, NOW(), NOW()),

-- Trà sữa - Size (variant_options_id: 17, 20)
(39, 'Size M', 0, 100, 17, NOW(), NOW()),
(40, 'Size L', 8000, 100, 17, NOW(), NOW()),
(41, 'Size XL', 15000, 50, 17, NOW(), NOW()),
(42, 'Size M', 0, 100, 20, NOW(), NOW()),
(43, 'Size L', 10000, 100, 20, NOW(), NOW()),

-- Trà sữa - Độ ngọt (variant_options_id: 18, 21)
(44, '0% đường', 0, 100, 18, NOW(), NOW()),
(45, '50% đường', 0, 100, 18, NOW(), NOW()),
(46, '100% đường', 0, 100, 18, NOW(), NOW()),
(47, '0% đường', 0, 100, 21, NOW(), NOW()),
(48, '70% đường', 0, 100, 21, NOW(), NOW()),
(49, '100% đường', 0, 100, 21, NOW(), NOW()),

-- Trà sữa - Topping (variant_options_id: 19)
(50, 'Trân châu đen', 5000, 100, 19, NOW(), NOW()),
(51, 'Trân châu trắng', 5000, 100, 19, NOW(), NOW()),
(52, 'Thạch dừa', 8000, 50, 19, NOW(), NOW()),
(53, 'Pudding', 10000, 30, 19, NOW(), NOW()),

-- Cà phê - Size (variant_options_id: 22, 24)
(54, 'Nhỏ', 0, 100, 22, NOW(), NOW()),
(55, 'Lớn', 8000, 100, 22, NOW(), NOW()),
(56, 'Nhỏ', 0, 100, 24, NOW(), NOW()),
(57, 'Lớn', 10000, 100, 24, NOW(), NOW()),

-- Gà rán - Số miếng (variant_options_id: 26)
(58, '2 miếng', 45000, 30, 26, NOW(), NOW()),
(59, '4 miếng', 85000, 25, 26, NOW(), NOW()),
(60, '6 miếng', 120000, 20, 26, NOW(), NOW()),
(61, '9 miếng', 170000, 15, 26, NOW(), NOW()),

-- Gà rán - Vị (variant_options_id: 27)
(62, 'Gà giòn truyền thống', 0, 100, 27, NOW(), NOW()),
(63, 'Gà cay Hàn Quốc', 5000, 50, 27, NOW(), NOW()),
(64, 'Gà mật ong', 8000, 30, 27, NOW(), NOW()),

-- Lẩu Thái - Size nồi (variant_options_id: 29)
(65, 'Nồi 2-3 người', 180000, 15, 29, NOW(), NOW()),
(66, 'Nồi 4-5 người', 280000, 10, 29, NOW(), NOW()),
(67, 'Nồi 6-8 người', 380000, 8, 29, NOW(), NOW()),

-- Sushi - Set sushi (variant_options_id: 33)
(68, 'Set 8 miếng', 120000, 20, 33, NOW(), NOW()),
(69, 'Set 12 miếng', 180000, 15, 33, NOW(), NOW()),
(70, 'Set 16 miếng', 240000, 10, 33, NOW(), NOW()),

-- Ramen - Loại nước dùng (variant_options_id: 35)
(71, 'Shoyu (nước tương)', 55000, 25, 35, NOW(), NOW()),
(72, 'Miso', 60000, 20, 35, NOW(), NOW()),
(73, 'Tonkotsu', 65000, 15, 35, NOW(), NOW()),

-- Ramen - Độ cay (variant_options_id: 37)
(74, 'Không cay', 0, 50, 37, NOW(), NOW()),
(75, 'Cay vừa', 0, 50, 37, NOW(), NOW()),
(76, 'Cay nhiều', 0, 30, 37, NOW(), NOW());

-- ===============================================
-- PRODUCTS (Sản phẩm cụ thể)
-- ===============================================

-- Phở (product_categories_id: 1)
INSERT INTO product (id, name, description, img_main, is_active, price_base, product_categories_id, created_at, updated_at) VALUES
(1, 'Phở Bò Hà Nội', 'Phở bò truyền thống với nước dùng được ninh từ xương bò suốt 12 tiếng, thịt bò tươi ngon và bánh phở dai mềm', '/images/pho-bo-hanoi.jpg', true, 45000, 1, NOW(), NOW()),
(2, 'Phở Gà Thơm Ngon', 'Phở gà với nước dùng trong vắt, thịt gà thả vườn tươi ngon, rau thơm đầy đủ', '/images/pho-ga.jpg', true, 40000, 1, NOW(), NOW()),
(3, 'Phở Đặc Biệt Sài Gòn', 'Phở đặc biệt với đầy đủ loại thịt bò: tái, chín, gầu, gân, sách. Phù hợp cho những ai muốn thưởng thức trọn vẹn hương vị phở', '/images/pho-dac-biet.jpg', true, 55000, 1, NOW(), NOW()),

-- Bún bò Huế (product_categories_id: 2)
(4, 'Bún Bò Huế Chính Gốc', 'Bún bò Huế với nước dùng cay nồng, chả cua, giò heo, bún tươi và rau sống đặc trưng xứ Huế', '/images/bun-bo-hue.jpg', true, 48000, 2, NOW(), NOW()),
(5, 'Bún Bò Huế Chay', 'Phiên bản chay của bún bò Huế với nước dùng từ nấm và rau củ, đậu hũ chiên và rau sống', '/images/bun-bo-hue-chay.jpg', true, 42000, 2, NOW(), NOW()),

-- Bánh mì (product_categories_id: 3)
(6, 'Bánh Mì Thịt Nướng', 'Bánh mì giòn rụm với thịt nướng thơm lừng, pate, rau sống và gia vị đặc biệt', '/images/banh-mi-thit-nuong.jpg', true, 25000, 3, NOW(), NOW()),
(7, 'Bánh Mì Pate', 'Bánh mì truyền thống với pate gan heo, chả lụa, dưa leo và rau thơm', '/images/banh-mi-pate.jpg', true, 20000, 3, NOW(), NOW()),
(8, 'Bánh Mì Đặc Biệt', 'Bánh mì với đầy đủ loại nhân: thịt nướng, pate, chả cua, trứng và rau sống', '/images/banh-mi-dac-biet.jpg', true, 35000, 3, NOW(), NOW()),

-- Cơm tấm (product_categories_id: 4)
(9, 'Cơm Tấm Sườn Nướng', 'Cơm tấm với sườn nướng thơm phức, chả trứng, bì và nước mắm pha chua ngọt', '/images/com-tam-suon-nuong.jpg', true, 35000, 4, NOW(), NOW()),
(10, 'Cơm Tấm Đặc Biệt', 'Cơm tấm đầy đủ với sườn nướng, bì, chả, trứng và tôm khô rang', '/images/com-tam-dac-biet.jpg', true, 45000, 4, NOW(), NOW()),

-- Pizza Italy (product_categories_id: 36)
(11, 'Pizza Margherita Classic', 'Pizza truyền thống Italy với sốt cà chua tươi, phô mai Mozzarella và lá húng quế tươi', '/images/pizza-margherita.jpg', true, 150000, 36, NOW(), NOW()),
(12, 'Pizza Quattro Stagioni', 'Pizza 4 mùa với nấm, ham, artichoke và olives trên nền sốt cà chua thơm ngon', '/images/pizza-quattro-stagioni.jpg', true, 180000, 36, NOW(), NOW()),
(13, 'Pizza Diavola', 'Pizza cay với pepperoni cay, phô mai Mozzarella và ớt đỏ tươi', '/images/pizza-diavola.jpg', true, 170000, 36, NOW(), NOW()),

-- Pizza Mỹ (product_categories_id: 37)
(14, 'Pizza Supreme', 'Pizza kiểu Mỹ với pepperoni, xúc xích, ớt chuông, nấm và hành tây', '/images/pizza-supreme.jpg', true, 200000, 37, NOW(), NOW()),
(15, 'Pizza Meat Lovers', 'Pizza dành cho người yêu thịt với pepperoni, xúc xích, thịt xông khói và ham', '/images/pizza-meat-lovers.jpg', true, 220000, 37, NOW(), NOW()),

-- Burger bò (product_categories_id: 38)
(16, 'Classic Beef Burger', 'Burger bò classic với thịt bò Angus 100%, rau xanh, cà chua và sốt đặc biệt', '/images/classic-beef-burger.jpg', true, 65000, 38, NOW(), NOW()),
(17, 'BBQ Bacon Burger', 'Burger bò với thịt xông khói giòn, sốt BBQ và hành tây chiên', '/images/bbq-bacon-burger.jpg', true, 75000, 38, NOW(), NOW()),
(18, 'Double Cheeseburger', 'Burger 2 lớp thịt bò với phô mai cheddar tan chảy', '/images/double-cheeseburger.jpg', true, 95000, 38, NOW(), NOW()),

-- Burger gà (product_categories_id: 39)
(19, 'Crispy Chicken Burger', 'Burger gà giòn rụm với sốt mayonnaise và rau xanh tươi', '/images/crispy-chicken-burger.jpg', true, 58000, 39, NOW(), NOW()),
(20, 'Spicy Chicken Burger', 'Burger gà cay với sốt buffalo và dưa chuột muối', '/images/spicy-chicken-burger.jpg', true, 62000, 39, NOW(), NOW()),

-- Trà sữa trân châu (product_categories_id: 41)
(21, 'Trà Sữa Trân Châu Đường Đen', 'Trà sữa đậm đà với trân châu đường đen dai mềm và cream cheese béo ngậy', '/images/tra-sua-tran-chau-duong-den.jpg', true, 35000, 41, NOW(), NOW()),
(22, 'Trà Sữa Oolong Truyền Thống', 'Trà sữa pha từ trà oolong cao cấp với trân châu trắng và đường phên', '/images/tra-sua-oolong.jpg', true, 32000, 41, NOW(), NOW()),
(23, 'Trà Sữa Matcha', 'Trà sữa vị matcha Nhật Bản thơm ngon với topping trân châu và thạch dừa', '/images/tra-sua-matcha.jpg', true, 38000, 41, NOW(), NOW()),

-- Trà sữa kem cheese (product_categories_id: 42)
(24, 'Brown Sugar Milk Tea', 'Trà sữa đường nâu với lớp kem cheese mặn ngọt hài hòa', '/images/brown-sugar-milk-tea.jpg', true, 42000, 42, NOW(), NOW()),
(25, 'Taro Milk Tea Cheese', 'Trà sữa khoai môn với kem cheese thơm béo', '/images/taro-cheese-milk-tea.jpg', true, 40000, 42, NOW(), NOW()),

-- Cà phê đen (product_categories_id: 43)
(26, 'Cà Phê Đen Đá', 'Cà phê đen truyền thống pha phin với hạt cà phê Robusta đậm đà', '/images/ca-phe-den-da.jpg', true, 18000, 43, NOW(), NOW()),
(27, 'Cà Phê Đen Nóng', 'Cà phê đen nóng thơm lừng, phù hợp cho buổi sáng', '/images/ca-phe-den-nong.jpg', true, 15000, 43, NOW(), NOW()),

-- Cà phê sữa (product_categories_id: 44)
(28, 'Cà Phê Sữa Đá', 'Cà phê sữa đá truyền thống Việt Nam với sữa đặc ngọt ngào', '/images/ca-phe-sua-da.jpg', true, 22000, 44, NOW(), NOW()),
(29, 'Bạc Xỉu Đá', 'Bạc xỉu với tỷ lệ sữa nhiều hơn, vị ngọt nhẹ nhàng', '/images/bac-xiu-da.jpg', true, 25000, 44, NOW(), NOW()),

-- Gà rán (product_categories_id: 75)
(30, 'Gà Rán Giòn Truyền Thống', 'Gà rán với lớp vỏ giòn rụm, thịt gà mềm ngọt bên trong, tẩm ướp gia vị đặc biệt', '/images/ga-ran-gion-truyen-thong.jpg', true, 45000, 75, NOW(), NOW()),
(31, 'Gà Rán Cay Hàn Quốc', 'Gà rán kiểu Hàn Quốc với sốt gochujang cay nồng và mè rang', '/images/ga-ran-cay-han-quoc.jpg', true, 50000, 75, NOW(), NOW()),
(32, 'Gà Rán Mật Ong', 'Gà rán tẩm sốt mật ong ngọt ngào, thơm phức', '/images/ga-ran-mat-ong.jpg', true, 53000, 75, NOW(), NOW()),

-- Lẩu Thái (product_categories_id: 15)
(33, 'Lẩu Tom Yum Hải Sản', 'Lẩu Tom Yum chua cay với tôm, mực, cua và nấm các loại', '/images/lau-tom-yum-hai-san.jpg', true, 180000, 15, NOW(), NOW()),
(34, 'Lẩu Thái Chay', 'Lẩu Thái chay với nước dùng từ rau củ và nấm, đậu phụ và rau xanh', '/images/lau-thai-chay.jpg', true, 150000, 15, NOW(), NOW()),

-- Sushi (product_categories_id: 25)
(35, 'Sashimi Mix Set', 'Set sashimi gồm cá hồi, cá ngừ và cá trắng tươi ngon', '/images/sashimi-mix-set.jpg', true, 120000, 25, NOW(), NOW()),
(36, 'California Roll', 'Sushi cuộn California với cua, bơ và dưa chuột', '/images/california-roll.jpg', true, 85000, 25, NOW(), NOW()),
(37, 'Salmon Teriyaki Roll', 'Sushi cuốn cá hồi nướng teriyaki với rong biển và cơm', '/images/salmon-teriyaki-roll.jpg', true, 95000, 25, NOW(), NOW()),

-- Ramen (product_categories_id: 27)
(38, 'Shoyu Ramen', 'Ramen nước dùng shoyu (nước tương) với thịt xá xíu, trứng lòng đào và rau xanh', '/images/shoyu-ramen.jpg', true, 55000, 27, NOW(), NOW()),
(39, 'Tonkotsu Ramen', 'Ramen nước dùng xương heo đậm đà với thịt xá xíu và trứng lòng đào', '/images/tonkotsu-ramen.jpg', true, 65000, 27, NOW(), NOW()),
(40, 'Miso Ramen', 'Ramen nước dùng miso với rau củ và thịt heo', '/images/miso-ramen.jpg', true, 60000, 27, NOW(), NOW()),

-- Xôi (product_categories_id: 70)
(41, 'Xôi Gà', 'Xôi nếp thơm với thịt gà luộc, hành phi và nước mắm', '/images/xoi-ga.jpg', true, 25000, 70, NOW(), NOW()),
(42, 'Xôi Xíu Mại', 'Xôi nếp với xíu mại hấp và tương ớt', '/images/xoi-xiu-mai.jpg', true, 22000, 70, NOW(), NOW()),

-- Cháo (product_categories_id: 72)
(43, 'Cháo Gà Tần', 'Cháo gà ninh nhừ với thịt gà băm và rau thơm', '/images/chao-ga-tan.jpg', true, 28000, 72, NOW(), NOW()),
(44, 'Cháo Hến', 'Cháo hến đặc sản với hến xào và rau thơm', '/images/chao-hen.jpg', true, 30000, 72, NOW(), NOW()),

-- Sinh tố (product_categories_id: 63)
(45, 'Sinh Tố Bơ', 'Sinh tố bơ béo ngậy với sữa tươi và đá bào', '/images/sinh-to-bo.jpg', true, 28000, 63, NOW(), NOW()),
(46, 'Sinh Tố Dâu', 'Sinh tố dâu tây tươi mát với sữa chua', '/images/sinh-to-dau.jpg', true, 32000, 63, NOW(), NOW()),

-- Bánh ngọt (product_categories_id: 47)
(47, 'Tiramisu', 'Bánh Tiramisu Italy với lớp kem mascarpone và cà phê đắng', '/images/tiramisu.jpg', true, 45000, 47, NOW(), NOW()),
(48, 'Cheesecake Blueberry', 'Bánh phô mai với topping blueberry tươi', '/images/cheesecake-blueberry.jpg', true, 50000, 47, NOW(), NOW()),

-- Salad (product_categories_id: 56)
(49, 'Salad Caesar', 'Salad Caesar với rau xà lách, phô mai parmesan và sốt Caesar', '/images/salad-caesar.jpg', true, 65000, 56, NOW(), NOW()),
(50, 'Salad Cobb', 'Salad Cobb với gà nướng, thịt xông khói, trứng và bơ', '/images/salad-cobb.jpg', true, 75000, 56, NOW(), NOW());

-- ===============================================
-- PRODUCT VARIANTS (Biến thể sản phẩm cụ thể)
-- ===============================================

INSERT INTO product_variants (id, created_at, updated_at, img_url, price, status, sku, stock_quantity, product_id, variant_option_id) VALUES
-- Loại phở (variant_option_id: 1)
(1, NOW(), NOW(), '/images/pho-bo-tai.jpg', 45000, 'ACTIVE', 'PHO-BO-TAI-001', 50, 1, 1),
(2, NOW(), NOW(), '/images/pho-bo-chin.jpg', 45000, 'ACTIVE', 'PHO-BO-CHIN-001', 50, 1, 1),
(3, NOW(), NOW(), '/images/pho-dac-biet-hanoi.jpg', 55000, 'ACTIVE', 'PHO-DAC-BIET-001', 25, 1, 1),
-- Size (variant_option_id: 2)
(4, NOW(), NOW(), '/images/pho-size-nho.jpg', 0, 'ACTIVE', 'PHO-SIZE-S-001', 100, 1, 2),
(5, NOW(), NOW(), '/images/pho-size-vua.jpg', 5000, 'ACTIVE', 'PHO-SIZE-M-001', 100, 1, 2),
(6, NOW(), NOW(), '/images/pho-size-lon.jpg', 10000, 'ACTIVE', 'PHO-SIZE-L-001', 100, 1, 2),
-- Topping (variant_option_id: 3)
(7, NOW(), NOW(), '/images/pho-them-thit.jpg', 15000, 'ACTIVE', 'PHO-THEM-THIT-001', 50, 1, 3),
(8, NOW(), NOW(), '/images/pho-them-trung.jpg', 8000, 'ACTIVE', 'PHO-THEM-TRUNG-001', 50, 1, 3),

-- Phở Gà (product_id: 2)
(9, NOW(), NOW(), '/images/pho-ga-standard.jpg', 40000, 'ACTIVE', 'PHO-GA-STD-002', 30, 2, 1),
(10, NOW(), NOW(), '/images/pho-ga-size-s.jpg', 0, 'ACTIVE', 'PHO-GA-SIZE-S-002', 100, 2, 2),
(11, NOW(), NOW(), '/images/pho-ga-size-l.jpg', 10000, 'ACTIVE', 'PHO-GA-SIZE-L-002', 100, 2, 2),

-- Bánh Mì Thịt Nướng (product_id: 6)
(12, NOW(), NOW(), '/images/banh-mi-thit-nuong-std.jpg', 25000, 'ACTIVE', 'BANH-MI-TN-006', 40, 6, 4),
(13, NOW(), NOW(), '/images/banh-mi-combo-nuoc-ngot.jpg', 10000, 'ACTIVE', 'BANH-MI-COMBO-NS-006', 50, 6, 5),
(14, NOW(), NOW(), '/images/banh-mi-combo-ca-phe.jpg', 15000, 'ACTIVE', 'BANH-MI-COMBO-CF-006', 30, 6, 5),

-- Bánh Mì Pate (product_id: 7)
(15, NOW(), NOW(), '/images/banh-mi-pate-std.jpg', 20000, 'ACTIVE', 'BANH-MI-PATE-007', 40, 7, 4),
(16, NOW(), NOW(), '/images/banh-mi-pate-combo.jpg', 10000, 'ACTIVE', 'BANH-MI-PATE-COMBO-007', 50, 7, 5),

-- Cơm Tấm Sườn Nướng (product_id: 9)
(17, NOW(), NOW(), '/images/com-tam-suon-std.jpg', 35000, 'ACTIVE', 'COM-TAM-SUON-009', 30, 9, 6),
(18, NOW(), NOW(), '/images/com-tam-combo-nuoc.jpg', 15000, 'ACTIVE', 'COM-TAM-COMBO-009', 25, 9, 7),

-- Pizza Margherita (product_id: 11)
(19, NOW(), NOW(), '/images/pizza-margherita-s.jpg', 150000, 'ACTIVE', 'PIZZA-MAR-S-011', 20, 11, 8),
(20, NOW(), NOW(), '/images/pizza-margherita-m.jpg', 220000, 'ACTIVE', 'PIZZA-MAR-M-011', 15, 11, 8),
(21, NOW(), NOW(), '/images/pizza-margherita-l.jpg', 320000, 'ACTIVE', 'PIZZA-MAR-L-011', 10, 11, 8),
-- Đế pizza (variant_option_id: 9)
(22, NOW(), NOW(), '/images/pizza-de-mong.jpg', 0, 'ACTIVE', 'PIZZA-DE-MONG-011', 50, 11, 9),
(23, NOW(), NOW(), '/images/pizza-de-day.jpg', 15000, 'ACTIVE', 'PIZZA-DE-DAY-011', 50, 11, 9),
(24, NOW(), NOW(), '/images/pizza-de-pho-mai.jpg', 25000, 'ACTIVE', 'PIZZA-DE-CHEESE-011', 30, 11, 9),

-- Pizza Supreme (product_id: 14)
(25, NOW(), NOW(), '/images/pizza-supreme-s.jpg', 180000, 'ACTIVE', 'PIZZA-SUP-S-014', 20, 14, 11),
(26, NOW(), NOW(), '/images/pizza-supreme-m.jpg', 250000, 'ACTIVE', 'PIZZA-SUP-M-014', 15, 14, 11),
(27, NOW(), NOW(), '/images/pizza-supreme-l.jpg', 350000, 'ACTIVE', 'PIZZA-SUP-L-014', 10, 14, 11),

-- Classic Beef Burger (product_id: 16)
(28, NOW(), NOW(), '/images/burger-bo-classic.jpg', 65000, 'ACTIVE', 'BURGER-BO-CLA-016', 25, 16, 13),
(29, NOW(), NOW(), '/images/burger-combo-khoai.jpg', 25000, 'ACTIVE', 'BURGER-COMBO-K-016', 50, 16, 14),
(30, NOW(), NOW(), '/images/burger-combo-full.jpg', 35000, 'ACTIVE', 'BURGER-COMBO-F-016', 30, 16, 14),

-- BBQ Bacon Burger (product_id: 17)
(31, NOW(), NOW(), '/images/burger-bbq-bacon.jpg', 75000, 'ACTIVE', 'BURGER-BBQ-017', 20, 17, 13),
(32, NOW(), NOW(), '/images/burger-bbq-combo.jpg', 25000, 'ACTIVE', 'BURGER-BBQ-COMBO-017', 50, 17, 14),

-- Crispy Chicken Burger (product_id: 19)
(33, NOW(), NOW(), '/images/burger-ga-gion.jpg', 58000, 'ACTIVE', 'BURGER-GA-GION-019', 25, 19, 15),
(34, NOW(), NOW(), '/images/burger-ga-combo.jpg', 25000, 'ACTIVE', 'BURGER-GA-COMBO-019', 50, 19, 16),

-- Trà Sữa Trân Châu Đường Đen (product_id: 21)
(35, NOW(), NOW(), '/images/tra-sua-tc-dd-m.jpg', 35000, 'ACTIVE', 'TS-TC-DD-M-021', 100, 21, 17),
(36, NOW(), NOW(), '/images/tra-sua-tc-dd-l.jpg', 43000, 'ACTIVE', 'TS-TC-DD-L-021', 100, 21, 17),
(37, NOW(), NOW(), '/images/tra-sua-tc-dd-xl.jpg', 50000, 'ACTIVE', 'TS-TC-DD-XL-021', 50, 21, 17),
-- Độ ngọt (variant_option_id: 18)
(38, NOW(), NOW(), '/images/tra-sua-0-duong.jpg', 0, 'ACTIVE', 'TS-0DUONG-021', 100, 21, 18),
(39, NOW(), NOW(), '/images/tra-sua-50-duong.jpg', 0, 'ACTIVE', 'TS-50DUONG-021', 100, 21, 18),
(40, NOW(), NOW(), '/images/tra-sua-100-duong.jpg', 0, 'ACTIVE', 'TS-100DUONG-021', 100, 21, 18),
-- Topping (variant_option_id: 19)
(41, NOW(), NOW(), '/images/tra-sua-tran-chau-den.jpg', 5000, 'ACTIVE', 'TS-TRAN-CHAU-DEN-021', 100, 21, 19),
(42, NOW(), NOW(), '/images/tra-sua-tran-chau-trang.jpg', 5000, 'ACTIVE', 'TS-TRAN-CHAU-TRANG-021', 100, 21, 19),
(43, NOW(), NOW(), '/images/tra-sua-thach-dua.jpg', 8000, 'ACTIVE', 'TS-THACH-DUA-021', 50, 21, 19),

-- Trà Sữa Oolong (product_id: 22)
(44, NOW(), NOW(), '/images/tra-sua-oolong-m.jpg', 32000, 'ACTIVE', 'TS-OOLONG-M-022', 100, 22, 17),
(45, NOW(), NOW(), '/images/tra-sua-oolong-l.jpg', 40000, 'ACTIVE', 'TS-OOLONG-L-022', 100, 22, 17),

-- Brown Sugar Milk Tea (product_id: 24)
(46, NOW(), NOW(), '/images/brown-sugar-m.jpg', 42000, 'ACTIVE', 'BROWN-SUGAR-M-024', 100, 24, 20),
(47, NOW(), NOW(), '/images/brown-sugar-l.jpg', 52000, 'ACTIVE', 'BROWN-SUGAR-L-024', 100, 24, 20),
-- Độ ngọt (variant_option_id: 21)
(48, NOW(), NOW(), '/images/brown-sugar-0.jpg', 0, 'ACTIVE', 'BROWN-SUGAR-0-024', 100, 24, 21),
(49, NOW(), NOW(), '/images/brown-sugar-70.jpg', 0, 'ACTIVE', 'BROWN-SUGAR-70-024', 100, 24, 21),

-- Cà Phê Đen Đá (product_id: 26)
(50, NOW(), NOW(), '/images/ca-phe-den-nho.jpg', 18000, 'ACTIVE', 'CF-DEN-S-026', 100, 26, 22),
(51, NOW(), NOW(), '/images/ca-phe-den-lon.jpg', 26000, 'ACTIVE', 'CF-DEN-L-026', 100, 26, 22),

-- Cà Phê Sữa Đá (product_id: 28)
(52, NOW(), NOW(), '/images/ca-phe-sua-nho.jpg', 22000, 'ACTIVE', 'CF-SUA-S-028', 100, 28, 24),
(53, NOW(), NOW(), '/images/ca-phe-sua-lon.jpg', 32000, 'ACTIVE', 'CF-SUA-L-028', 100, 28, 24),

-- Gà Rán Giòn Truyền Thống (product_id: 30)
(54, NOW(), NOW(), '/images/ga-ran-2-mieng.jpg', 45000, 'ACTIVE', 'GA-RAN-2M-030', 30, 30, 26),
(55, NOW(), NOW(), '/images/ga-ran-4-mieng.jpg', 85000, 'ACTIVE', 'GA-RAN-4M-030', 25, 30, 26),
(56, NOW(), NOW(), '/images/ga-ran-6-mieng.jpg', 120000, 'ACTIVE', 'GA-RAN-6M-030', 20, 30, 26),
(57, NOW(), NOW(), '/images/ga-ran-9-mieng.jpg', 170000, 'ACTIVE', 'GA-RAN-9M-030', 15, 30, 26),
-- Vị (variant_option_id: 27)
(58, NOW(), NOW(), '/images/ga-ran-truyen-thong.jpg', 0, 'ACTIVE', 'GA-RAN-TT-030', 100, 30, 27),
(59, NOW(), NOW(), '/images/ga-ran-cay-han.jpg', 5000, 'ACTIVE', 'GA-RAN-CAY-030', 50, 30, 27),
(60, NOW(), NOW(), '/images/ga-ran-mat-ong.jpg', 8000, 'ACTIVE', 'GA-RAN-HONEY-030', 30, 30, 27),

-- Gà Rán Cay Hàn Quốc (product_id: 31)
(61, NOW(), NOW(), '/images/ga-ran-han-2m.jpg', 50000, 'ACTIVE', 'GA-HAN-2M-031', 30, 31, 26),
(62, NOW(), NOW(), '/images/ga-ran-han-4m.jpg', 90000, 'ACTIVE', 'GA-HAN-4M-031', 25, 31, 26),

-- Lẩu Tom Yum Hải Sản (product_id: 33)
(63, NOW(), NOW(), '/images/lau-tomyum-2-3ng.jpg', 180000, 'ACTIVE', 'LAU-TY-2-3-033', 15, 33, 29),
(64, NOW(), NOW(), '/images/lau-tomyum-4-5ng.jpg', 280000, 'ACTIVE', 'LAU-TY-4-5-033', 10, 33, 29),
(65, NOW(), NOW(), '/images/lau-tomyum-6-8ng.jpg', 380000, 'ACTIVE', 'LAU-TY-6-8-033', 8, 33, 29),

-- Sashimi Mix Set (product_id: 35)
(66, NOW(), NOW(), '/images/sashimi-8-mieng.jpg', 120000, 'ACTIVE', 'SASHIMI-8M-035', 20, 35, 33),
(67, NOW(), NOW(), '/images/sashimi-12-mieng.jpg', 180000, 'ACTIVE', 'SASHIMI-12M-035', 15, 35, 33),
(68, NOW(), NOW(), '/images/sashimi-16-mieng.jpg', 240000, 'ACTIVE', 'SASHIMI-16M-035', 10, 35, 33),

-- Shoyu Ramen (product_id: 38)
(69, NOW(), NOW(), '/images/shoyu-ramen-std.jpg', 55000, 'ACTIVE', 'SHOYU-RAMEN-038', 25, 38, 35),
-- Độ cay (variant_option_id: 37)
(70, NOW(), NOW(), '/images/ramen-khong-cay.jpg', 0, 'ACTIVE', 'RAMEN-0CAY-038', 50, 38, 37),
(71, NOW(), NOW(), '/images/ramen-cay-vua.jpg', 0, 'ACTIVE', 'RAMEN-CAY-VUA-038', 50, 38, 37),
(72, NOW(), NOW(), '/images/ramen-cay-nhieu.jpg', 0, 'ACTIVE', 'RAMEN-CAY-NHIEU-038', 30, 38, 37),

-- Tonkotsu Ramen (product_id: 39)
(73, NOW(), NOW(), '/images/tonkotsu-ramen-std.jpg', 65000, 'ACTIVE', 'TONKOTSU-RAMEN-039', 15, 39, 35),
(74, NOW(), NOW(), '/images/tonkotsu-khong-cay.jpg', 0, 'ACTIVE', 'TONKOTSU-0CAY-039', 50, 39, 37),

-- Sinh Tố Bơ (product_id: 45)
(75, NOW(), NOW(), '/images/sinh-to-bo-std.jpg', 28000, 'ACTIVE', 'SINH-TO-BO-045', 50, 45, NULL),

-- Sinh Tố Dâu (product_id: 46)
(76, NOW(), NOW(), '/images/sinh-to-dau-std.jpg', 32000, 'ACTIVE', 'SINH-TO-DAU-046', 50, 46, NULL),

-- Tiramisu (product_id: 47)
(77, NOW(), NOW(), '/images/tiramisu-std.jpg', 45000, 'ACTIVE', 'TIRAMISU-047', 30, 47, NULL),

-- Salad Caesar (product_id: 49)
(78, NOW(), NOW(), '/images/salad-caesar-std.jpg', 65000, 'ACTIVE', 'SALAD-CAESAR-049', 25, 49, NULL),

-- Xôi Gà (product_id: 41)
(79, NOW(), NOW(), '/images/xoi-ga-std.jpg', 25000, 'ACTIVE', 'XOI-GA-041', 40, 41, NULL),

-- Cháo Gà Tần (product_id: 43)
(80, NOW(), NOW(), '/images/chao-ga-tan-std.jpg', 28000, 'ACTIVE', 'CHAO-GA-TAN-043', 35, 43, NULL);


-- ===============================================
-- PRODUCT VARIANT VALUES (Liên kết giá trị variant với product variant)
-- ===============================================

INSERT INTO product_variant_values (id, created_at, updated_at, quantity, value_id, variant_id) VALUES
-- Phở Bò Hà Nội (product_id: 1)
-- Loại phở variants (variant_ids: 1,2,3) với variant_values (1,2,4)
(1, NOW(), NOW(), 1, 1, 1),   -- Phở bò tái
(2, NOW(), NOW(), 1, 2, 2),   -- Phở bò chín  
(3, NOW(), NOW(), 1, 4, 3),   -- Phở đặc biệt
-- Size variants (variant_ids: 4,5,6) với variant_values (5,6,7)
(4, NOW(), NOW(), 1, 5, 4),   -- Size nhỏ
(5, NOW(), NOW(), 1, 6, 5),   -- Size vừa
(6, NOW(), NOW(), 1, 7, 6),   -- Size lớn
-- Topping variants (variant_ids: 7,8) với variant_values (8,9)
(7, NOW(), NOW(), 1, 8, 7),   -- Thêm thịt
(8, NOW(), NOW(), 1, 9, 8),   -- Thêm trứng

-- Phở Gà (product_id: 2)
(9, NOW(), NOW(), 1, 3, 9),   -- Phở gà (variant_value_id: 3)
(10, NOW(), NOW(), 1, 5, 10), -- Size nhỏ
(11, NOW(), NOW(), 1, 7, 11), -- Size lớn

-- Bánh Mì Thịt Nướng (product_id: 6)
(12, NOW(), NOW(), 1, 11, 12), -- Bánh mì thịt nướng (variant_value_id: 11)
(13, NOW(), NOW(), 1, 16, 13), -- Combo nước ngọt (variant_value_id: 16)
(14, NOW(), NOW(), 1, 17, 14), -- Combo cà phê (variant_value_id: 17)

-- Bánh Mì Pate (product_id: 7)
(15, NOW(), NOW(), 1, 12, 15), -- Bánh mì pate (variant_value_id: 12)
(16, NOW(), NOW(), 1, 16, 16), -- Combo nước ngọt

-- Cơm Tấm Sườn Nướng (product_id: 9)
(17, NOW(), NOW(), 1, 18, 17), -- Cơm tấm sườn (variant_value_id: 18)
(18, NOW(), NOW(), 1, 36, 18), -- Combo khoai + nước (variant_value_id: 36)

-- Pizza Margherita (product_id: 11)
-- Size variants (variant_ids: 19,20,21) với variant_values (21,22,23)
(19, NOW(), NOW(), 1, 21, 19), -- Size S
(20, NOW(), NOW(), 1, 22, 20), -- Size M
(21, NOW(), NOW(), 1, 23, 21), -- Size L
-- Đế pizza variants (variant_ids: 22,23,24) với variant_values (27,28,29)
(22, NOW(), NOW(), 1, 27, 22), -- Đế mỏng
(23, NOW(), NOW(), 1, 28, 23), -- Đế dày
(24, NOW(), NOW(), 1, 29, 24), -- Đế phô mai

-- Pizza Supreme (product_id: 14)
(25, NOW(), NOW(), 1, 24, 25), -- Size S (variant_value_id: 24)
(26, NOW(), NOW(), 1, 25, 26), -- Size M (variant_value_id: 25)
(27, NOW(), NOW(), 1, 26, 27), -- Size L (variant_value_id: 26)

-- Classic Beef Burger (product_id: 16)
(28, NOW(), NOW(), 1, 32, 28), -- Burger bò classic (variant_value_id: 32)
(29, NOW(), NOW(), 1, 36, 29), -- Combo khoai + nước (variant_value_id: 36)
(30, NOW(), NOW(), 1, 37, 30), -- Combo full (variant_value_id: 37)

-- BBQ Bacon Burger (product_id: 17)
(31, NOW(), NOW(), 1, 33, 31), -- Burger BBQ (variant_value_id: 33)
(32, NOW(), NOW(), 1, 36, 32), -- Combo khoai + nước

-- Crispy Chicken Burger (product_id: 19)
(33, NOW(), NOW(), 1, 32, 33), -- Sử dụng lại variant_value cho burger gà
(34, NOW(), NOW(), 1, 38, 34), -- Combo gà (variant_value_id: 38)

-- Trà Sữa Trân Châu Đường Đen (product_id: 21)
-- Size variants (variant_ids: 35,36,37) với variant_values (39,40,41)
(35, NOW(), NOW(), 1, 39, 35), -- Size M
(36, NOW(), NOW(), 1, 40, 36), -- Size L
(37, NOW(), NOW(), 1, 41, 37), -- Size XL
-- Độ ngọt variants (variant_ids: 38,39,40) với variant_values (44,45,46)
(38, NOW(), NOW(), 1, 44, 38), -- 0% đường
(39, NOW(), NOW(), 1, 45, 39), -- 50% đường
(40, NOW(), NOW(), 1, 46, 40), -- 100% đường
-- Topping variants (variant_ids: 41,42,43) với variant_values (50,51,52)
(41, NOW(), NOW(), 1, 50, 41), -- Trân châu đen
(42, NOW(), NOW(), 1, 51, 42), -- Trân châu trắng
(43, NOW(), NOW(), 1, 52, 43), -- Thạch dừa

-- Trà Sữa Oolong (product_id: 22)
(44, NOW(), NOW(), 1, 39, 44), -- Size M
(45, NOW(), NOW(), 1, 40, 45), -- Size L

-- Brown Sugar Milk Tea (product_id: 24)
(46, NOW(), NOW(), 1, 42, 46), -- Size M (variant_value_id: 42)
(47, NOW(), NOW(), 1, 43, 47), -- Size L (variant_value_id: 43)
(48, NOW(), NOW(), 1, 47, 48), -- 0% đường (variant_value_id: 47)
(49, NOW(), NOW(), 1, 48, 49), -- 70% đường (variant_value_id: 48)

-- Cà Phê Đen Đá (product_id: 26)
(50, NOW(), NOW(), 1, 54, 50), -- Size nhỏ (variant_value_id: 54)
(51, NOW(), NOW(), 1, 55, 51), -- Size lớn (variant_value_id: 55)

-- Cà Phê Sữa Đá (product_id: 28)
(52, NOW(), NOW(), 1, 56, 52), -- Size nhỏ (variant_value_id: 56)
(53, NOW(), NOW(), 1, 57, 53), -- Size lớn (variant_value_id: 57)

-- Gà Rán Giòn Truyền Thống (product_id: 30)
-- Số miếng variants (variant_ids: 54,55,56,57) với variant_values (58,59,60,61)
(54, NOW(), NOW(), 1, 58, 54), -- 2 miếng
(55, NOW(), NOW(), 1, 59, 55), -- 4 miếng
(56, NOW(), NOW(), 1, 60, 56), -- 6 miếng
(57, NOW(), NOW(), 1, 61, 57), -- 9 miếng
-- Vị variants (variant_ids: 58,59,60) với variant_values (62,63,64)
(58, NOW(), NOW(), 1, 62, 58), -- Gà truyền thống
(59, NOW(), NOW(), 1, 63, 59), -- Gà cay Hàn
(60, NOW(), NOW(), 1, 64, 60), -- Gà mật ong

-- Gà Rán Cay Hàn Quốc (product_id: 31)
(61, NOW(), NOW(), 1, 58, 61), -- 2 miếng
(62, NOW(), NOW(), 1, 59, 62), -- 4 miếng

-- Lẩu Tom Yum Hải Sản (product_id: 33)
(63, NOW(), NOW(), 1, 65, 63), -- Nồi 2-3 người (variant_value_id: 65)
(64, NOW(), NOW(), 1, 66, 64), -- Nồi 4-5 người (variant_value_id: 66)
(65, NOW(), NOW(), 1, 67, 65), -- Nồi 6-8 người (variant_value_id: 67)

-- Sashimi Mix Set (product_id: 35)
(66, NOW(), NOW(), 1, 68, 66), -- Set 8 miếng (variant_value_id: 68)
(67, NOW(), NOW(), 1, 69, 67), -- Set 12 miếng (variant_value_id: 69)
(68, NOW(), NOW(), 1, 70, 68), -- Set 16 miếng (variant_value_id: 70)

-- Shoyu Ramen (product_id: 38)
(69, NOW(), NOW(), 1, 71, 69), -- Shoyu (variant_value_id: 71)
(70, NOW(), NOW(), 1, 74, 70), -- Không cay (variant_value_id: 74)
(71, NOW(), NOW(), 1, 75, 71), -- Cay vừa (variant_value_id: 75)
(72, NOW(), NOW(), 1, 76, 72), -- Cay nhiều (variant_value_id: 76)

-- Tonkotsu Ramen (product_id: 39)
(73, NOW(), NOW(), 1, 73, 73), -- Tonkotsu (variant_value_id: 73)
(74, NOW(), NOW(), 1, 74, 74), -- Không cay

-- Các sản phẩm không có variant (quantity = 0 cho các sản phẩm đơn giản)
-- Sinh Tố Bơ (variant_id: 75)
(75, NOW(), NOW(), 0, NULL, 75),

-- Sinh Tố Dâu (variant_id: 76)
(76, NOW(), NOW(), 0, NULL, 76),

-- Tiramisu (variant_id: 77)
(77, NOW(), NOW(), 0, NULL, 77),

-- Salad Caesar (variant_id: 78)
(78, NOW(), NOW(), 0, NULL, 78),

-- Xôi Gà (variant_id: 79)
(79, NOW(), NOW(), 0, NULL, 79),

-- Cháo Gà Tần (variant_id: 80)
(80, NOW(), NOW(), 0, NULL, 80);