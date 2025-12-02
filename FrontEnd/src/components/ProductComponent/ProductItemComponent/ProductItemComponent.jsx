import React from "react";
import ImageWithFallback from "../../../components/ImageWithFallbackComponent/ImageWithFallback";

function ProductItemComponent({ product, onDetail }) {
  if (!product) return null;

  // Dữ liệu đã chuẩn hóa từ Service
  const name = product.name || "Sản phẩm";
  const price = product.priceBase ?? 0;
  const img = product.imgMain || "";

  // Xử lý click
  const handleDetailClick = (e) => {
    if (e) e.preventDefault();
    if (onDetail) onDetail(); // Gọi hàm callback
  };

  return (
    <div className="col-product">
      <article className="card-product">
        <div className="card-header">
          <a href="#" className="card-image-link" onClick={handleDetailClick}>
            <ImageWithFallback className="card-image" src={img} alt={name} />
          </a>
        </div>

        <div className="food-info">
          <div className="card-content">
            <div className="card-title">
              <a
                href="#"
                className="card-title-link"
                onClick={handleDetailClick}
              >
                {name}
              </a>
            </div>
          </div>

          <div className="card-footer">
            <div className="product-price">
              <span className="current-price">
                {price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
            <div className="product-buy">
              <button
                onClick={handleDetailClick}
                className="card-button order-item"
              >
                <i className="fa-regular fa-cart-shopping-fast"></i> Đặt món
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ProductItemComponent;
