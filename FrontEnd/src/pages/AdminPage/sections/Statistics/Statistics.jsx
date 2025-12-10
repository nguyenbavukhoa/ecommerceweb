// import React, { useState, useEffect, useMemo } from "react";
// import StatisticsDetailModal from "../../components/Modals/StatisticsDetailModal";
// import styles from "./Statistics.module.scss";
// import { vnd } from "../../utils";

// // 1. IMPORT AUTH & DB
// import { useAuth } from "../../../../context/AuthContext";
// import { db } from "../../../../data/mockData";

// const Statistics = () => {
//   const { user } = useAuth();
//   const currentStoreId = user?.storeId;

//   // State lưu dữ liệu thống kê sản phẩm
//   const [aggregatedData, setAggregatedData] = useState([]);

//   // State lưu danh sách đơn hàng THÔ của quán này (để truyền cho Modal)
//   const [storeOrders, setStoreOrders] = useState([]);

//   const [overview, setOverview] = useState({
//     products: 0,
//     quantity: 0,
//     sale: 0,
//   });

//   // Filters & Sort
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [timeStart, setTimeStart] = useState("");
//   const [timeEnd, setTimeEnd] = useState("");

//   // SỬA 1: Mặc định sortMode = 2 (Sắp xếp theo SL Bán ngay từ đầu)
//   const [sortMode, setSortMode] = useState(2);

//   // Modal
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   // --- 2. LOGIC TỔNG HỢP DỮ LIỆU ---
//   useEffect(() => {
//     const processData = () => {
//       let allOrders = db.orders.getAll();

//       // Lọc theo Store của Admin
//       if (currentStoreId) {
//         allOrders = allOrders.filter((o) => o.restaurantId === currentStoreId);
//       }
//       setStoreOrders(allOrders);

//       const productMap = new Map();

//       allOrders.forEach((order) => {
//         // Bỏ qua đơn hủy
//         if (order.orderStatus === "CANCELLED") return;

//         order.orderItems.forEach((item) => {
//           // QUAN TRỌNG: Dùng productId để gom nhóm (Bất kể size/topping)
//           const key = item.productId;

//           // SỬA 2: Ép kiểu Number để tránh lỗi cộng chuỗi
//           const qty = Number(item.quantity);
//           const price = Number(item.price);
//           const total = qty * price;

//           if (productMap.has(key)) {
//             const existing = productMap.get(key);
//             existing.quantity += qty;
//             existing.doanhthu += total;
//             // Cập nhật thời gian mới nhất để lọc ngày
//             if (new Date(order.orderTime) > new Date(existing.time)) {
//               existing.time = order.orderTime;
//             }
//           } else {
//             productMap.set(key, {
//               id: key, // ID gốc
//               title: item.productName,
//               category: assignCategoryByName(item.productName),
//               img: item.imgUrl,
//               quantity: qty,
//               doanhthu: total,
//               time: order.orderTime,
//             });
//           }
//         });
//       });

//       const resultList = Array.from(productMap.values());
//       setAggregatedData(resultList);

//       setOverview({
//         products: resultList.length,
//         quantity: resultList.reduce((sum, item) => sum + item.quantity, 0),
//         sale: resultList.reduce((sum, item) => sum + item.doanhthu, 0),
//       });
//     };

//     processData();
//   }, [currentStoreId]); // Chạy lại khi storeId thay đổi

//   const assignCategoryByName = (name) => {
//     const lowerName = name.toLowerCase();
//     if (lowerName.includes("lẩu")) return "Món lẩu";
//     if (
//       lowerName.includes("cơm") ||
//       lowerName.includes("gà") ||
//       lowerName.includes("bò") ||
//       lowerName.includes("burger")
//     )
//       return "Món mặn";
//     if (lowerName.includes("chay")) return "Món chay";
//     if (
//       lowerName.includes("trà") ||
//       lowerName.includes("nước") ||
//       lowerName.includes("pepsi")
//     )
//       return "Nước uống";
//     if (
//       lowerName.includes("chè") ||
//       lowerName.includes("bánh") ||
//       lowerName.includes("pizza")
//     )
//       return "Món tráng miệng";
//     return "Món ăn vặt";
//   };

//   // --- 3. LOGIC LỌC & SẮP XẾP ---
//   const processedData = useMemo(() => {
//     let result = [...aggregatedData];

