import React, { useState, useEffect, useMemo } from "react";
import StatisticsDetailModal from "../../components/Modals/StatisticsDetailModal";
import styles from "./Statistics.module.scss";
import { vnd, formatDate } from "../../utils";

// Helper (từ admin.js)
const createObj = () => {
  const orders = localStorage.getItem("order")
    ? JSON.parse(localStorage.getItem("order"))
    : [];
  const products = localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : [];
  const orderDetails = localStorage.getItem("orderDetails")
    ? JSON.parse(localStorage.getItem("orderDetails"))
    : [];

  let result = [];
  orderDetails.forEach((item) => {
    const prod = products.find((product) => product.id === item.id);
    if (!prod) return; // Bỏ qua nếu không tìm thấy sản phẩm

    const order = orders.find((order) => order.id === item.madon);
    if (!order) return; // Bỏ qua nếu không tìm thấy đơn hàng

    result.push({
      id: item.id,
      madon: item.madon,
      price: item.price,
      quantity: item.soluong,
      category: prod.category,
      title: prod.title,
      img: prod.img,
      time: order.thoigiandat,
    });
  });
  return result;
};

const mergeObjThongKe = (arr) => {
  let result = [];
  arr.forEach((item) => {
    let check = result.find((i) => i.id === item.id);
    if (check) {
      check.quantity = parseInt(check.quantity) + parseInt(item.quantity);
      check.doanhthu += parseInt(item.price) * parseInt(item.quantity);
    } else {
      const newItem = { ...item };
      newItem.doanhthu = newItem.price * newItem.quantity;
      result.push(newItem);
    }
  });
  return result;
};

