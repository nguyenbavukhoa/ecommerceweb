import { test, expect } from "@playwright/test";

const BASE_URL = "http://localhost:5173"; // Đổi port nếu cần

test.describe("Luồng Mua Hàng Của User (Đã Đăng Nhập)", () => {
  // 1. SETUP: GIẢ LẬP ĐĂNG NHẬP TRƯỚC MỖI TEST
  // Playwright sẽ tự động bơm Token vào LocalStorage trước khi bật trình duyệt
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      // Giả lập dữ liệu khớp với AuthContext.jsx
      localStorage.setItem("accessToken", "fake-jwt-token-cho-test");
      localStorage.setItem(
        "user_info",
        JSON.stringify({
          id: 1,
          email: "testuser@gmail.com",
          fullName: "Test User",
          role: "USER",
          active: true,
        })
      );
      // Giả lập luôn storeId nếu cần (dựa trên filter)
      localStorage.setItem("currentStoreId", "1");
    });
  });

  test("User chọn món và đặt hàng thành công", async ({ page }) => {
    // --- BƯỚC 1: VÀO TRANG CHỦ ---
    await page.goto(BASE_URL);

    // Kiểm tra đã đăng nhập chưa (Ví dụ: Không còn thấy nút "Đăng nhập" hoặc thấy Avatar)
    // Tùy giao diện header của bạn, nhưng nếu localStorage có data thì AuthContext sẽ setAuth(user)

    // --- BƯỚC 2: CHỌN MÓN ---
    // Chờ list sản phẩm load xong (ProductListComponent.jsx)
    await page.waitForSelector(".card-product", { timeout: 10000 });

    // Click vào món đầu tiên (ProductItemComponent.jsx)
    await page.locator(".card-image-link").first().click();

    // Chờ Modal hiện ra và click "Thêm vào giỏ" (ProductDetailsComponent.jsx)
    const addButton = page.locator(".button-dat");
    await expect(addButton).toBeVisible();

    // (Optional) Tăng số lượng lên 2
    await page.locator(".plus.is-form").click();

    // Click thêm
    await addButton.click();

    // Verify Toast (CartProvider.jsx)
    await expect(page.getByText("Đã thêm món!")).toBeVisible();

    // Đóng Modal chi tiết (Nếu UI không tự đóng thì cần nhấn nút X hoặc click ra ngoài)
    // Giả sử click ra vùng tối bên ngoài modal (overlay) hoặc nhấn Esc
    await page.keyboard.press("Escape");

    // --- BƯỚC 3: MỞ GIỎ HÀNG ---
    // [QUAN TRỌNG] Bạn cần thay thế selector này bằng class của icon giỏ hàng trên Header của bạn
    // Ví dụ: <div className="header-cart" onClick={openCart}>...</div>
    // Nếu chưa biết class, hãy thêm data-testid="open-cart-btn" vào Header
    await page.locator(".header-action_cart").first().click(); // Ví dụ class thường gặp
    // Hoặc thử tìm theo icon:
    // await page.locator('i.fa-basket-shopping-simple').first().click();

    // Verify Modal Cart mở (CartModal.jsx)
    await expect(page.locator(".modal-cart.open")).toBeVisible();

    // --- BƯỚC 4: SANG TRANG CHECKOUT ---
    // Click nút Thanh toán (CartModal.jsx)
    await page.locator("button.thanh-toan").click();

    // Verify URL đổi sang /checkout
    await expect(page).toHaveURL(/\/checkout/);

    // --- BƯỚC 5: ĐIỀN THÔNG TIN ĐẶT HÀNG (useCheckoutForm.jsx) ---
    // Dựa vào handleInputChange: name="name", name="phone", name="address", name="note"

    // Chờ form load
    await page.waitForSelector('input[name="name"]');

    // Điền form
    await page.locator('input[name="name"]').fill("Nguyễn Văn Test");
    await page.locator('input[name="phone"]').fill("0909123456");
    await page
      .locator('input[name="address"]')
      .fill("123 Đường Test Playwright");
    await page.locator('textarea[name="note"]').fill("Giao giờ hành chính");

    // Chọn phương thức thanh toán (Nếu có radio button)
    // await page.check('input[value="cash"]');

    // --- BƯỚC 6: XÁC NHẬN ĐẶT HÀNG ---
    // Tìm nút đặt hàng. Trong CheckoutPage thường là nút submit form hoặc nút cuối trang
    // Giả sử text là "Đặt hàng"
    await page.getByRole("button", { name: /đặt hàng/i }).click();

    // --- BƯỚC 7: VERIFY KẾT QUẢ ---
    // 1. Chờ Toast thành công (useCheckoutForm.jsx: "Đặt hàng thành công! Mã đơn...")
    await expect(page.getByText(/Đặt hàng thành công/)).toBeVisible({
      timeout: 15000,
    }); // API có thể chậm nên tăng timeout

    // 2. Verify chuyển hướng sang trang lịch sử (useCheckoutForm.jsx: navigate("/order-history"))
    await expect(page).toHaveURL(/\/order-history/);
  });
});