//     // 1. Lọc Danh mục
//     if (categoryFilter !== "All") {
//       result = result.filter((item) => item.category === categoryFilter);
//     }
//     // 2. Tìm kiếm
//     if (searchTerm) {
//       result = result.filter((item) =>
//         item.title.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     // 3. Lọc Thời gian
//     if (timeStart && timeEnd) {
//       const start = new Date(timeStart);
//       const end = new Date(timeEnd);
//       end.setHours(23, 59, 59, 999);
//       result = result.filter((item) => {
//         const parts = item.time.split(" ");
//         if (parts.length < 2) return false;
//         const [d, m, y] = parts[1].split("/");
//         const itemDate = new Date(`${y}-${m}-${d}`);
//         return itemDate >= start && itemDate <= end;
//       });
//     }

//     // SỬA 3: Logic Sắp xếp (Luôn sắp xếp trước khi cắt Top 10)
//     if (sortMode === 4) {
//       // Doanh thu giảm dần
//       result.sort((a, b) => b.doanhthu - a.doanhthu || b.quantity - a.quantity);
//     } else {
//       // Mặc định hoặc Mode 2: Số lượng giảm dần
//       result.sort((a, b) => b.quantity - a.quantity || b.doanhthu - a.doanhthu);
//     }

//     // SỬA 4: Chỉ lấy Top 10 sản phẩm
//     return result.slice(0, 10);
//   }, [
//     aggregatedData,
//     categoryFilter,
//     searchTerm,
//     timeStart,
//     timeEnd,
//     sortMode,
//   ]);

//   const handleReset = () => {
//     setCategoryFilter("All");
//     setSearchTerm("");
//     setTimeStart("");
//     setTimeEnd("");
//     setSortMode(2); // Reset về mode 2
//   };

//   const openDetailModal = (id) => {
//     setSelectedProductId(id);
//     setIsModalOpen(true);
//   };

//   return (
//     <>
//       <div className={styles.section}>
//         {/* --- CONTROL BAR --- */}
//         <div className={styles.adminControl}>
//           <div className={styles.controlGroupLeft}>
//             <div className={styles.selectWrapper}>
//               <select
//                 value={categoryFilter}
//                 onChange={(e) => setCategoryFilter(e.target.value)}
//                 className={styles.customSelect}
//               >
//                 <option value="All">Tất cả danh mục</option>
//                 <option value="Món mặn">Món mặn</option>
//                 <option value="Món lẩu">Món lẩu</option>
//                 <option value="Món tráng miệng">Tráng miệng / Pizza</option>
//                 <option value="Nước uống">Nước uống</option>
//                 <option value="Món ăn vặt">Món ăn vặt</option>
//                 <option value="Món chay">Món chay</option>
//               </select>
//               <i className="fa-solid fa-chevron-down"></i>
//             </div>
//           </div>

//           <div className={styles.controlGroupCenter}>
//             <div className={styles.searchWrapper}>
//               <input
//                 type="text"
//                 placeholder="Tìm kiếm tên món..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//               <button className={styles.searchBtn}>
//                 <i className="fa-light fa-magnifying-glass"></i>
//               </button>
//             </div>
//           </div>

//           <div className={styles.controlGroupRight}>
//             <div className={styles.dateGroup}>
//               <input
//                 type="date"
//                 value={timeStart}
//                 onChange={(e) => setTimeStart(e.target.value)}
//               />
//               <span>-</span>
//               <input
//                 type="date"
//                 value={timeEnd}
//                 onChange={(e) => setTimeEnd(e.target.value)}
//               />
//             </div>

//             <div className={styles.btnGroup}>
//               <button
//                 className={`${styles.iconBtn} ${
//                   sortMode === 2 ? styles.active : ""
//                 }`}
//                 onClick={() => setSortMode(2)}
//                 title="Sắp xếp theo SL bán (Giảm dần)"
//               >
//                 <i className="fa-solid fa-arrow-down-9-1"></i>
//               </button>
//               <button
//                 className={`${styles.iconBtn} ${
//                   sortMode === 4 ? styles.active : ""
//                 }`}
//                 onClick={() => setSortMode(4)}
//                 title="Sắp xếp theo Doanh thu (Giảm dần)"
//               >
//                 <i className="fa-solid fa-sack-dollar"></i>
//               </button>
//               <button
//                 className={styles.resetBtn}
//                 onClick={handleReset}
//                 title="Làm mới"
//               >
//                 <i className="fa-light fa-rotate-right"></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* --- OVERVIEW --- */}
//         <div className={styles.overviewGrid}>
//           <div className={styles.card}>
//             <div className={styles.cardInfo}>
//               <span>Sản phẩm</span>
//               <h3>{overview.products}</h3>
//             </div>
//             <div className={`${styles.cardIcon} ${styles.blue}`}>
//               <i className="fa-light fa-salad"></i>
//             </div>
//           </div>
//           <div className={styles.card}>
//             <div className={styles.cardInfo}>
//               <span>Đã bán</span>
//               <h3>{overview.quantity}</h3>
//             </div>
//             <div className={`${styles.cardIcon} ${styles.orange}`}>
//               <i className="fa-light fa-file-invoice"></i>
//             </div>
//           </div>
//           <div className={styles.card}>
//             <div className={styles.cardInfo}>
//               <span>Doanh thu</span>
//               <h3 style={{ color: "#27ae60" }}>{vnd(overview.sale)}</h3>
//             </div>
//             <div className={`${styles.cardIcon} ${styles.green}`}>
//               <i className="fa-light fa-sack-dollar"></i>
//             </div>
//           </div>
//         </div>

