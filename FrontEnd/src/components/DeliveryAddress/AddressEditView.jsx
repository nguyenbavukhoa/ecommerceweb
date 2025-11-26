// src/components/DeliveryAddress/AddressEditView.jsx
import React, { useState } from "react";
import styles from "./AddressEditView.module.css";

// --- API Placeholder: Search Location ---
const searchLocation = async (query) => {
  console.log("Searching for:", query);
  // TODO: API Integration - Call a Geocoding API (e.g., Google Maps Geocoding API)
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API call
  // Return mock results or handle API response
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
  onCancel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchChange = async (e) => {
    const query = e.target.value;
    setSearchTerm(query);
    if (query.length > 2) {
      // Only search if query is long enough
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
        {/* TODO: Display searchResults */}
      </div>

      {/* Hiển thị lại địa chỉ đang chọn */}
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
            </p>
            <p className={styles.addressText}>{selectedAddress.address}</p>
            {/* NÚT SỬA MỚI */}
          </div>
          <button
            className={styles.editLink}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn không cho sự kiện click lan ra div cha
              onEditAddress(selectedAddress); // Gọi hàm xử lý sửa
            }}
          >
            Sửa
          </button>
        </div>
      )}

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
                  </p>
                  <p className={styles.addressText}>{addr.address}</p>
                </div>
                {/* NÚT SỬA MỚI */}
                <button
                  className={styles.editLink}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn không cho sự kiện click lan ra div cha
                    onEditAddress(addr); // Gọi hàm xử lý sửa
                  }}
                >
                  Sửa
                </button>
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
