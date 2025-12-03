import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
import styles from "./ProductForm.module.scss";

// Components 3 bước
import Step1Info from "./Step1Info";
import Step2Options from "./Step2Options";
import Step3Review from "./Step3Review";

// Dữ liệu & Service
import { useCategories } from "../../../../context/FilterProvider";
import productService from "../../../../services/productService";

// [QUAN TRỌNG] Nhận storeId từ props
const ProductForm = ({ productToEditId, onSaveSuccess, onCancel, storeId }) => {
  const { showToast } = useToast();

  // Lấy danh mục từ API
  const { data: categories = [] } = useCategories();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // State dữ liệu
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    price: "",
    desc: "",
  });

  // State quản lý ảnh
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/blank-image.png"
  );
  const [selectedFile, setSelectedFile] = useState(null); // File thực tế để upload

  const [options, setOptions] = useState([]);

  // Load dữ liệu khi sửa
  useEffect(() => {
    const fetchProductDetail = async () => {
      if (productToEditId) {
        try {
          // Gọi API lấy chi tiết (để có dữ liệu mới nhất)
          const product = await productService.getDetail(productToEditId);

          if (product) {
            setFormData({
              title: product.name,
              desc: product.description,
              price: product.priceBase,
              categoryId: product.categoryId || categories[0]?.id || 1,
            });
            setImagePreview(product.imgMain || "/assets/img/blank-image.png");

            // Map options từ API về format của Form (nếu có)
            const loadedOptions = (product.optionGroups || []).map((g) => ({
              ...g,
              values: g.values.map((v) => ({ ...v, name: v.value || v.name })),
            }));
            setOptions(loadedOptions);
          }
        } catch (error) {
          console.error("Lỗi load sản phẩm:", error);
          showToast({
            title: "Lỗi",
            message: "Không thể tải thông tin món ăn",
            type: "error",
          });
        }
      } else {
        // Reset form khi thêm mới
        setFormData({
          title: "",
          categoryId: categories[0]?.id || "",
          price: "",
          desc: "",
        });
        setImagePreview("/assets/img/blank-image.png");
        setOptions([]);
        setSelectedFile(null);
      }
      setCurrentStep(1);
    };

    fetchProductDetail();
  }, [productToEditId, categories]);

  // Handler: Nhận data từ Step 1
  const handleStep1Submit = (data, imagePreviewUrl, fileObject) => {
    setFormData(data);
    setImagePreview(imagePreviewUrl);
    if (fileObject) {
      setSelectedFile(fileObject); // Lưu file để lát nữa gửi API
    }
    setCurrentStep(2);
  };

  // Handler: Nhận data từ Step 2
  const handleStep2Submit = (currentOptions) => {
    setOptions(currentOptions);
    setCurrentStep(3);
  };

  // Handler: Submit cuối cùng (Step 3)
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // 1. Chuẩn bị FormData
      const payload = new FormData();
      payload.append("name", formData.title);
      payload.append("description", formData.desc);
      payload.append("priceBase", formData.price);
      payload.append("categoryId", formData.categoryId);

      console.log("🛒 Store ID nhận được:", storeId);
      if (!productToEditId) {
        if (!storeId) {
          console.error("❌ Thiếu Store ID!");
          // Có thể hardcode thử để test: payload.append("restaurantId", "1");
        } else {
          payload.append("restaurantId", storeId);
        }
      }

      // Nếu có ảnh mới thì gửi, không thì thôi (API giữ ảnh cũ)
      if (selectedFile) {
        payload.append("imgMain", selectedFile);
      }

      // Log toàn bộ FormData (Lưu ý: console.log(formData) không hiện gì, phải loop)
      console.log("📦 Payload gửi đi:");
      for (let [key, value] of payload.entries()) {
        console.log(`${key}: ${value}`);
      }

      // [QUAN TRỌNG] Xử lý Option Groups
      // Lưu ý: FormData chỉ gửi text/file.
      // Nếu Backend hỗ trợ nhận JSON string cho options thì làm như sau:
      // payload.append("options", JSON.stringify(options));
      // (Tạm thời API Create chưa hỗ trợ options phức tạp, ta cứ gửi thông tin cơ bản trước)

      if (productToEditId) {
        // --- UPDATE ---
        await productService.update(productToEditId, payload);
        showToast({
          title: "Thành công",
          message: "Đã cập nhật món ăn!",
          type: "success",
        });
      } else {
        // --- CREATE ---
        if (!storeId) {
          showToast({
            title: "Lỗi",
            message: "Lỗi hệ thống: Thiếu Store ID",
            type: "error",
          });
          setLoading(false);
          return;
        }
        // Gắn Store ID vào FormData
        payload.append("restaurantId", storeId);

        await productService.create(payload);
        showToast({
          title: "Thành công",
          message: "Đã thêm món mới!",
          type: "success",
        });
      }

      onSaveSuccess(); // Refresh list ở ngoài
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Có lỗi xảy ra!";
      showToast({ title: "Lỗi", message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const title = productToEditId ? "CHỈNH SỬA SẢN PHẨM" : "THÊM MỚI SẢN PHẨM";

  // Render Stepper (Giữ nguyên UI)
  const renderStepper = () => (
    <div className={styles.stepperNav}>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 1 ? styles.active : ""
        }`}
        onClick={() => setCurrentStep(1)}
      >
        <span>1</span> Thông tin
      </div>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 2 ? styles.active : ""
        }`}
        onClick={() => formData.title && setCurrentStep(2)}
      >
        <span>2</span> Tùy chọn
      </div>
      <div
        className={`${styles.stepperItem} ${
          currentStep === 3 ? styles.active : ""
        }`}
        onClick={() => formData.title && setCurrentStep(3)}
      >
        <span>3</span> Xác nhận
      </div>
    </div>
  );

  return (
    <div className={styles.formPageContainer}>
      <div className={styles.formPageHeader}>
        <h3 className={styles.formPageTitle}>{title}</h3>
        <button
          className={styles.formPageCancelBtn}
          onClick={onCancel}
          disabled={loading}
        >
          <i className="fa-light fa-xmark"></i> Thoát
        </button>
      </div>

      <div className={styles.formWizardLayout}>
        {renderStepper()}
        <div className={styles.wizardContent}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "50px" }}>
              Đang xử lý dữ liệu...
            </div>
          ) : (
            <div className={styles.stepContent}>
              {currentStep === 1 && (
                <Step1Info
                  initialData={formData}
                  initialImage={imagePreview}
                  onSubmit={handleStep1Submit}
                  categories={categories}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
