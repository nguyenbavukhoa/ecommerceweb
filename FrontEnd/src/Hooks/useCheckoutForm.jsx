import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartProvider";
import orderService from "../services/orderService";

export function useCheckoutForm() {
  const { showToast } = useToast();
  const { auth } = useAuth();
  const { cartItems, clearSelectedItems } = useCart();
  const navigate = useNavigate();

  // State Form (Giữ nguyên)
  const [state, setState] = useState({
    deliveryType: "delivery",
    paymentMethod: "cash",
    userInfoId: null, // Lưu ID user info
    name: "",
    phone: "",
    address: "",
    note: "",
  });

  const [loading, setLoading] = useState(false);

  // ... (Các hàm handleInputChange, handlePaymentMethodChange giữ nguyên) ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    const val = e.target?.value || e.target; // Xử lý cả event hoặc value trực tiếp
    setState((prevState) => ({ ...prevState, paymentMethod: val }));
  };

  // Hàm xử lý đặt hàng
  // finalDeliveryInfo: Chính là object `selectedAddress` từ CheckoutPage truyền vào
  const handlePlaceOrder = async (finalDeliveryInfo, storeId) => {
    setLoading(true);

    const selectedItems = cartItems.filter((i) => i.selected);

    if (selectedItems.length === 0) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng chọn sản phẩm để đặt hàng.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    // Validate địa chỉ
    if (!finalDeliveryInfo) {
      showToast({ title: "Lỗi", message: "Chưa chọn địa chỉ.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      // [LOGIC SỬA ĐỔI]
      // Trích xuất userInfoId trực tiếp từ địa chỉ đã chọn
      // finalDeliveryInfo chính là object từ API getUserInfos trả về, nên nó có trường `id`
      const userInfoId = finalDeliveryInfo.id;

      // Chuẩn bị data để gọi Service
      const orderData = {
        items: selectedItems,
        note: state.note,
        userInfoId: userInfoId, // Truyền thẳng ID
        // Truyền kèm thông tin chi tiết để phòng trường hợp Service cần tạo mới (fallback)
        deliveryInfo: finalDeliveryInfo,
        restaurantId: storeId,
      };

      // Gọi Service
      const result = await orderService.createOrder(orderData);

      // Thành công
      const orderId = result.data?.id || result.id;
      showToast({
        title: "Thành công",
        message: `Đặt hàng thành công! Mã đơn: ${orderId}`,
        type: "success",
      });

      if (clearSelectedItems) await clearSelectedItems();
      setTimeout(() => navigate("/order-history"), 1500);
    } catch (error) {
      const msg = error.response?.data?.message || "Đặt hàng thất bại.";
      showToast({ title: "Lỗi", message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return {
    state,
    loading,
    handleInputChange,
    handlePaymentMethodChange,
    handlePlaceOrder, // Export hàm này
  };
}