const Statistics = () => {
  const [allDetails, setAllDetails] = useState([]);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [sortMode, setSortMode] = useState(0); // 0: default, 1: asc, 2: desc

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    setAllDetails(createObj());
  }, []);

  // Logic lọc (từ thongKe())
  const filteredDetails = useMemo(() => {
    let result = allDetails;

    if (categoryFilter !== "Tất cả") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (searchTerm) {
      result = result.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    try {
      if (timeStart && !timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        result = result.filter((item) => new Date(item.time) >= startTime);
      } else if (!timeStart && timeEnd) {
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        result = result.filter((item) => new Date(item.time) <= endTime);
      } else if (timeStart && timeEnd) {
        const startTime = new Date(timeStart).setHours(0, 0, 0, 0);
        const endTime = new Date(timeEnd).setHours(23, 59, 59, 999);
        if (startTime > endTime) {
          alert("Lỗi thời gian"); // Giữ alert gốc
          return result;
        }
        result = result.filter(
          (item) =>
            new Date(item.time) >= startTime && new Date(item.time) <= endTime
        );
      }
    } catch (e) {
      console.error("Lỗi lọc thời gian:", e);
    }

    return result;
  }, [allDetails, categoryFilter, searchTerm, timeStart, timeEnd]);

  // Gộp và Sắp xếp
  const finalStatistics = useMemo(() => {
    let merged = mergeObjThongKe(filteredDetails);
    switch (sortMode) {
      case 1: // asc
        merged.sort((a, b) => parseInt(a.quantity) - parseInt(b.quantity));
        break;
      case 2: // desc
        merged.sort((a, b) => parseInt(b.quantity) - parseInt(a.quantity));
        break;
      default:
        // Giữ nguyên thứ tự (hoặc sort theo tên)
        merged.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return merged;
  }, [filteredDetails, sortMode]);

  // Tính toán overview
  const overview = useMemo(() => {
    const merged = mergeObjThongKe(filteredDetails); // Phải tính trên cái chưa gộp
    return {
      products: merged.length,
      quantity: merged.reduce((sum, cur) => sum + parseInt(cur.quantity), 0),
      sale: merged.reduce((sum, cur) => sum + parseInt(cur.doanhthu), 0),
    };
  }, [filteredDetails]);

  const handleCancelSearch = () => {
    setCategoryFilter("Tất cả");
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
    setSortMode(0); // Reset sort
  };

  // Mở modal
  const openDetailModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={styles.section}>
        <div className={styles.adminControl}>
          <div className={styles.adminControlLeft}>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option>Tất cả</option>
              <option>Món chay</option>
              <option>Món mặn</option>
              <option>Món lẩu</option>
              <option>Món ăn vặt</option>
              <option>Món tráng miệng</option>
              <option>Nước uống</option>
              <option>Món khác</option>
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
                placeholder="Tìm kiếm tên món..."
                value={searchTerm}
                onInput={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
          <div className={styles.adminControlRight}>
            <form className={styles.fillterDate}>
              <div>
                <label>Từ</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  value={timeStart}
                  onChange={(e) => setTimeStart(e.target.value)}
                />
              </div>
              <div>
                <label>Đến</label>
                <input
                  type="date"
                  className={styles.formControlDate}
                  value={timeEnd}
                  onChange={(e) => setTimeEnd(e.target.value)}
                />
              </div>
            </form>
            <button
              className={styles.btnResetOrder}
              onClick={() => setSortMode(1)}
              title="SL tăng dần"
            >
              <i className="fa-regular fa-arrow-up-short-wide"></i>
            </button>
            <button
              className={styles.btnResetOrder}
              onClick={() => setSortMode(2)}
              title="SL giảm dần"
            >
              <i className="fa-regular fa-arrow-down-wide-short"></i>
            </button>
            <button
              className={styles.btnResetOrder}
              onClick={handleCancelSearch}
              title="Làm mới"
            >
              <i className="fa-light fa-arrow-rotate-right"></i>
            </button>
          </div>
        </div>

        <div className={styles.orderStatistical}>
          <div className={styles.orderStatisticalItem}>
            <div className={styles.orderStatisticalItemContent}>
              <p className={styles.orderStatisticalItemContentDesc}>
                Sản phẩm được bán ra
              </p>
              <h4 className={styles.orderStatisticalItemContentH}>
                {overview.products}
              </h4>
            </div>
            <div className={styles.orderStatisticalItemIcon}>
              <i className="fa-light fa-salad"></i>
            </div>
          </div>
          <div className={styles.orderStatisticalItem}>
            <div className={styles.orderStatisticalItemContent}>
              <p className={styles.orderStatisticalItemContentDesc}>
                Số lượng bán ra
              </p>
              <h4 className={styles.orderStatisticalItemContentH}>
                {overview.quantity}
              </h4>
            </div>
            <div className={styles.orderStatisticalItemIcon}>
              <i className="fa-light fa-file-lines"></i>
            </div>
          </div>
          <div className={styles.orderStatisticalItem}>
            <div className={styles.orderStatisticalItemContent}>
              <p className={styles.orderStatisticalItemContentDesc}>
                Doanh thu
              </p>
              <h4 className={styles.orderStatisticalItemContentH}>
                {vnd(overview.sale)}
              </h4>
            </div>
            <div className={styles.orderStatisticalItemIcon}>
              <i className="fa-light fa-dollar-sign"></i>
            </div>
          </div>
        </div>

        <div className={styles.table}>
          <table width="100%">
            <thead>
              <tr>
                <td>STT</td>
                <td>Tên món</td>
                <td>Số lượng bán</td>
                <td>Doanh thu</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {finalStatistics.length > 0 ? (
                finalStatistics.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div className={styles.prodImgTitle}>
                        <img
                          className={styles.prdImgTbl}
                          src={item.img}
                          alt={item.title}
                          onError={(e) =>
                            (e.target.src = "/assets/img/blank-image.png")
                          }
                        />
                        <p>{item.title}</p>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{vnd(item.doanhthu)}</td>
                    <td>
                      <button
                        className={styles.btnDetail}
                        onClick={() => openDetailModal(item.id)}
                      >
                        <i className="fa-regular fa-eye"></i> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StatisticsDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
        allDetails={filteredDetails} // Truyền data đã lọc
      />
    </>
  );
};

export default Statistics;
