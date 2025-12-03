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

      const finalPayload = {
        orderStatus: "PLACED",
        listOrderItems: listOrderItems,
        userInfoId: userInfoId.toString(),
        note: orderData.note || "",
      };

      const response = await axiosClient.post("/orders/create", finalPayload);
      return response.data || response;
    } catch (error) {
      console.error("❌ [OrderService] Create Order Failed:", error);
      throw error;
    }
  },

  // 2. LẤY LỊCH SỬ ĐƠN HÀNG (Sửa theo API Doc: GET /orders/all)
  getMyOrders: async () => {
    try {
      console.log("📡 [OrderService] Calling GET /orders/all");
      const response = await axiosClient.get("/orders/all");

      // Cấu trúc Response Doc: { success: true, data: { content: [], ... } }
      // axiosClient thường trả về data gốc
      const data = response.data || response;

      // Lấy mảng content bên trong
      if (data && data.content) {
        return data.content;
      }
      return [];
    } catch (error) {
      console.error("❌ [OrderService] Get History Failed:", error);
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
