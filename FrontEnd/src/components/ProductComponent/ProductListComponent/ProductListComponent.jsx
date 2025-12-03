import React from "react";
import ProductItem from "../ProductItemComponent/ProductItemComponent";

function ProductList({ products, onProductDetail }) {
  if (!products || products.length === 0) {
    return (
      <div className="no-result">
        <div className="no-result-h">Không tìm thấy món ăn nào</div>
        <div className="no-result-p">Vui lòng thử lại với từ khóa khác</div>
        <div className="no-result-i">
          <i className="fa-light fa-face-sad-cry"></i>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="home-title-block" id="home-title">
        <h2 className="home-title">Khám phá thực đơn của chúng tôi</h2>
      </div>
      <div className="home-products" id="home-products">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            // Khi click, gọi hàm này để truyền product lên MainWrapper -> HomePage
            onDetail={() => onProductDetail(product)}
          />
        ))}
      </div>
    </>
  );
}

export default ProductList;
