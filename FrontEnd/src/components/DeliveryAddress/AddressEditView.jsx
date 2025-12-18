// import React, { useState } from "react";
// import styles from "./AddressEditView.module.css";

// // API Placeholder (Giữ nguyên)
// const searchLocation = async (query) => {
//   console.log("Searching for:", query);
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return [
//     { id: "search1", description: `Kết quả tìm kiếm cho: ${query} 1` },
//     { id: "search2", description: `Kết quả tìm kiếm cho: ${query} 2` },
//   ];
// };

// const AddressEditView = ({
//   addresses,
//   selectedAddress,
//   onSelectAddress,
//   onAddNew,
//   onEditAddress,
//   onDeleteAddress, // [MỚI] Nhận hàm xóa từ props
//   onCancel,
// }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchResults, setSearchResults] = useState([]);

//   const handleSearchChange = async (e) => {
//     const query = e.target.value;
//     setSearchTerm(query);
//     if (query.length > 2) {
//       const results = await searchLocation(query);
//       setSearchResults(results);
//     } else {
//       setSearchResults([]);
//     }
//   };

//   const getIconForType = (type) => {
//     switch (type) {
//       case "HOME":
//         return <i className="fa-solid fa-house"></i>;
//       case "WORK":
//         return <i className="fa-solid fa-briefcase"></i>;
//       case "OTHER":
//         return <i className="fa-solid fa-tag"></i>;
//       default:
//         return <i className="fa-solid fa-location-dot"></i>;
//     }
//   };

//   return (
//     <div className={styles.editView}>
//       <div className={styles.editHeader}>
//         <button onClick={onCancel} className={styles.backBtn}>
//           <i className="fa-solid fa-arrow-left"></i>
//         </button>
//         <h3>Địa chỉ giao hàng</h3>
//       </div>

//       <div className={styles.searchSection}>
//         <input
//           type="text"
//           placeholder="Tìm kiếm địa chỉ..."
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className={styles.searchInput}
//         />
//       </div>

//       {/* Hiển thị địa chỉ ĐANG CHỌN */}
//       {selectedAddress && (
//         <div className={`${styles.addressOption} ${styles.currentSelection}`}>
//           <div className={styles.addressIcon}>
//             {getIconForType(selectedAddress.type)}
//           </div>

//           <div className={styles.addressDetails}>
//             <p className={styles.namePhone}>
//               <strong>
//                 {selectedAddress.type === "OTHER"
//                   ? selectedAddress.customName
//                   : selectedAddress.type === "HOME"
//                   ? "Nhà"
//                   : "Công ty"}
//               </strong>
//             </p>
//             <p className={styles.addressText}>{selectedAddress.address}</p>
//           </div>

//           {/* Nhóm nút thao tác */}
//           <div style={{ display: "flex", gap: "10px" }}>
//             {/* Nút Sửa */}
//             <button
//               className={styles.editLink}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEditAddress(selectedAddress);
//               }}
//             >
//               Sửa
//             </button>

//             {/* [MỚI] Nút Xóa */}
//             <button
//               className={styles.editLink}
//               style={{ color: "#ff4d4f" }} // Màu đỏ
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDeleteAddress(selectedAddress.id);
//               }}
//             >
//               Xóa
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Danh sách địa chỉ ĐÃ LƯU */}
//       <div className={styles.savedAddressesSection}>
//         <div className={styles.savedHeader}>
//           <h4>Địa chỉ đã lưu</h4>
//         </div>
//         <div className={styles.addressListScrollable}>
//           {addresses
//             .filter((addr) => addr.id !== selectedAddress?.id)
//             .map((addr) => (
//               <div
//                 key={addr.id}
//                 className={`${styles.addressOption} ${
//                   selectedAddress?.id === addr.id ? styles.active : ""
//                 }`}
//                 onClick={() => onSelectAddress(addr.id)}
//               >
//                 <div className={styles.addressIcon}>
//                   {getIconForType(addr.type)}
//                 </div>

//                 <div className={styles.addressDetails}>
//                   <p className={styles.namePhone}>
//                     <strong>
//                       {addr.type === "OTHER"
//                         ? addr.customName
//                         : addr.type === "HOME"
//                         ? "Nhà"
//                         : "Công ty"}
//                     </strong>
//                   </p>
//                   <p className={styles.addressText}>{addr.address}</p>
//                 </div>

//                 <div style={{ display: "flex", gap: "10px" }}>
//                   <button
//                     className={styles.editLink}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onEditAddress(addr);
//                     }}
//                   >
//                     Sửa
//                   </button>

