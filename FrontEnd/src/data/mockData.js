// --- DỮ LIỆU TRẠNG THÁI ---
export const STATUSES = [
  { id: "pending", label: "Chờ xác nhận", iconClass: "fas fa-hourglass-half" },
  { id: "picking", label: "Đang lấy hàng", iconClass: "fas fa-box-open" },
  { id: "shipping", label: "Đang vận chuyển", iconClass: "fas fa-truck" },
  { id: "delivered", label: "Đã giao", iconClass: "fas fa-check-circle" },
  { id: "returned", label: "Hoàn trả", iconClass: "fas fa-undo-alt" },
  { id: "cancelled", label: "Đã huỷ", iconClass: "fas fa-ban" },
];

// --- HÀM TẠO DỮ LIỆU MẪU ---
const createOrder = (idPrefix, status, deliveredAt = null) => {
  const order = {
    id: `${idPrefix}${String(Math.floor(Math.random() * 900) + 100).padStart(
      3,
      "0"
    )}`,
    status,
    deliveredAt,
    products: [
      {
        id: `p${Math.random()}`,
        name: "Burger Bò Phô Mai",
        image: "https://via.placeholder.com/150/e67e22/ffffff?text=Burger",
        options: "Lớn, Phô mai tan chảy, Pepsi",
        quantity: 1,
        price: 88000,
      },
      {
        id: `p${Math.random()}`,
        name: "Burger Cá",
        image: "https://via.placeholder.com/150/3498db/ffffff?text=Fish",
        options: "Coca-cola",
        quantity: 1,
        price: 61000,
      },
    ],
    subTotal: 149000,
    shippingFee: 15000,
    finalTotal: 164000,
    shippingInfo: {
      partner: "Giao hàng Tiết Kiệm",
      trackingCode: `GHTK${Math.floor(Math.random() * 900000) + 100000}`,
      note: "Giao hàng trong giờ hành chính.",
    },
    deliveryAddress: {
      name: "Trần Văn A",
      phone: "0909123456",
      address: "123 Đường A, Phường B, Quận C, TP. HCM",
    },
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    timestamps: {
      orderedAt: "2025-10-21T15:30:00Z",
      paidAt: status !== "pending" ? "2025-10-21T15:31:00Z" : null,
      pickedUpAt: ["shipping", "delivered"].includes(status)
        ? "2025-10-21T16:05:00Z"
        : null,
      completedAt: deliveredAt,
    },
  };

  // Nếu là đơn hàng bị hủy, thêm quy trình hủy 3 bước
  if (status === "cancelled") {
    order.cancellationProcess = {
      currentStep: 1, // Bước hiện tại (0: yêu cầu, 1: chấp nhận, 2: đã xử lý)
      steps: ["Gửi yêu cầu", "Được chấp nhận", "Đã xử lý hoàn tiền"],
    };
  }

  return order;
};

// --- DỮ LIỆU ĐƠN HÀNG ---
export const ALL_ORDERS = [
  ...Array.from({ length: 5 }, () => createOrder(`P`, "pending")),
  ...Array.from({ length: 5 }, () => createOrder(`PK`, "picking")),
  ...Array.from({ length: 5 }, () => createOrder(`S`, "shipping")),
  ...Array.from({ length: 2 }, () =>
    createOrder(
      `D`,
      "delivered",
      new Date(Date.now() - 30 * 60 * 1000).toISOString()
    )
  ),
  ...Array.from({ length: 3 }, () =>
    createOrder(
      `D`,
      "delivered",
      new Date(Date.now() - 120 * 60 * 1000).toISOString()
    )
  ),
  ...Array.from({ length: 5 }, () => createOrder(`R`, "returned")),
  ...Array.from({ length: 5 }, () => createOrder(`C`, "cancelled")),
];
