import { test, expect } from "@playwright/test";

// --- CẤU HÌNH ---
const API_URL = "http://localhost:8080/api/v1";
const USER_EMAIL = "kien06112004@gmail.com";
const USER_PASS = "Kien123456@";

// [QUAN TRỌNG] ID CỨNG (Dùng khi không tìm được dynamic)
const FALLBACK_STORE_ID = 1;
const FALLBACK_PRODUCT_ID = 1; // ID sản phẩm thật bạn đã check
const FALLBACK_USER_INFO_ID = 151997319;

const TOTAL_ORDERS = 1000;
const BATCH_SIZE = 10; // Giảm xuống 10 để hạn chế lỗi xung đột giỏ hàng trên 1 user

test.describe("Stress Test 1000 Đơn (Add to Cart -> Checkout)", () => {
  test.setTimeout(1200000); // 20 phút

  test("Quy trình chuẩn: Thêm giỏ hàng => Đặt hàng", async ({ request }) => {
    // ==========================================
    // GIAI ĐOẠN 1: SETUP TOKEN & ID
    // ==========================================
    console.log(`\n🔑 [Step 1] Đang đăng nhập...`);
    const loginRes = await request.post(`${API_URL}/auth/login`, {
      data: { email: USER_EMAIL, password: USER_PASS },
    });
    expect(loginRes.ok(), "Đăng nhập thất bại").toBeTruthy();

    const loginData = await loginRes.json();
    const token =
      loginData.data?.accessToken || loginData.data?.token || loginData.token;
    const userId = loginData.data?.id || loginData.id;

    // --- 1. LẤY STORE & PRODUCT ---
    let storeId = FALLBACK_STORE_ID;
    let productId = FALLBACK_PRODUCT_ID;

    try {
      // Tìm quán đang hoạt động
      const storesRes = await request.get(`${API_URL}/restaurants`);
      if (storesRes.ok()) {
        const stores = await storesRes.json();
        const listStores = Array.isArray(stores) ? stores : stores.data || [];
        const activeStore = listStores.find((s: any) => s.active);

        if (activeStore) {
          // Tìm món của quán đó
          const prodRes = await request.get(
            `${API_URL}/products/restaurant/${activeStore.id}?page=1&size=10`
          );
          if (prodRes.ok()) {
            const prodData = await prodRes.json();
            const listProds = Array.isArray(prodData)
              ? prodData
              : prodData.content || prodData.data || [];
            if (listProds.length > 0) {
              storeId = activeStore.id;
              productId = listProds[0].id;
              console.log(
                `✅ Dynamic Data: Store ${storeId} | Product ${productId}`
              );
            }
          }
        }
      }
    } catch (e) {
      console.log("⚠️ Lỗi tìm data động, dùng Fallback ID");
    }

    // --- 2. LẤY USER INFO ---
    let userInfoId: number | undefined;
    try {
      const infoRes = await request.get(`${API_URL}/user-info/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (infoRes.ok()) {
        const infos = await infoRes.json();
        const listInfos = Array.isArray(infos) ? infos : infos.data || [];
        if (listInfos.length > 0) userInfoId = listInfos[0].id;
      }

      if (!userInfoId) {
        // Tạo mới nếu chưa có
        const randomPhone =
          "09" + Math.floor(10000000 + Math.random() * 90000000);
        const createRes = await request.post(`${API_URL}/user-info`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            fullName: "Stress Test",
            phoneNumber: randomPhone,
            address: "Auto Address",
            gender: "MALE",
          },
        });
        if (createRes.ok()) {
          const body = await createRes.json();
          userInfoId = body.id || body.data?.id;
        }
      }
    } catch (e) {}

    // Fallback cuối cùng
    const finalUserInfoId = userInfoId || FALLBACK_USER_INFO_ID;
    console.log(`📍 UserInfo ID: ${finalUserInfoId}`);

    // ==========================================
    // GIAI ĐOẠN 2: STRESS TEST LOOP
    // ==========================================
    console.log(`\n🚀 [Step 4] BẮT ĐẦU BOM ${TOTAL_ORDERS} ĐƠN...`);
    const startTime = Date.now();
    let successCount = 0;
    let failCount = 0;
    const errorsLog: string[] = [];

    // Hàm thực hiện 1 quy trình mua hàng trọn vẹn
    const processOneOrder = async (index: number) => {
      try {
        // BƯỚC A: THÊM VÀO GIỎ HÀNG (QUAN TRỌNG)
        // Endpoint: /cart-items/addCart (theo bạn cung cấp)
        const addCartRes = await request.post(`${API_URL}/cart-items/addCart`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            productId: productId.toString(), // Chuyển sang string cho chắc
            quantity: "1",
            note: `AddCart #${index}`,
            optionValueId: null, // Theo mẫu JSON bạn gửi
          },
        });

        if (!addCartRes.ok()) {
          const txt = await addCartRes.text();
          throw new Error(`AddCart Fail: ${addCartRes.status()} - ${txt}`);
        }

        // BƯỚC B: TẠO ĐƠN HÀNG (CHECKOUT)
        // Lưu ý: createOrder thường sẽ tự lấy items trong giỏ hàng DB
        // nhưng ta vẫn gửi kèm listOrderItems để đúng cấu trúc payload
        const orderPayload = {
          orderStatus: "PLACED",
          listOrderItems: [
            {
              productId: productId,
              quantity: 1,
              note: `Order #${index}`,
              optionValueId: [],
            },
          ],
          userInfoId: finalUserInfoId.toString(),
          note: `Stress Test #${index}`,
          restaurantId: storeId,
        };

        const orderRes = await request.post(`${API_URL}/orders/create`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: orderPayload,
        });

        if (orderRes.ok()) {
          return { success: true };
        } else {
          const txt = await orderRes.text();
          return {
            success: false,
            error: `CreateOrder Fail (${orderRes.status()}): ${txt}`,
          };
        }
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    };

    // Chạy vòng lặp
    for (let i = 0; i < TOTAL_ORDERS; i += BATCH_SIZE) {
      const batchPromises = [];
      const currentBatchSize = Math.min(BATCH_SIZE, TOTAL_ORDERS - i);
      const percent = Math.round((i / TOTAL_ORDERS) * 100);
      console.log(
        `... [${percent}%] Xử lý đơn ${i + 1} - ${i + currentBatchSize}`
      );

      for (let j = 0; j < currentBatchSize; j++) {
        batchPromises.push(processOneOrder(i + j + 1));
      }

      const results = await Promise.all(batchPromises);

      // Tổng hợp kết quả
      results.forEach((res) => {
        if (res.success) {
          successCount++;
        } else {
          failCount++;
          if (errorsLog.length < 5)
            errorsLog.push(res.error || "Unknown Error");
        }
      });
    }

    const totalTime = (Date.now() - startTime) / 1000;
    const rps = (TOTAL_ORDERS / totalTime).toFixed(2);

    console.log("\n========================================");
    console.log(`⏱️ Thời gian: ${totalTime}s`);
    console.log(`⚡ Tốc độ:    ${rps} quy trình/s`);
    console.log(`✅ Thành công: ${successCount}`);
    console.log(`❌ Thất bại:   ${failCount}`);
    if (failCount > 0) {
      console.log("⚠️ Mẫu lỗi:");
      errorsLog.forEach((e) => console.log(`   🔸 ${e}`));
    }
    console.log("========================================\n");

    expect(failCount).toBeLessThan(TOTAL_ORDERS * 0.1);
  });
});
