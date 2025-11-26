// src/pages/AdminPage/components/Modals/ProductDetailModal.jsx
import React from "react";
import CommonModal from "../../components/Modals/CommonModal";
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";
import { vnd } from "../../utils";
import styles from "./ProductDetailModal.module.scss";
import useProductDetail from "../../../../hooks/useProductDetail";

const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  // Gọi hook lấy chi tiết sản phẩm (từ Mock Data)
  const { product: productDataFromApi, loading: isLoadingDetail } =
    useProductDetail(productId);

  const renderContent = () => {
    if (!productDataFromApi) return null;

    // Map dữ liệu từ DB sang cấu trúc hiển thị
    const p = {
      img: productDataFromApi.imgMain,
      title: productDataFromApi.name,
      description: productDataFromApi.description,
      // Hiển thị tên Category nếu có, nếu không thì hiện ID
      category:
        productDataFromApi.category || `ID: ${productDataFromApi.categoryId}`,
      price: productDataFromApi.priceBase, // Lấy đúng trường priceBase
      status: productDataFromApi.status === "ACTIVE" ? 1 : 0,
      options: productDataFromApi.optionGroups || [],
    };

    return (
      <div className={styles.detailLayout}>
        {/* Cột trái: Ảnh */}
        <div className={styles.detailLeft}>
          <ImageWithFallback
            className={styles.productImage}
            src={p.img}
            alt={p.title}
          />
        </div>

        {/* Cột phải: Thông tin */}
        <div className={styles.detailRight}>
          <h2 className={styles.productName}>{p.title}</h2>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Giá cơ bản</span>
              {/* Hiển thị giá tiền */}
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

          {/* Hiển thị Tùy chọn (Options) */}
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
                        <span>{val.value || val.name}</span>{" "}
                        {/* Fix tên field value/name */}
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
      {isLoadingDetail ? (
        <p style={{ padding: "20px" }}>Đang tải chi tiết...</p>
      ) : (
        renderContent()
      )}
    </CommonModal>
  );
};

export default ProductDetailModal;
