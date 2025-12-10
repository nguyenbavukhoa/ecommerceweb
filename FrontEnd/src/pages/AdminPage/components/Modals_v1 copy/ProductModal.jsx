import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import CommonModal from "./CommonModal";
import styles from "./ProductModal.module.scss"; // CSS riêng cho form
import { createId, getProductImagePath } from "../../utils";

const ProductModal = ({ isOpen, onClose, productToEdit, onSaveSuccess }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    category: "Món chay",
    price: "",
    desc: "",
  });
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/blank-image.png"
  );

  // Load data vào form khi `productToEdit` hoặc `isOpen` thay đổi
  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        setFormData({
          title: productToEdit.title,
          category: productToEdit.category,
          price: productToEdit.price.toString(), // Chuyển sang string
          desc: productToEdit.desc,
        });
        setImagePreview(productToEdit.img || "/assets/img/blank-image.png");
      } else {
        // Reset form khi thêm mới
        setFormData({ title: "", category: "Món chay", price: "", desc: "" });
        setImagePreview("/assets/img/blank-image.png");
      }
    }
  }, [productToEdit, isOpen]);

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

    const { title, price, desc, category } = formData;

    if (title === "" || price === "" || desc === "") {
      showToast({
        title: "Chú ý",
        message: "Vui lòng nhập đầy đủ thông tin món!",
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

    let products = localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products"))
      : [];

    try {
      if (productToEdit) {
        // Chế độ Edit
        const updatedProduct = {
          ...productToEdit,
          ...formData,
          price: parseInt(price),
          img: getProductImagePath(imagePreview), // Lấy path chuẩn
        };
        const index = products.findIndex((p) => p.id === productToEdit.id);
        products[index] = updatedProduct;
        showToast({
          title: "Success",
          message: "Sửa sản phẩm thành công!",
          type: "success",
        });
      } else {
        // Chế độ Add
        const newProduct = {
          id: createId(products),
          ...formData,
          price: parseInt(price),
          img: getProductImagePath(imagePreview),
          status: 1, // Mặc định status 1
        };
        products.unshift(newProduct);
        showToast({
          title: "Success",
          message: "Thêm sản phẩm thành công!",
          type: "success",
        });
      }

      localStorage.setItem("products", JSON.stringify(products));
      onSaveSuccess(); // Báo cho cha (Products.jsx) biết để tải lại
    } catch (error) {
      showToast({ title: "Error", message: "Có lỗi xảy ra!", type: "error" });
    }
  };

  const title = productToEdit ? "CHỈNH SỬA SẢN PHẨM" : "THÊM MỚI SẢN PHẨM";

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      customWidth="800px"
    >
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
              Giá bán
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

          {productToEdit ? (
            <button type="submit" className={styles.formSubmit}>
              <i className="fa-light fa-pencil"></i>
              <span>LƯU THAY ĐỔI</span>
            </button>
          ) : (
            <button type="submit" className={styles.formSubmit}>
              <i className="fa-regular fa-plus"></i>
              <span>THÊM MÓN</span>
            </button>
          )}
        </div>
      </form>
    </CommonModal>
  );
};

export default ProductModal;
