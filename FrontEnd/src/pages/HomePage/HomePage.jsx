import React, { useState } from "react";
import MainWrapperComponent from "../../components/MainWrapperComponent/MainWrapper";
import ProductDetailsComponent from "../../components/ProductComponent/ProductDetailsComponent/ProductDetailsComponent";
import { useToast } from "../../context/ToastContext";

function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null); // Lưu cả object product
  const { showToast } = useToast();

  // Hàm này sẽ được truyền xuống tận ProductItem
  const handleOpenProductDetail = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
    document.body.style.overflow = "hidden"; // Chặn scroll background
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    // Để lại null sau khi đóng để reset
    setTimeout(() => setSelectedProduct(null), 200);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {/* Truyền hàm mở modal xuống */}
      <MainWrapperComponent onProductDetail={handleOpenProductDetail} />

      {/* --- MODAL PRODUCT DETAIL (Cấu trúc HTML của bạn) --- */}
      <div
        className={`modal product-detail${modalOpen ? " open" : ""}`}
        onClick={handleCloseModal}
      >
        {/* Nút đóng */}
        <button className="modal-close close-popup" onClick={handleCloseModal}>
          <i className="fa-thin fa-xmark"></i>
        </button>

        {/* Container nội dung */}
        <div
          className="modal-container mdl-cnt"
          id="product-detail-content"
          onClick={(e) => e.stopPropagation()}
        >
          {selectedProduct && (
            <ProductDetailsComponent
              product={selectedProduct} // Truyền object product vào
              onClose={handleCloseModal}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
