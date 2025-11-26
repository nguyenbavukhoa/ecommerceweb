import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

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
  const { auth } = useAuth();

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
    paymentMethod: "CASH",
  });

  useEffect(() => {
    if (auth) {
      setState((prevState) => ({
        ...prevState,
        name: auth.accountName || "",
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
    // Xử lý cả trường hợp e.target.value trực tiếp hoặc object custom
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

  // Hàm handlePlaceOrder không cần sửa nhiều vì CheckoutPage đã tự xử lý logic rồi
  const handlePlaceOrder = () => {}; // Placeholder

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
    dateOptions: createDateOptions(),
    timeOptions: createTimeOptions(),
  };
}