//         {/* --- TABLE --- */}
//         <div className={styles.tableContainer}>
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th>Hạng</th>
//                 <th>Thông tin món ăn</th>
//                 <th>Danh mục</th>
//                 <th className="text-right">SL Bán</th>
//                 <th className="text-right">Doanh thu</th>
//                 <th className="text-center">Thao tác</th>
//               </tr>
//             </thead>
//             <tbody>
//               {processedData.length > 0 ? (
//                 processedData.map((item, index) => (
//                   <tr key={item.id}>
//                     <td data-label="Hạng">
//                       {/* Top 3 có màu nổi bật */}
//                       {index === 0 && (
//                         <span style={{ fontSize: "20px" }}>🥇</span>
//                       )}
//                       {index === 1 && (
//                         <span style={{ fontSize: "20px" }}>🥈</span>
//                       )}
//                       {index === 2 && (
//                         <span style={{ fontSize: "20px" }}>🥉</span>
//                       )}
//                       {index > 2 && <span>#{index + 1}</span>}
//                     </td>
//                     <td>
//                       <div className={styles.prodCell}>
//                         <img
//                           src={item.img}
//                           alt=""
//                           onError={(e) =>
//                             (e.target.src = "/assets/img/blank-image.png")
//                           }
//                         />
//                         <div className={styles.productInfo}>
//                           <strong>{item.title}</strong>
//                           <span>ID: {item.id}</span>
//                         </div>
//                       </div>
//                     </td>
//                     <td data-label="Danh mục">
//                       <span className={styles.tag}>{item.category}</span>
//                     </td>
//                     <td data-label="SL Bán" className="text-right">
//                       <b>{item.quantity}</b>
//                     </td>
//                     <td data-label="Doanh thu" className="text-right">
//                       <span className={styles.revenueText}>
//                         {vnd(item.doanhthu)}
//                       </span>
//                     </td>
//                     <td className="text-center" data-label="Thao tác">
//                       <button
//                         className={styles.btnDetail}
//                         onClick={() => openDetailModal(item.id)}
//                       >
//                         <i className="fa-regular fa-eye"></i> Chi tiết
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan="6"
//                     style={{
//                       textAlign: "center",
//                       padding: "20px",
//                       color: "#999",
//                     }}
//                   >
//                     Chưa có dữ liệu thống kê.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <StatisticsDetailModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         productId={selectedProductId}
//         storeOrders={storeOrders}
//       />
//     </>
//   );
// };

// export default Statistics;
import React, { useState, useEffect, useMemo } from "react";
import StatisticsDetailModal from "../../components/Modals/StatisticsDetailModal";
import styles from "./Statistics.module.scss";
import { vnd } from "../../utils";

// Import Auth & Service
import { useAuth } from "../../../../context/AuthContext";
import orderService from "../../../../services/orderService";

