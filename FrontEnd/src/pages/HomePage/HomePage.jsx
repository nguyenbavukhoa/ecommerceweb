import React, { useState } from "react";
import MainWrapperComponent from "../../components/MainWrapperComponent/MainWrapper";
import ProductDetailsComponent from "../../components/ProductComponent/ProductDetailsComponent/ProductDetailsComponent";
import { useToast } from "../../context/ToastContext";
function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { showToast } = useToast();

  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const handleAddToCart = (quantity, note) => {
    const currentUser = localStorage.getItem("currentuser");
    if (!currentUser) {
      showToast({
        title: "Warning",
        message: "Chưa đăng nhập tài khoản !",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    // Xử lý thêm vào giỏ hàng
    handleCloseModal();
  };

  const handleOrderNow = (quantity, note) => {
    const currentUser = localStorage.getItem("currentuser");
    if (!currentUser) {
      showToast({
        title: "Warning",
        message: "Chưa đăng nhập tài khoản !",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    // Xử lý đặt hàng ngay
    handleCloseModal();
  };

  return (
    <>
      <MainWrapperComponent onProductDetail={handleOpenProductDetail} />

      {/* Modal với class open khi modalOpen = true */}
      <div className={`modal product-detail${modalOpen ? " open" : ""}`}>
        <button className="modal-close close-popup" onClick={handleCloseModal}>
          <i className="fa-thin fa-xmark"></i>
        </button>
        <div className="modal-container mdl-cnt" id="product-detail-content">
          {selectedProduct && (
            <ProductDetailsComponent
              product={selectedProduct}
              onClose={handleCloseModal}
              onAddToCart={handleAddToCart}
              onOrderNow={handleOrderNow}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
