import React, { useState, useEffect } from "react";
import { useToast } from "../../../../context/ToastContext";
// 1. IMPORT USEAUTH
import { useAuth } from "../../../../context/AuthContext";
import styles from "./ProductForm.module.scss";

import Step1Info from "./Step1Info";
import Step2Options from "./Step2Options";
import Step3Review from "./Step3Review";
import { db } from "../../../../services/dbService";
import { useCategories } from "../../../../context/FilterProvider";

const ProductForm = ({ productToEditId, onSaveSuccess, onCancel }) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  // [MỚI] Lấy danh mục từ API thật thay vì MOCK_CATEGORIES cứng
  const { data: categories = [] } = useCategories();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: 1,
    price: "",
    desc: "",
  });
  const [imagePreview, setImagePreview] = useState(
    "/assets/img/blank-image.png"
  );
  const [options, setOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productToEditId) {
        try {
          const product = await db.products.getOne(productToEditId);
          if (product) {
            setFormData({
              title: product.name,
              desc: product.description,
              price: product.priceBase,
              categoryId: product.categoryId || 1,
            });
            setImagePreview(product.imgMain || "/assets/img/blank-image.png");
            const loadedOptions = (product.optionGroups || []).map((g) => ({
              ...g,
              values: g.values.map((v) => ({ ...v, name: v.value || v.name })),
            }));
            setOptions(loadedOptions);
          }
        } catch (e) {
          console.error(e);
        }
      } else {
        setFormData({ title: "", categoryId: 1, price: "", desc: "" });
        setImagePreview("/assets/img/blank-image.png");
        setOptions([]);
      }
    };
    fetchProduct();
    setCurrentStep(1);
  }, [productToEditId]);

  const handleStep1Submit = (data, image) => {
    setFormData(data);
    setImagePreview(image);
    setCurrentStep(2);
  };

  const handleStep2Submit = (currentOptions) => {
    setOptions(currentOptions);
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      const productData = {
        name: formData.title,
        description: formData.desc,
        priceBase: parseInt(formData.price),
        imgMain: imagePreview,
        categoryId: parseInt(formData.categoryId),
        status: "ACTIVE",
        storeId: productToEditId ? undefined : user?.storeId, // Giữ storeId cũ nếu edit
        optionGroups: options.map((g) => ({
          ...g,
          values: g.values.map((v) => ({
            ...v,
            value: v.name,
            name: undefined,
          })),
        })),
      };

      if (productToEditId) {
        await db.products.update(productToEditId, productData);
        showToast({
          title: "Thành công",
          message: "Đã cập nhật món ăn!",
          type: "success",
        });
      } else {
        if (!user?.storeId) throw new Error("Không xác định được cửa hàng!");
        await db.products.add(productData);
        showToast({
          title: "Thành công",
          message: "Đã thêm món mới!",
          type: "success",
        });
      }

      onSaveSuccess();
    } catch (error) {
      console.error(error);
      showToast({ title: "Lỗi", message: "Có lỗi xảy ra!", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const title = productToEditId ? "CHỈNH SỬA SẢN PHẨM" : "THÊM MỚI SẢN PHẨM";

  // ... (Phần render UI giữ nguyên không thay đổi) ...
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
        <button className={styles.formPageCancelBtn} onClick={onCancel}>
          <i className="fa-light fa-xmark"></i> Thoát
        </button>
      </div>

      <div className={styles.formWizardLayout}>
        {renderStepper()}
        <div className={styles.wizardContent}>
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
                categories={categories}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
