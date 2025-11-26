// src/pages/AdminPage/sections/Products/Step1Info.jsx
import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import styles from "./ProductForm.module.scss";

const Step1Info = ({ initialData, initialImage, onSubmit, categories }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [imagePreview, setImagePreview] = useState(initialImage);

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
      // Tạo URL blob để preview ảnh
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, price, desc, categoryId } = formData;

    if (!title || !price || !desc) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tên, giá và mô tả!",
        type: "warning",
      });
      return;
    }

    // Gửi data về cha
    onSubmit(formData, imagePreview);
  };

  return (
    <form className={styles.addProductForm} onSubmit={handleSubmit}>
      <div className={styles.modalContentLeft}>
        <img
          src={imagePreview}
          alt="Preview"
          className={styles.uploadImagePreview}
          onError={(e) => (e.target.src = "/assets/img/blank-image.png")}
        />
        <div className={styles.formGroupFile}>
          <label htmlFor="up-hinh-anh" className={styles.formLabelFile}>
            <i className="fa-regular fa-cloud-arrow-up"></i> Chọn ảnh
          </label>
          <input
            id="up-hinh-anh"
            type="file"
            accept="image/*"
            className={styles.fileInput}
            onChange={handleImageUpload}
          />
        </div>
      </div>

      <div className={styles.modalContentRight}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tên món</label>
          <input
            name="title"
            type="text"
            className={styles.formControl}
            value={formData.title}
            onChange={handleChange}
            placeholder="VD: Burger Tôm"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Danh mục</label>
          <select
            name="categoryId"
            className={styles.formControl}
            value={formData.categoryId}
            onChange={handleChange}
          >
            {categories &&
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Giá bán (VNĐ)</label>
          <input
            name="price"
            type="number"
            className={styles.formControl}
            value={formData.price}
            onChange={handleChange}
            placeholder="VD: 50000"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Mô tả</label>
          <textarea
            name="desc"
            className={styles.productDesc}
            value={formData.desc}
            onChange={handleChange}
            placeholder="Mô tả chi tiết món ăn..."
          />
        </div>

        <div
          className={styles.stepNavigation}
          style={{ justifyContent: "flex-end" }}
        >
          <button type="submit" className={styles.formSubmit}>
            <span>TIẾP THEO</span> <i className="fa-light fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step1Info;
