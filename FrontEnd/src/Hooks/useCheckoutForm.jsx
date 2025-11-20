// src/hooks/useCheckoutForm.jsx
import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext"; // Import useAuth để lấy thông tin user

// --- Các hàm tiện ích để tạo lựa chọn ngày/giờ ---
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
  const { showToast } = useToast();
  const { auth } = useAuth(); // Lấy thông tin user từ AuthContext

  const [state, setState] = useState({
    deliveryType: "delivery",
    deliveryDate: new Date().toISOString().split("T")[0],
    deliveryOption: "now",
    deliveryTime: "08:00",
    pickupBranch: "chinhanh-1",
    name: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "CASH", // Mặc định là thanh toán tiền mặt
  });

  // Tự động điền thông tin người dùng nếu đã đăng nhập
  useEffect(() => {
    if (auth) {
      setState((prevState) => ({
        ...prevState,
        name: auth.accountName || "",
        phone: auth.phone || "",
        address: auth.address || "",
      }));
    }
  }, [auth]); // Thêm auth vào dependency array

  // --- Các hàm xử lý thay đổi trên form ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  // Hàm xử lý thay đổi phương thức thanh toán
  const handlePaymentMethodChange = (e) => {
    setState((prevState) => ({ ...prevState, paymentMethod: e.target.value }));
  };
  const handleDeliveryTypeChange = (type) =>
    setState((prevState) => ({ ...prevState, deliveryType: type }));
  const handleDateChange = (date) =>
    setState((prevState) => ({ ...prevState, deliveryDate: date }));
  const handleDeliveryOptionChange = (e) =>
    setState((prevState) => ({ ...prevState, deliveryOption: e.target.value }));
  const handleTimeChange = (e) =>
    setState((prevState) => ({ ...prevState, deliveryTime: e.target.value }));
  const handleBranchChange = (e) =>
    setState((prevState) => ({ ...prevState, pickupBranch: e.target.value }));

  // --- Hàm xử lý khi nhấn nút Đặt Hàng ---
  const handlePlaceOrder = (selectedItems, finalTotal) => {
    if (selectedItems.length === 0) {
      showToast({
        title: "Thông báo",
        message: "Vui lòng chọn sản phẩm để thanh toán!",
        type: "warning",
      });
      return;
    }
    if (
      !state.name ||
      !state.phone ||
      (state.deliveryType === "delivery" && !state.address)
    ) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng điền đầy đủ thông tin người nhận.",
        type: "warning",
      });
      return;
    }

    // Tạo object đơn hàng để gửi đi
    const orderData = {
      customerInfo: {
        name: state.name,
        phone: state.phone,
        address: state.address,
      },
      items: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        note: item.note,
        optionValueIds: item.optionValuesDTO.map((opt) => opt.id),
      })),
      orderNote: state.note,
      delivery: {
        type: state.deliveryType,
        date: state.deliveryDate,
        timeOption: state.deliveryOption,
        time: state.deliveryOption === "schedule" ? state.deliveryTime : "now",
        branch: state.deliveryType === "pickup" ? state.pickupBranch : null,
      },
      paymentMethod: state.paymentMethod, // Thêm phương thức thanh toán vào dữ liệu gửi đi
      total: finalTotal,
    };

    console.log("ĐƠN HÀNG SẼ ĐƯỢC GỬI ĐI:", orderData);
    showToast({
      title: "Thành công",
      message: "Đặt hàng thành công!",
      type: "success",
    });
    // Tương lai: Gọi API để gửi `orderData` lên server ở đây
  };

  const dateOptions = createDateOptions();
  const timeOptions = createTimeOptions();

  return {
    state,
    handleInputChange,
    handlePaymentMethodChange,
    handleDeliveryTypeChange,
    handleDateChange,
    handleDeliveryOptionChange,
    handleTimeChange,
    handleBranchChange,
    handlePlaceOrder,
    dateOptions,
    timeOptions,
  };
}
