import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../../context/ToastContext";
import CommonModal from "./CommonModal";
import styles from "./ProductModal.module.scss";
import { useCategories } from "../../../../context/FilterProvider";
import productService from "../../../../services/productService";

const ProductModal = ({
  isOpen,
  onClose,
  productToEdit,
  onSaveSuccess,
  storeId,
}) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  // Lấy danh mục từ API để hiển thị trong select
  const { data: categories = [] } = useCategories();

  // State lưu file ảnh thực tế để upload
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/blank-image.png"
  );

  // State Form (Khớp với field API yêu cầu)
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    priceBase: "",
    description: "",
  });

  // Load dữ liệu khi mở Modal hoặc đổi productToEdit
  useEffect(() => {
    if (isOpen) {
      // Reset file upload mỗi khi mở form
      setSelectedFile(null);

      if (productToEdit) {
        // --- CHẾ ĐỘ SỬA ---
        setFormData({
          name: productToEdit.name || "",
          categoryId:
            productToEdit.categoryId ||
            (categories.length > 0 ? categories[0].id : ""),
          priceBase: productToEdit.priceBase || 0,
          description: productToEdit.description || "",
        });
        setImagePreview(productToEdit.imgMain || "/assets/img/blank-image.png");
      } else {
        // --- CHẾ ĐỘ THÊM MỚI ---
        setFormData({
          name: "",
          categoryId: categories.length > 0 ? categories[0].id : "",
          priceBase: "",
          description: "",
        });
        setImagePreview("/assets/img/blank-image.png");
      }
    }
  }, [productToEdit, isOpen, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn ảnh
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Lưu file để gửi API
      setImagePreview(URL.createObjectURL(file)); // Preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!formData.name || !formData.priceBase || !formData.description) {
      showToast({
        title: "Chú ý",
        message: "Vui lòng nhập đầy đủ thông tin!",
        type: "warning",
      });
      return;
    }

    // 2. Chuẩn bị FormData (Bắt buộc cho upload file)
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("priceBase", formData.priceBase);
    payload.append("description", formData.description);
    payload.append("categoryId", formData.categoryId);

    // Nếu có chọn ảnh mới thì gửi lên
    if (selectedFile) {
      payload.append("imgMain", selectedFile);
    }

    try {
      if (productToEdit) {
        // --- GỌI API SỬA ---
        // Lưu ý: Update sản phẩm thường không cần gửi lại restaurantId nếu backend không yêu cầu đổi quán
        await productService.update(productToEdit.id, payload);

        showToast({
          title: "Thành công",
          message: "Cập nhật món ăn thành công!",
          type: "success",
        });
      } else {
        // --- GỌI API THÊM MỚI ---

        if (!storeId) {
          showToast({
            title: "Lỗi",
            message: "Không xác định được cửa hàng (Store ID thiếu)!",
            type: "error",
          });
          return;
        }

        // [QUAN TRỌNG] Gắn restaurantId theo đúng API Document
        payload.append("restaurantId", storeId);

        await productService.create(payload);

        showToast({
          title: "Thành công",
          message: "Thêm món mới thành công!",
          type: "success",
        });
      }

      // 3. Refresh lại danh sách và đóng modal
      onSaveSuccess();
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu dữ liệu.";
      showToast({ title: "Lỗi", message: errorMsg, type: "error" });
    }
  };

  const modalTitle = productToEdit ? "CHỈNH SỬA MÓN ĂN" : "THÊM MÓN MỚI";

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      customWidth="800px"
    >
      <form className={styles.addProductForm} onSubmit={handleSubmit}>
        {/* CỘT TRÁI: ẢNH */}
        <div className={styles.modalContentLeft}>
          <img
            src={imagePreview}
            alt="Preview"
            className={styles.uploadImagePreview}
            onError={(e) => (e.target.src = "/assets/img/blank-image.png")}
          />
          <div className={styles.formGroupFile}>
            <label htmlFor="up-hinh-anh" className={styles.formLabelFile}>
              <i className="fa-regular fa-cloud-arrow-up"></i>
              {productToEdit ? "Đổi hình ảnh" : "Chọn hình ảnh"}
            </label>
            <input
              accept="image/*"
              id="up-hinh-anh"
              type="file"
              className={styles.fileInput}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* CỘT PHẢI: THÔNG TIN */}
        <div className={styles.modalContentRight}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Tên món
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ví dụ: Phở Bò Hà Nội"
              className={styles.formControl}
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoryId" className={styles.formLabel}>
              Danh mục
            </label>
            <select
              name="categoryId"
              id="categoryId"
              className={styles.formControl}
              value={formData.categoryId}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="priceBase" className={styles.formLabel}>
              Giá bán (VNĐ)
            </label>
            <input
              id="priceBase"
              name="priceBase"
              type="number"
              placeholder="Ví dụ: 45000"
              className={styles.formControl}
              value={formData.priceBase}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              Mô tả
            </label>
            <textarea
              className={styles.productDesc}
              id="description"
              name="description"
              placeholder="Mô tả chi tiết món ăn..."
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className={styles.formSubmit}>
            <i
              className={`fa-light ${productToEdit ? "fa-pencil" : "fa-plus"}`}
            ></i>
            <span>{productToEdit ? "LƯU THAY ĐỔI" : "THÊM MÓN"}</span>
          </button>
        </div>
      </form>
    </CommonModal>
  );
};

export default ProductModal;
