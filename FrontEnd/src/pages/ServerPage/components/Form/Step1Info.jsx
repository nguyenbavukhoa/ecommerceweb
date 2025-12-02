// Step1Info.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import styles from "./ProductForm.module.scss";

const Step1Info = ({ initialData, initialImage, onSubmit }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialImage);

  // Cập nhật state nội bộ nếu props từ cha thay đổi
  useEffect(() => {
    setFormData(initialData);
    setImagePreview(initialImage);
  }, [initialData, initialImage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, price, desc } = formData;

    // Validate
    if (title === "" || price === "" || desc === "") {
      showToast({
        title: "Chú ý",
        message: "Vui lòng nhập đầy đủ thông tin cơ bản!",
        type: "warning",
      });
      return;
    }
    if (isNaN(price) || parseInt(price) < 0) {
      showToast({
        title: "Chú ý",
        message: "Giá phải là số và không âm!",
        type: "warning",
      });
      return;
    }

    // Gửi data về cho cha (ProductForm)
    onSubmit(formData, imagePreview);
  };

  return (
    <form className={styles.addProductForm} onSubmit={handleSubmit}>
      {/* Cột trái: Ảnh */}
      <div className={styles.modalContentLeft}>
        <img
          src={imagePreview}
          alt="Preview"
          className={styles.uploadImagePreview}
          onError={(e) => (e.target.src = "/assets/img/blank-image.png")}
        />
        <div className={styles.formGroupFile}>
          <label htmlFor="up-hinh-anh" className={styles.formLabelFile}>
            <i className="fa-regular fa-cloud-arrow-up"></i>Chọn hình ảnh
          </label>
          <input
            accept="image/jpeg, image/png, image/jpg"
            id="up-hinh-anh"
            name="up-hinh-anh"
            type="file"
            className={styles.fileInput}
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Cột phải: Thông tin */}
      <div className={styles.modalContentRight}>
        <div className={styles.formGroup}>
          <label htmlFor="ten-mon" className={styles.formLabel}>
            Tên món
          </label>
          <input
            id="ten-mon"
            name="title"
            type="text"
            placeholder="Nhập tên món"
            className={styles.formControl}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.formLabel}>
            Chọn món
          </label>
          <select
            name="category"
            id="chon-mon"
            className={styles.formControl}
            value={formData.category}
            onChange={handleChange}
          >
            <option>Món chay</option>
            <option>Món mặn</option>
            <option>Món lẩu</option>
            <option>Món ăn vặt</option>
            <option>Món tráng miệng</option>
            <option>Nước uống</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="gia-moi" className={styles.formLabel}>
            Giá bán (cơ bản)
          </label>
          <input
            id="gia-moi"
            name="price"
            type="number"
            placeholder="Nhập giá bán"
            className={styles.formControl}
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mo-ta" className={styles.formLabel}>
            Mô tả
          </label>
          <textarea
            className={styles.productDesc}
            id="mo-ta"
            name="desc"
            placeholder="Nhập mô tả món ăn..."
            value={formData.desc}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        {/* Nút điều hướng cho Bước 1 */}
        <div
          className={styles.stepNavigation}
          style={{ justifyContent: "flex-end" }}
        >
          <button type="submit" className={styles.formSubmit}>
            <span>TIẾP THEO</span>
            <i className="fa-light fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1Info;