//                   {/* [MỚI] Nút Xóa */}
//                   <button
//                     className={styles.editLink}
//                     style={{ color: "#ff4d4f" }}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       onDeleteAddress(addr.id);
//                     }}
//                   >
//                     Xóa
//                   </button>
//                 </div>
//               </div>
//             ))}
//         </div>
//       </div>

//       <button className={styles.addNewAddressBtn} onClick={onAddNew}>
//         Thêm địa chỉ mới
//       </button>
//     </div>
//   );
// };

// export default AddressEditView;
import React, { useState } from "react";
import styles from "./AddressEditView.module.css";

// API Placeholder (Giữ nguyên)
const searchLocation = async (query) => {
  console.log("Searching for:", query);
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [
    { id: "search1", description: `Kết quả tìm kiếm cho: ${query} 1` },
    { id: "search2", description: `Kết quả tìm kiếm cho: ${query} 2` },
  ];
};

const AddressEditView = ({
  addresses,
  selectedAddress,
  onSelectAddress,
  onAddNew,
  onEditAddress,
  onDeleteAddress,
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      const results = await searchLocation(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case "HOME":
        return <i className="fa-solid fa-house"></i>;
      case "WORK":
        return <i className="fa-solid fa-briefcase"></i>;
      case "OTHER":
        return <i className="fa-solid fa-tag"></i>;
      default:
        return <i className="fa-solid fa-location-dot"></i>;
    }
  };

  return (
    <div className={styles.editView}>
      <div className={styles.editHeader}>
        <button onClick={onCancel} className={styles.backBtn}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h3>Địa chỉ giao hàng</h3>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Tìm kiếm địa chỉ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {/* Hiển thị địa chỉ ĐANG CHỌN */}
      {selectedAddress && (
        <div className={`${styles.addressOption} ${styles.currentSelection}`}>
          <div className={styles.addressIcon}>
            {getIconForType(selectedAddress.type)}
          </div>

          <div className={styles.addressDetails}>
            <p className={styles.namePhone}>
              <strong>
                {selectedAddress.type === "OTHER"
                  ? selectedAddress.customName
                  : selectedAddress.type === "HOME"
                  ? "Nhà"
                  : "Công ty"}
              </strong>
              {/* [FIX] Hiển thị thêm Tên - SĐT để Test tìm thấy */}
              <span style={{ fontWeight: "normal", marginLeft: "8px" }}>
                | {selectedAddress.name} - {selectedAddress.phone}
              </span>
            </p>
            <p className={styles.addressText}>{selectedAddress.address}</p>
          </div>

          {/* Nhóm nút thao tác */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className={styles.editLink}
              onClick={(e) => {
                e.stopPropagation();
                onEditAddress(selectedAddress);
              }}
            >
              Sửa
            </button>

            <button
              className={styles.editLink}
              style={{ color: "#ff4d4f" }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteAddress(selectedAddress.id);
              }}
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* Danh sách địa chỉ ĐÃ LƯU */}
      <div className={styles.savedAddressesSection}>
        <div className={styles.savedHeader}>
          <h4>Địa chỉ đã lưu</h4>
        </div>
        <div className={styles.addressListScrollable}>
          {addresses
            .filter((addr) => addr.id !== selectedAddress?.id)
            .map((addr) => (
              <div
                key={addr.id}
                className={`${styles.addressOption} ${
                  selectedAddress?.id === addr.id ? styles.active : ""
                }`}
                onClick={() => onSelectAddress(addr.id)}
              >
                <div className={styles.addressIcon}>
                  {getIconForType(addr.type)}
                </div>

                <div className={styles.addressDetails}>
                  <p className={styles.namePhone}>
                    <strong>
                      {addr.type === "OTHER"
                        ? addr.customName
                        : addr.type === "HOME"
                        ? "Nhà"
                        : "Công ty"}
                    </strong>
                    {/* [FIX QUAN TRỌNG] Playwright tìm text ở dòng này */}
                    <span style={{ fontWeight: "normal", marginLeft: "8px" }}>
                      | {addr.name} - {addr.phone}
                    </span>
                  </p>
                  <p className={styles.addressText}>{addr.address}</p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className={styles.editLink}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditAddress(addr);
                    }}
                  >
                    Sửa
                  </button>

                  <button
                    className={styles.editLink}
                    style={{ color: "#ff4d4f" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAddress(addr.id);
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <button className={styles.addNewAddressBtn} onClick={onAddNew}>
        Thêm địa chỉ mới
      </button>
    </div>
  );
};

export default AddressEditView;
