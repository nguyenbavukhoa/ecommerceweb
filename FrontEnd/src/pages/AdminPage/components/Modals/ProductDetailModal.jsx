import React from "react";
import CommonModal from "../../components/Modals/CommonModal";
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";
import { vnd } from "../../utils";
import styles from "./ProductDetailModal.module.scss";

// === 1. IMPORT HOOK ĐỂ TỰ FETCH DATA ===
import useProductDetail from "../../../../hooks/useProductDetail";

// === 2. SỬA PROP: NHẬN `productId` ===
const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  // === 3. GỌI HOOK ĐỂ LẤY DATA ===
  const { product: productDataFromApi, loading: isLoadingDetail } =
    useProductDetail(productId);

  // Hàm render nội dung (sau khi đã có data)
  const renderContent = () => {
    if (!productDataFromApi) return null;

    // === 4. KHỐI "DỊCH" DỮ LIỆU ===
    // Dịch từ JSON API detail (bạn gửi) sang cấu trúc `p`
    const p = {
      img: productDataFromApi.imgUrl,
      title: productDataFromApi.name,
      description: productDataFromApi.description,
      // API detail của bạn không có category, nên ta bỏ qua
      category: "N/A",
      price: productDataFromApi.basePrice,
      status: productDataFromApi.status === "ACTIVE" ? 1 : 0,
      options: (productDataFromApi.optionGroups || []).map((group) => ({
        ...group,
        values: group.values.map((v) => ({
          id: v.id,
          name: v.value, // Dịch 'value' -> 'name'
          price: v.price,
        })),
      })),
    };

    // === 5. BỐ CỤC (Giống hệt file Sửa của bạn) ===
    return (
      <div className={styles.detailLayout}>
        {/* === CỘT TRÁI (Chỉ Hình ảnh) === */}
        <div className={styles.detailLeft}>
          <ImageWithFallback
            className={styles.productImage}
            src={p.img}
            alt={p.title}
          />
        </div>

        {/* === CỘT PHẢI (Tất cả thông tin) === */}
        <div className={styles.detailRight}>
          <h2 className={styles.productName}>{p.title}</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Giá cơ bản</span>
              <span
                className={styles.infoValue}
                style={{ color: "var(--red)", fontSize: "18px" }}
              >
                {vnd(p.price)}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phân loại</span>
              <span className={styles.infoValue}>{p.category}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Trạng thái</span>
              {p.status === 1 ? (
                <span className={styles.infoValue} style={{ color: "#27ae60" }}>
                  Hoạt động
                </span>
              ) : (
                <span className={styles.infoValue} style={{ color: "#c00" }}>
                  Đã khóa
                </span>
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Mô tả</span>
            <p className={styles.productDescription}>{p.description}</p>
          </div>

          {/* === 6. PHẦN TÙY CHỌN (SẼ HIỂN THỊ) === */}
          {p.options.length > 0 && (
            <div className={styles.optionsSection}>
              <h3 className={styles.optionsTitle}>Các tùy chọn sản phẩm</h3>
              {p.options.map((group) => (
                <div key={group.id} className={styles.optionGroup}>
                  <div className={styles.groupHeader}>
                    <strong>{group.name}</strong>
                    <span>
                      (Chọn nhiều: {group.isMultiSelect ? "Có" : "Không"})
                    </span>
                  </div>
                  <ul className={styles.optionValueList}>
                    {group.values.map((val) => (
                      <li key={val.id} className={styles.optionValue}>
                        <span>{val.name}</span>
                        <span>
                          {val.price > 0 ? `+ ${vnd(val.price)}` : "Miễn phí"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="CHI TIẾT SẢN PHẨM"
      customWidth="800px"
    >
      {/* Hiển thị "Đang tải..." hoặc nội dung */}
      {isLoadingDetail ? <p>Đang tải chi tiết...</p> : renderContent()}
    </CommonModal>
  );
};

export default ProductDetailModal;
