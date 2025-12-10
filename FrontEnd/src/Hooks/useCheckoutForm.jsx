// src/hooks/useCheckoutForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // [MỚI] Để chuyển trang
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartProvider"; // [MỚI] Lấy giỏ hàng
import { useFilters } from "../context/FilterProvider"; // [MỚI] Lấy Store ID
import { db } from "../services/dbService"; // [MỚI] Gọi API Server

const createDateOptions = () => {
  const options = [];
  const today = new Date();
  const dayNames = { 0: "Hôm nay", 1: "Ngày mai", 2: "Ngày kia" };
  for (let i = 0; i < 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    options.push({
      text: dayNames[i],
      date: `${date.getDate()}/${date.getMonth() + 1}`,
      value: date.toISOString().split("T")[0],
    });
  }
  return options;
};

const createTimeOptions = () => {
  const options = [];
  for (let i = 8; i <= 21; i++) {
    const hour = i.toString().padStart(2, "0");
    options.push(`${hour}:00`);
  }
  return options;
};

export function useCheckoutForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { auth } = useAuth();

  // 1. Lấy dữ liệu cần thiết từ các Context khác
  const { cartItems, getCartTotal, clearSelectedItems } = useCart();
  const { filters } = useFilters();
  const currentStoreId = filters.storeId || "RES-01"; // Mặc định Store 1

  const [state, setState] = useState({
    deliveryType: "delivery",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryOption: "now",
    deliveryTime: "08:00",
    pickupBranch: currentStoreId,
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "CASH",
  });

  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state

  // Auto fill thông tin user
  useEffect(() => {
    if (auth) {
      setState((prevState) => ({
        ...prevState,
        name: auth.accountName || auth.fullName || "",
        phone: auth.phone || "",
        address: auth.address || "",
      }));
    }
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePaymentMethodChange = (e) => {
    const val = e.target ? e.target.value : e;
    setState((prevState) => ({ ...prevState, paymentMethod: val }));
  };

  const handleDeliveryTypeChange = (type) =>
    setState((prev) => ({ ...prev, deliveryType: type }));
  const handleDateChange = (date) =>
    setState((prev) => ({ ...prev, deliveryDate: date }));
  const handleDeliveryOptionChange = (e) =>
    setState((prev) => ({ ...prev, deliveryOption: e.target.value }));
  const handleTimeChange = (e) =>
    setState((prev) => ({ ...prev, deliveryTime: e.target.value }));
  const handleBranchChange = (e) =>
    setState((prev) => ({ ...prev, pickupBranch: e.target.value }));

  // --- [QUAN TRỌNG] HÀM TẠO ĐƠN HÀNG THẬT SỰ ---
  const handlePlaceOrder = async () => {
    // 1. Validate
    if (
      !state.name ||
      !state.phone ||
      (state.deliveryType === "delivery" && !state.address)
    ) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng điền đầy đủ thông tin giao hàng",
        type: "error",
      });
      return;
    }

    // Lọc các món đã chọn mua
    const selectedItems = cartItems.filter((item) => item.selected);
    if (selectedItems.length === 0) {
      showToast({
        title: "Lỗi",
        message: "Vui lòng chọn món để thanh toán!",
        type: "error",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // 2. Chuẩn bị dữ liệu gửi lên Server
      // (Khớp với cấu trúc db.json bạn mong muốn)
      const orderData = {
        userId: auth?.id || "GUEST",
        restaurantId: currentStoreId,
        storeName: "KHK Food Chi Nhánh " + currentStoreId, // Có thể fetch tên store nếu cần

        orderStatus: "PLACED",
        paymentMethod: state.paymentMethod,

        totalPrice: getCartTotal() + 15000, // Cộng phí ship cứng 15k
        note: state.note,
        orderTime: new Date().toLocaleString("vi-VN"),

        // Thông tin giao hàng
        deliveryInfo: {
          name: state.name,
          phone: state.phone,
          address:
            state.deliveryType === "delivery" ? state.address : "Nhận tại quán",
          type: state.deliveryType === "delivery" ? "HOME" : "PICKUP",
        },

        // Danh sách món ăn
        orderItems: selectedItems.map((item) => ({
          productId: item.id,
          productName: item.productName || item.name,
          quantity: item.quantity,
          price: item.price || item.priceBase,
          imgUrl: item.imgUrl || item.imgMain,
          note: item.note || "",
          optionValuesDTO: item.optionValuesDTO || [],
        })),

        // Giả lập tọa độ khách hàng (để Drone bay)
        customerLocation: [
          10.776019 + (Math.random() - 0.5) * 0.01,
          106.702068 + (Math.random() - 0.5) * 0.01,
        ],
        customerAddress: state.address,
      };

      // 3. GỌI API TẠO ĐƠN
      const newOrder = await db.orders.add(orderData);

      // 4. Thành công -> Xóa giỏ -> Chuyển trang
      await clearSelectedItems();

      showToast({
        title: "Thành công",
        message: `Đặt hàng thành công! Mã đơn: ${newOrder.id}`,
        type: "success",
      });

      // Đợi xíu cho Toast hiện rồi chuyển trang
      setTimeout(() => {
        navigate("/order-history");
      }, 1000);
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      showToast({
        title: "Thất bại",
        message: "Lỗi khi tạo đơn hàng. Vui lòng thử lại.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    state,
    isSubmitting, // Trả về trạng thái loading
    handleInputChange,
    handlePaymentMethodChange,
    handleDeliveryTypeChange,
    handleDateChange,
    handleDeliveryOptionChange,
    handleTimeChange,
    handleBranchChange,
    handlePlaceOrder, // Hàm này giờ đã có logic xịn
    dateOptions: createDateOptions(),
    timeOptions: createTimeOptions(),
  };
}
