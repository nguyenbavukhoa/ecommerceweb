// src/pages/AdminPage/components/Modals/ProductDetailModal.jsx
import { useState, useEffect } from "react";
import CommonModal from "../../components/Modals/CommonModal";
import ImageWithFallback from "../../../../components/ImageWithFallbackComponent/ImageWithFallback";
import { vnd } from "../../utils";
import styles from "./ProductDetailModal.module.scss";
import useProductDetail from "../../../../Hooks/useProductDetail";
import { db } from "../../../../services/dbService"; // [FIX]

const ProductDetailModal = ({ isOpen, onClose, productId }) => {
  // Gọi hook lấy chi tiết sản phẩm (từ Mock Data)
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (isOpen && productId) {
        setLoading(true);
        try {
          const data = await db.products.getOne(productId);
          setProduct(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [isOpen, productId]);

  const renderContent = () => {
    if (!product) return null;

    const p = {
      img: product.imgMain,
      title: product.name,
      description: product.description,
      // Có thể fetch category name nếu cần, ở đây hiện ID cho nhanh
      category: product.category || `Category ID: ${product.categoryId}`,
      price: product.priceBase,
      status: product.status === "ACTIVE" ? 1 : 0,
      options: product.optionGroups || [],
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
      {loading ? (
        <p style={{ padding: "20px" }}>Đang tải...</p>
      ) : (
        renderContent()
      )}
    </CommonModal>
  );
};

export default ProductDetailModal;
