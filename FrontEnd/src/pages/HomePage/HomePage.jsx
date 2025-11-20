import React, { useState } from "react";
import MainWrapperComponent from "../../components/MainWrapperComponent/MainWrapper";
import ProductDetailsComponent from "../../components/ProductComponent/ProductDetailsComponent/ProductDetailsComponent";
import { useToast } from "../../context/ToastContext";
// import CartModal from "../../components/CartComponent/CartModal";
function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProduct] = useState(undefined);
  const { showToast } = useToast();

  const handleOpenProductDetail = (productId) => {
    setSelectedProduct(productId);
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
          {selectedProductId && (
            <ProductDetailsComponent
              productId={selectedProductId}
              onClose={handleCloseModal}
              onAddToCart={handleAddToCart}
              onOrderNow={handleOrderNow}
            />
          )}
        </div>
      </div>
      {/* <CartModal /> */}
    </>
  );
}

export default HomePage;
