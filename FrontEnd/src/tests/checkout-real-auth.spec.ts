import { test, expect } from "@playwright/test";

// --- CẤU HÌNH ---
const BASE_URL = "http://localhost:5173";
const USER_EMAIL = "kien06112004@gmail.com";
const USER_PASS = "Kien123456@";

test.describe("E2E: Luồng Mua Hàng & Đo Hiệu Năng", () => {
  // Timeout tổng thể 60s
  test.setTimeout(60000);

  // --- BƯỚC 1: ĐĂNG NHẬP ---
  test.beforeEach(async ({ page }) => {
    console.log("🔑 Bắt đầu đăng nhập...");
    const startLogin = Date.now();

    await page.goto(`${BASE_URL}/auth?action=login`);
    await page.getByTestId("login-email").fill(USER_EMAIL);
    await page.getByTestId("login-password").fill(USER_PASS);
    await page.getByTestId("login-submit").click();

    try {
      await expect(page).toHaveURL(BASE_URL, { timeout: 10000 });
    } catch (e) {
      const toast = page.locator('.toast-message, div[class*="toast"]');
      if ((await toast.count()) > 0 && (await toast.first().isVisible())) {
        const errorText = await toast.first().innerText();
        throw new Error(`🛑 ĐĂNG NHẬP THẤT BẠI! Web báo lỗi: "${errorText}"`);
      }
      throw e;
    }

    const loginDuration = Date.now() - startLogin;
    console.log(`✅ Đăng nhập thành công! (Mất: ${loginDuration}ms)`);
    await expect(page.getByText(/xin chào|tài khoản/i)).toBeVisible();
  });

  // --- BƯỚC 2: KỊCH BẢN MUA HÀNG ---
  test("User đặt hàng thành công (Có đo độ trễ & lấy Mã đơn)", async ({
    page,
  }, testInfo) => {
    // === A. THÊM SẢN PHẨM ===
    console.log("🛒 Đang thêm sản phẩm...");
    await page.waitForSelector(".card-product", { timeout: 10000 });
    await page.locator(".card-image-link").first().click();

    const addToCartBtn = page.getByRole("button", { name: /thêm vào giỏ/i });
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();
    await expect(page.getByText(/đã thêm món/i)).toBeVisible();

    // Chờ Cart Modal mở
    const cartModal = page.locator(".modal-cart.open");
    await expect(cartModal).toBeVisible();

    // === B. XỬ LÝ CHECKBOX ===
    const uncheckIcon = page.locator("i.fa-regular.fa-circle").first();
    if (await uncheckIcon.isVisible()) {
      await uncheckIcon.click();
      await expect(
        page.locator("i.fa-solid.fa-circle-check").first()
      ).toBeVisible();
      await page.waitForTimeout(500);
    }

    // === C. THANH TOÁN ===
    console.log("💳 Chuyển sang trang thanh toán...");
    const checkoutBtn = page.getByRole("button", { name: /thanh toán/i });
    await expect(checkoutBtn).not.toHaveClass(/disabled/);
    await checkoutBtn.click();
    await expect(page).toHaveURL(/\/checkout/);

    // === D. QUẢN LÝ ĐỊA CHỈ ===
    console.log("📍 Đang nhập địa chỉ giao hàng...");
    await page.getByRole("button", { name: /thay đổi|thêm địa chỉ/i }).click();
    await page.getByRole("button", { name: /thêm địa chỉ mới/i }).click();

    const randomPhone = "09" + Math.floor(Math.random() * 100000000);
    await page.getByPlaceholder(/tên người nhận/i).fill("Playwright Test User");
    await page.getByPlaceholder(/số điện thoại/i).fill(randomPhone);
    await page.getByPlaceholder(/địa chỉ/i).fill("123 Đường Test Playwright");
    await page.getByRole("button", { name: /công ty/i }).click();
    await page.getByRole("button", { name: /lưu địa chỉ/i }).click();

    await expect(page.getByText(/đã thêm địa chỉ/i)).toBeVisible();
    await page.getByText(randomPhone).first().click();
    await expect(page.getByText("123 Đường Test Playwright")).toBeVisible();

    // === E. ĐẶT HÀNG & PHÂN TÍCH KẾT QUẢ ===
    console.log("🚀 Đang gửi yêu cầu đặt hàng (Bắt đầu đo thời gian)...");

    // 1. Bắt đầu bấm giờ
    const startTime = Date.now();

    // 2. Click Đặt hàng
    await page.getByRole("button", { name: /đặt hàng/i }).click();

    // 3. Đợi thông báo thành công xuất hiện
    // Lưu ý: Lưu locator vào biến để xử lý tiếp
    const successToast = page.getByText(/đặt hàng thành công/i);
    await expect(successToast).toBeVisible({ timeout: 20000 });

    // 4. Kết thúc bấm giờ
    const endTime = Date.now();
    const latency = endTime - startTime;

    // 5. Trích xuất Mã đơn hàng từ text thông báo
    // Text thường là: "Đặt hàng thành công! Mã đơn: 12345"
    const toastText = await successToast.innerText();
    const orderIdMatch = toastText.match(/Mã đơn:\s*(\d+)/i);
    const orderId = orderIdMatch ? orderIdMatch[1] : "Không tìm thấy";

    // 6. Ghi Log chi tiết ra Terminal (Màu mè cho đẹp)
    console.log("\n========================================");
    console.log("🎉 KẾT QUẢ TEST ĐẶT HÀNG");
    console.log("========================================");
    console.log(`📦 Mã đơn hàng: \x1b[32m${orderId}\x1b[0m`); // Màu xanh lá
    console.log(`⏱️ Độ trễ API (Latency): \x1b[33m${latency}ms\x1b[0m`); // Màu vàng
    console.log(`👤 Khách hàng: Playwright Test User`);
    console.log(`📞 SĐT nhận hàng: ${randomPhone}`);
    console.log("========================================\n");

    // 7. Gắn thông tin vào Report HTML của Playwright (để show cho sếp/khách hàng xem)
    testInfo.annotations.push({ type: "Order ID", description: orderId });
    testInfo.annotations.push({ type: "Latency", description: `${latency}ms` });

    // 8. Chụp ảnh màn hình làm bằng chứng
    await page.screenshot({
      path: `proof-order-${orderId}.png`,
      fullPage: true,
    });

    // 9. Verify chuyển trang cuối cùng
    await expect(page).toHaveURL(/\/order-history/);
  });
});
