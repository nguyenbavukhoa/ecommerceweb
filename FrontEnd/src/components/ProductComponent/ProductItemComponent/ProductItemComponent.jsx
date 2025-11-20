import ImageWithFallback from "../../ImageWithFallbackComponent/ImageWithFallback";
function ProductItem({ product, onDetail }) {
  if (!product) return null;

  const name = product.name || "No name";
  const price = product.priceBase ?? 0; // nếu undefined, đặt 0
  const img = product.imgMain || "/images/default.png";

  // Hàm onDetail (từ props) đã có sẵn ID,
  // nên chúng ta chỉ cần gọi nó.
  const handleDetailClick = (e) => {
    // Chỉ preventDefault nếu 'e' tồn tại (tức là click từ thẻ <a>)
    if (e) {
      e.preventDefault();
    }
    // --- Gọi onDetail() mà không cần truyền ID ---
    onDetail();
  };

  return (
    <div className="col-product">
      <article className="card-product">
        <div className="card-header">
          <a href="#" className="card-image-link" onClick={handleDetailClick}>
            <ImageWithFallback className="card-image" src={img} alt={img} />
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
                {price.toLocaleString("vi-VN")}₫
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

export default ProductItem;