const Statistics = () => {
  const { user } = useAuth();
  const currentStoreId =
    user?.storeId || localStorage.getItem("currentStoreId") || 1;

  // --- STATE ---
  const [storeOrders, setStoreOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filters (Đã bỏ categoryFilter)
  const [searchTerm, setSearchTerm] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [sortMode, setSortMode] = useState(2); // 2: SL giảm dần

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // --- HELPER: Parse ngày giờ VN ---
  const parseOrderDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    try {
      const [time, date] = dateStr.split(" ");
      const [d, m, y] = date.split("/");
      return new Date(`${y}-${m}-${d}T${time}`);
    } catch (e) {
      return new Date(0);
    }
  };

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      if (!currentStoreId) return;
      setIsLoading(true);
      try {
        const allOrders = await orderService.getAllStoreOrders(currentStoreId);
        // Sắp xếp đơn mới nhất lên đầu
        const sortedOrders = allOrders.sort(
          (a, b) => parseOrderDate(b.orderTime) - parseOrderDate(a.orderTime)
        );
        setStoreOrders(sortedOrders);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentStoreId]);

  // --- 2. LỌC ĐƠN HÀNG THEO NGÀY ---
  const filteredOrdersByDate = useMemo(() => {
    let result = storeOrders;

    if (timeStart && timeEnd) {
      const start = new Date(timeStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(timeEnd);
      end.setHours(23, 59, 59, 999);

      result = result.filter((order) => {
        const oDate = parseOrderDate(order.orderTime);
        return oDate >= start && oDate <= end;
      });
    }
    return result;
  }, [storeOrders, timeStart, timeEnd]);

  // --- 3. TÍNH OVERVIEW ---
  const overview = useMemo(() => {
    // Doanh thu: Chỉ tính đơn DELIVERED/COMPLETED
    const completedOrders = filteredOrdersByDate.filter((o) =>
      ["DELIVERED", "COMPLETED"].includes(o.orderStatus)
    );

    // Số lượng: Tính trên các đơn không bị hủy
    const validOrders = filteredOrdersByDate.filter(
      (o) => !["CANCELLED", "REJECTED", "FAILED"].includes(o.orderStatus)
    );

    const totalRevenue = completedOrders.reduce(
      (sum, o) => sum + (Number(o.totalPrice) || 0),
      0
    );

    let totalQty = 0;
    validOrders.forEach((o) => {
      (o.orderItems || []).forEach(
        (item) => (totalQty += Number(item.quantity) || 0)
      );
    });

    return {
      ordersCount: validOrders.length,
      quantity: totalQty,
      sale: totalRevenue,
    };
  }, [filteredOrdersByDate]);

  // --- 4. TỔNG HỢP SẢN PHẨM ---
  const aggregatedProducts = useMemo(() => {
    const productMap = new Map();

    filteredOrdersByDate.forEach((order) => {
      if (["CANCELLED", "REJECTED", "FAILED"].includes(order.orderStatus))
        return;

      const items = order.orderItems || [];
      items.forEach((item) => {
        const key = item.productId;
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const total = qty * price;

        if (productMap.has(key)) {
          const existing = productMap.get(key);
          existing.quantity += qty;
          existing.doanhthu += total;
        } else {
          productMap.set(key, {
            id: key,
            title: item.productName,
            // Đã bỏ category
            img: item.imgUrl,
            quantity: qty,
            doanhthu: total,
          });
        }
      });
    });

    return Array.from(productMap.values());
  }, [filteredOrdersByDate]);

  // --- 5. LỌC & SẮP XẾP CUỐI CÙNG ---
  const finalProductList = useMemo(() => {
    let result = [...aggregatedProducts];

    // Chỉ còn lọc theo Search
    if (searchTerm) {
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    if (sortMode === 4) {
      result.sort((a, b) => b.doanhthu - a.doanhthu);
    } else {
      result.sort((a, b) => b.quantity - a.quantity);
    }

    return result.slice(0, 10); // Top 10
  }, [aggregatedProducts, searchTerm, sortMode]);

  // --- RENDER ---
  const handleReset = () => {
    setSearchTerm("");
    setTimeStart("");
    setTimeEnd("");
    setSortMode(2);
  };

  const renderStatusBadge = (status) => {
    let colorClass = "#fff7ed";
    let textColor = "#9a3412";

    if (["DELIVERED", "COMPLETED"].includes(status)) {
      colorClass = "#dcfce7";
      textColor = "#166534";
    } else if (["CANCELLED", "REJECTED", "FAILED"].includes(status)) {
      colorClass = "#fee2e2";
      textColor = "#991b1b";
    } else if (status === "OUT_FOR_DELIVERY") {
      colorClass = "#dbeafe";
      textColor = "#1e40af";
    }

    return (
      <span
        style={{
          backgroundColor: colorClass,
          color: textColor,
          padding: "4px 8px",
          borderRadius: "6px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {status}
      </span>
    );
  };

  return (
    <>
      <div className={styles.section}>
        {/* CONTROL BAR */}
        <div className={styles.adminControl}>
          {/* Đã bỏ ControlGroupLeft (Dropdown Category) */}

          <div className={styles.controlGroupCenter}>
            <div className={styles.searchWrapper}>
              <input
                type="text"
                placeholder="Tìm tên món..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className={styles.searchBtn}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
          </div>

          <div className={styles.controlGroupRight}>
            <div className={styles.dateGroup}>
              <input
                type="date"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
              />
              <span>-</span>
              <input
                type="date"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </div>
            <div className={styles.btnGroup}>
              <button
                className={`${styles.iconBtn} ${
                  sortMode === 2 ? styles.active : ""
                }`}
                onClick={() => setSortMode(2)}
                title="Sắp xếp: Số lượng bán"
              >
                <i className="fa-solid fa-arrow-down-9-1"></i>
              </button>
              <button
                className={`${styles.iconBtn} ${
                  sortMode === 4 ? styles.active : ""
                }`}
                onClick={() => setSortMode(4)}
                title="Sắp xếp: Doanh thu"
              >
                <i className="fa-solid fa-sack-dollar"></i>
              </button>
              <button
                className={styles.resetBtn}
                onClick={handleReset}
                title="Reset"
              >
                <i className="fa-solid fa-rotate-right"></i>
              </button>
            </div>
          </div>
        </div>

        {/* OVERVIEW CARDS */}
        <div className={styles.overviewGrid}>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <span>Đơn hàng</span>
              <h3>{overview.ordersCount}</h3>
            </div>
            <div className={`${styles.cardIcon} ${styles.blue}`}>
              <i className="fa-solid fa-file-invoice"></i>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <span>Tổng món bán</span>
              <h3>{overview.quantity}</h3>
            </div>
            <div className={`${styles.cardIcon} ${styles.orange}`}>
              <i className="fa-solid fa-utensils"></i>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardInfo}>
              <span>Doanh thu thực</span>
              <h3 style={{ color: "#27ae60" }}>{vnd(overview.sale)}</h3>
            </div>
            <div className={`${styles.cardIcon} ${styles.green}`}>
              <i className="fa-solid fa-money-bill-wave"></i>
            </div>
          </div>
        </div>

        {/* TABLE 1: PRODUCTS (Đã bỏ cột Category) */}
        <h3 style={{ margin: "20px 0 10px", fontSize: "18px", color: "#333" }}>
          Top Sản Phẩm Bán Chạy
        </h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Hạng</th>
                <th>Món ăn</th>
                <th className="text-right">SL Bán</th>
                <th className="text-right">Doanh thu</th>
                <th className="text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    Đang tải...
                  </td>
                </tr>
              ) : finalProductList.length > 0 ? (
                finalProductList.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : `#${index + 1}`}
                    </td>
                    <td>
                      <div className={styles.prodCell}>
                        <img
                          src={item.img}
                          alt=""
                          onError={(e) =>
                            (e.target.src =
                              "https://via.placeholder.com/50?text=No+Img")
                          }
                        />
                        <div className={styles.productInfo}>
                          <strong>{item.title}</strong>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <b>{item.quantity}</b>
                    </td>
                    <td className="text-right">
                      <span className={styles.revenueText}>
                        {vnd(item.doanhthu)}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        className={styles.btnDetail}
                        onClick={() => {
                          setSelectedProductId(item.id);
                          setIsModalOpen(true);
                        }}
                      >
                        <i className="fa-regular fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* TABLE 2: ORDERS */}
        <h3 style={{ margin: "40px 0 10px", fontSize: "18px", color: "#333" }}>
          Danh Sách Đơn Hàng ({filteredOrdersByDate.length})
        </h3>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrdersByDate.length > 0 ? (
                filteredOrdersByDate.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td style={{ color: "#666", fontSize: "13px" }}>
                      {order.orderTime}
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontWeight: 600 }}>
                          {order.userInfo?.fullName || "Khách vãng lai"}
                        </span>
                        <span style={{ fontSize: "11px", color: "#888" }}>
                          {order.userInfo?.phoneNumber}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, color: "#b5292f" }}>
                      {vnd(order.totalPrice)}
                    </td>
                    <td>{renderStatusBadge(order.orderStatus)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5">
                    Không có đơn hàng nào trong khoảng thời gian này.
                  </td>
                </tr>
              )}
              {filteredOrdersByDate.length > 10 && (
                <tr>
                  <td
                    colSpan="5"
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      color: "#888",
                      fontSize: "12px",
                    }}
                  >
                    ... và {filteredOrdersByDate.length - 10} đơn hàng khác
                  </td>
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
        storeOrders={storeOrders}
      />
    </>
  );
};

export default Statistics;
