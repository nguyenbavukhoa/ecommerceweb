import axiosClient from "./axiosClient";

const orderService = {
  // 1. TẠO ĐƠN HÀNG (Giữ nguyên logic đã sửa đúng ở bước trước)
  createOrder: async (orderData) => {
    try {
      let userInfoId = orderData.userInfoId;

      if (!userInfoId && orderData.deliveryInfo) {
        const userInfoPayload = {
          fullName:
            orderData.deliveryInfo.fullName || orderData.deliveryInfo.name,
          phoneNumber:
            orderData.deliveryInfo.phoneNumber || orderData.deliveryInfo.phone,
          address: orderData.deliveryInfo.address,
          gender: orderData.deliveryInfo.gender || "OTHER",
        };
        const userInfoRes = await axiosClient.post(
          "/user-info",
          userInfoPayload
        );
        const resData = userInfoRes.data || userInfoRes;
        userInfoId = resData.id;
      }

      if (!userInfoId) {
        throw new Error("Lỗi: Không xác định được userInfoId.");
      }

      const listOrderItems = orderData.items.map((item) => {
        const options = item.optionValues || item.optionValuesDTO || [];
        const optionIds = options.map((opt) => opt.id);

        return {
          productId: item.productId,
          quantity: item.quantity,
          note: item.note || "",
          optionValueId: optionIds,
        };
      });

      // [QUAN TRỌNG] Thêm restaurantId vào Payload
      if (!orderData.restaurantId) {
        throw new Error(
          "Lỗi hệ thống: Thiếu thông tin Store ID (restaurantId)."
        );
      }

      const finalPayload = {
        orderStatus: "PLACED",
        listOrderItems: listOrderItems,
        userInfoId: userInfoId.toString(),
        note: orderData.note || "",
        restaurantId: orderData.restaurantId,
      };

      console.log("📦 [OrderService] Payload:", finalPayload);

      const response = await axiosClient.post("/orders/create", finalPayload);
      return response.data || response;
    } catch (error) {
      console.error("❌ [OrderService] Create Order Failed:", error);
      throw error;
    }
  },

  // 2. LẤY LỊCH SỬ ĐƠN HÀNG (Sửa theo API Doc: GET /orders/all)
  // getMyOrders: async () => {
  //   try {
  //     console.log("📡 [OrderService] Calling GET /orders/all");
  //     const response = await axiosClient.get("/orders/all");

  //     // Cấu trúc Response Doc: { success: true, data: { content: [], ... } }
  //     // axiosClient thường trả về data gốc
  //     const data = response.data || response;

  //     // Lấy mảng content bên trong
  //     if (data && data.content) {
  //       return data.content;
  //     }
  //     return [];
  //   } catch (error) {
  //     console.error("❌ [OrderService] Get History Failed:", error);
  //     return [];
  //   }
  // },
  // 2. LẤY LỊCH SỬ ĐƠN HÀNG (ĐÃ SỬA: LẤY TẤT CẢ CÁC TRANG)
  getMyOrders: async () => {
    let allOrders = [];
    let currentPage = 1; // Backend tính page từ 1
    let totalPages = 1;

    console.log("🚀 [OrderService] Bắt đầu lấy toàn bộ lịch sử đơn hàng...");

    try {
      do {
        // Gọi API lấy từng trang (size=20 để lấy nhanh hơn)
        const response = await axiosClient.get("/orders/all", {
          params: { page: currentPage, size: 20 },
        });

        // Xử lý cấu trúc trả về
        let rootData = response.data || response;
        let fetchedContent = [];
        let fetchedTotalPages = 0;

        // Case 1: { success: true, data: { content: [], totalPages: ... } }
        if (rootData.data && rootData.data.content) {
          fetchedContent = rootData.data.content;
          fetchedTotalPages = rootData.data.totalPages || 0;
        }
        // Case 2: { content: [], totalPages: ... }
        else if (rootData.content) {
          fetchedContent = rootData.content;
          fetchedTotalPages = rootData.totalPages || 0;
        }
        // Case 3: Trả về mảng trực tiếp (không phân trang)
        else if (Array.isArray(rootData)) {
          return rootData; // Trả về luôn
        }

        // Gộp đơn hàng vào danh sách tổng
        if (fetchedContent.length > 0) {
          allOrders = [...allOrders, ...fetchedContent];
          totalPages = fetchedTotalPages;
        } else {
          break; // Hết dữ liệu
        }

        currentPage++;
      } while (currentPage <= totalPages); // Lặp đến khi hết trang

      console.log(
        `✅ [OrderService] Đã tải xong ${allOrders.length} đơn hàng của User.`
      );
      return allOrders;
    } catch (error) {
      console.error("❌ [OrderService] Lỗi lấy lịch sử đơn:", error);
      return [];
    }
  },

  // 3. LẤY ĐƠN HÀNG THEO NHÀ HÀNG (ADMIN/STORE)
  getOrdersByRestaurant: async (storeId, page = 1) => {
    try {
      console.log(
        `📡 [OrderService] Calling API: /orders/restaurant/${storeId} (Page: ${page})`
      );

      const response = await axiosClient.get(`/orders/restaurant/${storeId}`, {
        params: { page: page },
      });

      // [LOGIC FIX] Kiểm tra kỹ cấu trúc trả về để lấy đúng mảng content
      // response có thể là Axios Response hoặc JSON body tùy vào interceptor

      // 1. Lấy JSON Body gốc
      // Nếu response.success tồn tại -> response là JSON body
      // Nếu response.data tồn tại -> có thể là Axios Object HOẶC JSON body có field 'data'

      let rootData = response;
      if (response.data && !response.success) {
        // Khả năng cao là Axios Object (vì JSON api thường có success:true)
        rootData = response.data;
      }

      // 2. Tìm object chứa 'content'
      // Trường hợp chuẩn: rootData.data.content (JSON: { success: true, data: { content: [] } })
      if (rootData.data && rootData.data.content) {
        return {
          content: rootData.data.content,
          totalPages: rootData.data.totalPages || 0,
          totalElements: rootData.data.totalElements || 0,
        };
      }

      // Trường hợp Interceptor đã bóc 1 lớp: rootData.content (JSON: { content: [] })
      if (rootData.content) {
        return {
          content: rootData.content,
          totalPages: rootData.totalPages || 0,
          totalElements: rootData.totalElements || 0,
        };
      }

      // Trường hợp mảng trực tiếp
      if (Array.isArray(rootData)) {
        return {
          content: rootData,
          totalPages: 1,
          totalElements: rootData.length,
        };
      }

      // Trường hợp mảng nằm trong rootData.data
      if (rootData.data && Array.isArray(rootData.data)) {
        return {
          content: rootData.data,
          totalPages: 1,
          totalElements: rootData.data.length,
        };
      }

      console.warn(
        "⚠️ [OrderService] Không tìm thấy dữ liệu đơn hàng hợp lệ.",
        rootData
      );
      return { content: [], totalPages: 0, totalElements: 0 };
    } catch (error) {
      console.error("❌ [OrderService] Get Store Orders Failed:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },

  // [QUAN TRỌNG] HÀM LẤY TẤT CẢ ĐƠN (Cho Admin Dashboard & Map)
  // Đã sửa logic vòng lặp và parser
  // getAllStoreOrders: async (storeId) => {
  //   let allOrders = [];
  //   let currentPage = 1;
  //   let totalPages = 1;
  //   const MAX_SAFETY_LOOP = 50; // Chặn lặp vô tận (tối đa 50 trang)

  //   console.log(`📡 Fetching ALL orders for Store: ${storeId}`);

  //   try {
  //     do {
  //       // Gọi API với size lớn để giảm số lần request
  //       const response = await axiosClient.get(
  //         `/orders/restaurant/${storeId}`,
  //         {
  //           params: { page: currentPage, size: 50 },
  //         }
  //       );

  //       const rootData = response.data || response;
  //       let fetchedContent = [];

  //       // --- XỬ LÝ PARSE DỮ LIỆU ---

  //       // CASE 1: API trả về mảng trực tiếp (Như JSON bạn gửi)
  //       if (Array.isArray(rootData)) {
  //         console.log("ℹ️ Detect Flat Array format");
  //         // Nếu là mảng phẳng, nghĩa là trả hết 1 lần -> lấy luôn và thoát vòng lặp
  //         allOrders = rootData;
  //         break;
  //       }

  //       // CASE 2: API trả về object phân trang chuẩn Spring Boot { content: [...], totalPages: 10 }
  //       if (rootData.content) {
  //         fetchedContent = rootData.content;
  //         totalPages = rootData.totalPages || 1;
  //       }
  //       // CASE 3: Lồng trong data { data: { content: [...] } }
  //       else if (rootData.data && rootData.data.content) {
  //         fetchedContent = rootData.data.content;
  //         totalPages = rootData.data.totalPages || 1;
  //       }

  //       // Gộp dữ liệu
  //       if (fetchedContent.length > 0) {
  //         allOrders = [...allOrders, ...fetchedContent];
  //       } else {
  //         break; // Không có dữ liệu thì dừng
  //       }

  //       currentPage++;
  //     } while (currentPage <= totalPages && currentPage <= MAX_SAFETY_LOOP);

  //     console.log(`✅ Loaded ${allOrders.length} orders total.`);
  //     return allOrders;
  //   } catch (error) {
  //     console.error("❌ Error fetching all orders:", error);
  //     return [];
  //   }
  // },
  getAllStoreOrders: async (storeId) => {
    let allOrders = [];

    // [FIX] Đổi endpoint sang đúng API bạn cung cấp: /restaurants/{storeId}/orders
    console.log(`📡 Fetching ALL orders for Store: ${storeId}`);

    try {
      // API này trả về mảng trực tiếp, không phân trang (theo JSON mẫu bạn gửi)
      const response = await axiosClient.get(`/restaurants/${storeId}/orders`);

      const rootData = response.data || response;

      // CASE 1: API trả về mảng trực tiếp (Đúng format JSON bạn gửi)
      if (Array.isArray(rootData)) {
        console.log("ℹ️ Detect Flat Array format");
        allOrders = rootData;
      }
      // CASE 2: Fallback nếu sau này API đổi ý bọc trong data (Optional)
      else if (rootData.data && Array.isArray(rootData.data)) {
        allOrders = rootData.data;
      }
      // CASE 3: Fallback nếu API có phân trang kiểu Spring Boot
      else if (rootData.content && Array.isArray(rootData.content)) {
        allOrders = rootData.content;
      }

      console.log(`✅ Loaded ${allOrders.length} orders total.`);
      return allOrders;
    } catch (error) {
      console.error("❌ Error fetching all orders:", error);
      return [];
    }
  },

  // 4. CẬP NHẬT TRẠNG THÁI - [ĐÃ SỬA METHOD PATCH]
  updateStatus: async (orderId, status) => {
    try {
      // API: PATCH /orders/update-status/{id}?status=...
      // Axios Patch tham số thứ 2 là body (để null), tham số thứ 3 là config
      return await axiosClient.patch(`/orders/update-status/${orderId}`, null, {
        params: { status },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
