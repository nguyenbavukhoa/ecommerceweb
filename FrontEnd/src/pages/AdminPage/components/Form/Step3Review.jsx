// src/pages/AdminPage/sections/Products/Step3Review.jsx
import React from "react";
import styles from "./ProductForm.module.scss";
import { vnd } from "../../utils";
import { MOCK_CATEGORIES } from "../../../../data/mockData";

const Step3Review = ({ formData, options, imagePreview, onBack, onSave }) => {
  // Tìm tên danh mục từ ID
  const categoryName =
    MOCK_CATEGORIES.find((c) => c.id == formData.categoryId)?.name ||
    "Chưa phân loại";

  return (
    <div className={styles.reviewContainer}>
      <p className={styles.step2Desc}>
        Vui lòng xem lại thông tin trước khi lưu.
      </p>

      <div className={styles.reviewLayout}>
        <div className={styles.reviewLeft}>
          <h3 className={styles.reviewTitle}>Hình ảnh</h3>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.reviewImage}
            onError={(e) => (e.target.src = "/assets/img/blank-image.png")}
          />

          <h3 className={styles.reviewTitle} style={{ marginTop: "20px" }}>
            Tùy chọn
          </h3>
          <div className={styles.reviewOptionGroups}>
            {options.length === 0 ? (
              <p>Không có tùy chọn.</p>
            ) : (
              options.map((group) => (
                <div key={group.id} className={styles.reviewOptionGroup}>
                  <strong>{group.name}</strong>
                  <span>
                    {" "}
                    (Chọn nhiều: {group.isMultiSelect ? "Có" : "Không"})
                  </span>
                  <ul className={styles.reviewOptionValues}>
                    {group.values.map((val) => (
                      <li key={val.id}>
                        <span>{val.name}</span>
                        <span>
                          {val.price > 0 ? `+ ${vnd(val.price)}` : "Miễn phí"}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.reviewRight}>
          <h3 className={styles.reviewTitle}>Thông tin cơ bản</h3>
          <div className={styles.reviewInfoList}>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Tên món:</span>
              <span className={styles.reviewValue}>{formData.title}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Phân loại:</span>
              <span className={styles.reviewValue}>{categoryName}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Giá bán:</span>
              <span className={styles.reviewValue}>{vnd(formData.price)}</span>
            </div>
            <div className={styles.reviewItem}>
              <span className={styles.reviewLabel}>Mô tả:</span>
              <span className={styles.reviewValueDesc}>{formData.desc}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stepNavigation}>
        <button className={styles.formPageCancelBtn} onClick={onBack}>
          <i className="fa-light fa-arrow-left"></i> QUAY LẠI
        </button>
        <button className={styles.formSubmit} onClick={onSave}>
          <i className="fa-light fa-check"></i> XÁC NHẬN & LƯU
        </button>
      </div>
    </div>
  );
};

export default Step3Review;
