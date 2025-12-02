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

  // 3. LẤY ĐƠN HÀNG THEO NHÀ HÀNG (ADMIN/STORE) - [ĐÃ CẬP NHẬT]
  // Hỗ trợ phân trang để phục vụ Admin Table
  getOrdersByRestaurant: async (storeId, page = 1, size = 10) => {
    try {
      // [FIX] URL đúng theo API Doc: GET /restaurants/{id}/orders
      console.log(`📡 Calling API: /restaurants/${storeId}/orders`);

      const response = await axiosClient.get(`/restaurants/${storeId}/orders`, {
        params: {
          page: page - 1,
          size: size,
        },
      });

      const data = response.data || response;

      // [FIX] Xử lý Response: API Doc mẫu trả về Mảng [...] (không phân trang)
      // Nếu data là mảng -> Map về cấu trúc chuẩn để FilterProvider dùng được
      if (Array.isArray(data)) {
        return {
          content: data,
          totalPages: 1, // Giả lập 1 trang vì API trả hết list
          totalElements: data.length,
        };
      }

      // Trường hợp API trả về phân trang (PageImpl) như /orders/all
      if (data.content) {
        return {
          content: data.content,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
        };
      }

      return { content: [], totalPages: 0, totalElements: 0 };
    } catch (error) {
      console.error("❌ [OrderService] Get Store Orders Failed:", error);
      return { content: [], totalPages: 0, totalElements: 0 };
    }
  },
  // 4. CẬP NHẬT TRẠNG THÁI (HỦY/DUYỆT ĐƠN)
  updateStatus: async (orderId, status) => {
    try {
      return await axiosClient.get(`/orders/update-status/${orderId}`, {
        params: { status },
      });
    } catch (error) {
      throw error;
    }
  },
};

export default orderService;
