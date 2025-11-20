import React, { useState, useEffect, useMemo } from "react";
import { useToast } from "../../../../context/ToastContext";
import OrderDetailModal from "../../components/Modals/OrderDetailModal";
import styles from "./Orders.module.scss"; // Sẽ dùng chung style với Customers
import { vnd, formatDate } from "../../utils";

const Orders = () => {
  const { showToast } = useToast();
  const [allOrders, setAllOrders] = useState([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState("2"); // '2' = Tất cả
  const [searchTerm, setSearchTerm] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const loadOrders = () => {
    const ordersFromStorage = localStorage.getItem("order")
      ? JSON.parse(localStorage.getItem("order"))
      : [];
    setAllOrders(ordersFromStorage);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Logic lọc (từ findOrder())
  const filteredOrders = useMemo(() => {
    let result = allOrders;

    // Lọc trạng thái
    if (statusFilter !== "2") {
      result = result.filter(
        (item) => item.trangthai.toString() === statusFilter
      );
    }

    // Lọc tìm kiếm
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.khachhang.toLowerCase().includes(lowerSearch) ||
          item.id.toString().toLowerCase().includes(lowerSearch)
      );
    }

    // Lọc thời gian (Giống hệt Customers, chỉ khác key `thoigiandat`)
    try {
      if (timeStart && !timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        result = result.filter(
          (item) => new Date(item.thoigiandat) >= startTime
        );
      } else if (!timeStart && timeEnd) {
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        result = result.filter((item) => new Date(item.thoigiandat) <= endTime);
      } else if (timeStart && timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        if (startTime > endTime) {
          showToast({
            title: "Lỗi",
            message: "Thời gian bắt đầu không thể lớn hơn thời gian kết thúc",
            type: "error",
          });
          return result;
        }
        result = result.filter(
          (item) =>
            new Date(item.thoigiandat) >= startTime &&
            new Date(item.thoigiandat) <= endTime
        );
      }
    } catch (e) {
      console.error("Lỗi lọc thời gian:", e);
    }

    return result;
  }, [allOrders, statusFilter, searchTerm, timeStart, timeEnd, showToast]);

  const handleCancelSearch = () => {
    setStatusFilter("2");
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
  };

  // Mở modal
  const openDetailModal = (orderId) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  // Xử lý khi modal thay đổi trạng thái
  const handleStatusChange = () => {
    loadOrders(); // Chỉ cần tải lại danh sách
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="2">Tất cả</option>
              <option value="1">Đã xử lý</option>
              <option value="0">Chưa xử lý</option>
            </select>
          </div>
          <div className={styles.adminControlCenter}>
            <form
              className={styles.formSearch}
              onSubmit={(e) => e.preventDefault()}
            >
              <span className={styles.searchBtn}>
                <i className="fa-light fa-magnifying-glass"></i>
              </span>
              <input
                type="text"
                className={styles.formSearchInput}
                placeholder="Tìm kiếm mã đơn, khách hàng..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <form className={styles.fillterDate}>
              <div>
                <label htmlFor="time-start">Từ</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  id="time-start"
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="time-end">Đến</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  id="time-end"
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </div>
            </form>
            <button
              className={styles.btnResetOrder}
              onClick={handleCancelSearch}
              title="Làm mới"
            >
              <i className="fa-light fa-arrow-rotate-right"></i>
            </button>
          </div>
        </div>
        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <td>Mã đơn</td>
                <td>Khách hàng</td>
                <td>Ngày đặt</td>
                <td>Tổng tiền</td>
                <td>Trạng thái</td>
                <td>Thao tác</td>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.khachhang}</td>
                    <td>{formatDate(order.thoigiandat)}</td>
                    <td>{vnd(order.tongtien)}</td>
                    <td>
                      {order.trangthai === 1 ? (
                        <span className={styles.statusComplete}>Đã xử lý</span>
                      ) : (
                        <span className={styles.statusNoComplete}>
                          Chưa xử lý
                        </span>
                      )}
                    </td>
                    <td className={styles.control}>
                      <button
                        className={styles.btnDetail}
                        onClick={() => openDetailModal(order.id)}
                      >
                        <i className="fa-regular fa-eye"></i> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrderId}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default Orders;
