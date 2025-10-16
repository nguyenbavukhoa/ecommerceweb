import React from "react";

function AdminPage() {
  const arr = [
    "Trang tổng quan",
    "Sản phẩm",
    "Khách hàng",
    "Đơn hàng",
    "Thống kê",
    "Trang chủ",
    "Thông tin",
    "Đăng xuất",
  ];
  return (
    <div style={{ padding: "0 20px" }}>
      <WapperTypeLabel>
        {arr.map((item, index) => {
          return <div key={index} name={item} />;
        })}
      </WapperTypeLabel>
    </div>
  );
}
export default AdminPage;
