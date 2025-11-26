// ProductForm.jsx (Đã nâng cấp lên 3 bước)

import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import styles from "./ProductForm.module.scss"; // Đổi tên file CSS
import { createId, getProductImagePath } from "../../utils";

// Import các component cho từng bước
import Step1Info from "./Step1Info";
import Step2Options from "./Step2Options";
import Step3Review from "./Step3Review";

// === IMPORT HOOK LẤY CHI TIẾT ===
import useProductDetail from "../../../../hooks/useProductDetail";

const ProductForm = ({ productToEditId, onSaveSuccess, onCancel }) => {
  const { showToast } = useToast();

  // === GỌI HOOK KHI CÓ ID ĐỂ LẤY CHI TIẾT SẢN PHẨM ===
  const { product: productDataFromApi, loading: isLoadingDetail } =
    useProductDetail(productToEditId);

  // --- STATE QUẢN LÝ CÁC BƯỚC ---
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Options, 3: Review

  // State cho Bước 1
  const [formData, setFormData] = useState({
    title: "",
    category: "Món chay",
    price: "",
    desc: "",
  });
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/blank-image.png"
  );

  // State cho Bước 2
  const [options, setOptions] = useState([]);

  // Load data khi mở form (cho cả 2 bước)
  // === USEEFFECT: "DỊCH" DỮ LIỆU TỪ API ===
  useEffect(() => {
    // Chỉ chạy khi không ở chế độ "Thêm mới" (id=null)
    if (productToEditId && productDataFromApi) {
      // productDataFromApi chính là object `data` trong JSON của bạn
      const product = productDataFromApi;

      // === SỬA MAPPING ===
      setFormData({
        title: product.name, // (name -> title)
        desc: product.description, // (description -> desc)
        price: product.basePrice?.toString(), // (basePrice -> price)
        // LƯU Ý: API detail của bạn KHÔNG trả về category (như productCategoryDTO)
        // Tạm thời để trống
        category: "",
      });
      setImagePreview(product.imgUrl || "/assets/img/blank-image.png"); // (imgUrl -> imagePreview)

      // === DỊCH CẤU TRÚC OPTIONS ===
      // API trả về: { optionGroups: [{ values: [{ value: "..." }] }] }
      // Form cần: { options: [{ values: [{ name: "..." }] }] }
      if (product.optionGroups) {
        const normalizedOptions = product.optionGroups.map((group) => ({
          ...group,
          // Đổi tên key 'value' thành 'name'
          values: group.values.map((v) => ({
            id: v.id,
            name: v.value, // <--- SỬA Ở ĐÂY
            price: v.price,
          })),
        }));
        setOptions(normalizedOptions); // (optionGroups -> options)
      }
    } else if (!productToEditId) {
      // Chế độ "Thêm mới" (id=null) -> Reset form
      setFormData({ title: "", category: "Món chay", price: "", desc: "" });
      setImagePreview("/assets/img/blank-image.png");
      setOptions([]);
    }

    // Luôn bắt đầu ở bước 1 khi id thay đổi
    setCurrentStep(1);
  }, [productToEditId, productDataFromApi]);

  // --- HÀM ĐIỀU HƯỚNG ---
  // (Bước 1) -> (Bước 2)
  const handleStep1Submit = (data, image) => {
    setFormData(data);
    setImagePreview(image);
    setCurrentStep(2);
  };

  // (Bước 2) -> (Bước 3)
  const handleStep2Submit = (currentOptions) => {
    setOptions(currentOptions);
    setCurrentStep(3);
  };

  // (Bước 3) -> Lưu
  const handleFinalSubmit = () => {
    let products = localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products"))
      : [];

    try {
      const productData = {
        ...formData, // Data Bước 1
        price: parseInt(formData.price),
        img: getProductImagePath(imagePreview),
        options: options, // Data Bước 2
      };

      // if (productToEdit) {
      //   // Chế độ Edit
      //   const updatedProduct = { ...productToEdit, ...productData };
      //   const index = products.findIndex((p) => p.id === productToEdit.id);
      //   products[index] = updatedProduct;
      //   showToast({
      //     title: "Success",
      //     message: "Sửa sản phẩm thành công!",
      //     type: "success",
      //   });
      // } else {
      //   // Chế độ Add
      //   const newProduct = {
      //     id: createId(products),
      //     ...productData,
      //     status: 1,
      //   };
      //   products.unshift(newProduct);
      //   showToast({
      //     title: "Success",
      //     message: "Thêm sản phẩm thành công!",
      //     type: "success",
      //   });
      // }

      localStorage.setItem("products", JSON.stringify(products));
      onSaveSuccess(); // Báo cho cha (Products.jsx) biết
    } catch (error) {
      showToast({ title: "Error", message: "Có lỗi xảy ra!", type: "error" });
    }
  };

  const title = productToEditId ? "CHỈNH SỬA SẢN PHẨM" : "THÊM MỚI SẢN PHẨM";

  // --- RENDER ---
  if (productToEditId && isLoadingDetail) {
    return (
      <div className={styles.formPageContainer}>
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }
  // UI Stepper (Thanh điều hướng 3 bước)
  const renderStepper = () => (
    <div className={styles.stepperNav}>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 1 ? styles.active : ""
        }`}
        onClick={() => setCurrentStep(1)} // Quay lại bước 1
      >
        <span>1</span> Thông tin cơ bản
      </div>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 2 ? styles.active : ""
        }`}
        // Chỉ cho click khi đã qua bước 1
        onClick={() => formData.title && setCurrentStep(2)}
      >
        <span>2</span> Tùy chọn sản phẩm
      </div>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 3 ? styles.active : ""
        }`}
        // Chỉ cho click khi đã qua bước 1
        onClick={() => formData.title && setCurrentStep(3)}
      >
        <span>3</span> Xem lại & Xác nhận
      </div>
    </div>
  );

  return (
    <div className={styles.formPageContainer}>
      <div className={styles.formPageHeader}>
        <h3 className={styles.formPageTitle}>{title}</h3>
        {/* Nút Hủy này luôn gọi onCancel để thoát */}
        <button className={styles.formPageCancelBtn} onClick={onCancel}>
          <i className="fa-light fa-xmark"></i>
          Hủy bỏ (Quay lại danh sách)
        </button>
      </div>

      {/* --- BỐ CỤC MỚI --- */}
      {/* Layout này sẽ là "column" trên mobile và "row" trên desktop */}
      <div className={styles.formWizardLayout}>
        {/* CỘT TRÁI (Sidebar trên Desktop) / HÀNG TRÊN (Header trên Mobile)
          Hàm renderStepper() sẽ trả về <div className={styles.stepperNav}>
        */}
        {renderStepper()}

        {/* CỘT PHẢI (Content trên Desktop) / HÀNG DƯỚI (Content trên Mobile)
         */}
        <div className={styles.wizardContent}>
          <div className={styles.stepContent}>
            {currentStep === 1 && (
              <Step1Info
                initialData={formData}
                initialImage={imagePreview}
                onSubmit={handleStep1Submit}
              />
            )}

            {currentStep === 2 && (
              <Step2Options
                initialOptions={options}
                onBack={() => setCurrentStep(1)}
                onNext={handleStep2Submit}
              />
            )}

            {currentStep === 3 && (
              <Step3Review
                formData={formData}
                options={options}
                imagePreview={imagePreview}
                onBack={() => setCurrentStep(2)}
                onSave={handleFinalSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
