import React from "react";

function ProductItem({ product, onDetail }) {
  if (!product) return null;

  const name = product.name || "No name";
  const price = product.priceBase ?? 0; // nếu undefined, đặt 0
  const img = product.imgMain || "/images/default.png";

  return (
    <div className="col-product">
      <article className="card-product">
        <div className="card-header">
          <a
            href="#"
            className="card-image-link"
            onClick={(e) => {
              e.preventDefault();
              onDetail(product.id);
            }}
          >
            <img className="card-image" src={img} alt={name} />
          </a>
        </div>
        <div className="food-info">
          <div className="card-content">
            <div className="card-title">
              <a
                href="#"
                className="card-title-link"
                onClick={(e) => {
                  e.preventDefault();
                  onDetail(product.id);
                }}
              >
                {name}
              </a>
            </div>
          </div>
          <div className="card-footer">
            <div className="product-price">
              <span className="current-price">
                {price.toLocaleString("vi-VN")}₫
              </span>
            </div>
            <div className="product-buy">
              <button
                onClick={() => onDetail(product.id)}
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

export default ProductItem;
