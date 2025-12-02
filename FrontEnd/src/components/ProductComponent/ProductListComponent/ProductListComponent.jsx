import ProductItem from "../ProductItemComponent/ProductItemComponent";

function ProductList({ products, onProductDetail, isLoading }) {
  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (!products || products.length === 0) {
    return (
      <div className="no-result">
        <div className="no-result-h">Tìm kiếm không có kết quả</div>
        <div className="no-result-p">
          Xin lỗi, chúng tôi không thể tìm được kết quả hợp với tìm kiếm của bạn
        </div>
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
            onDetail={() => onProductDetail(product.id)}
          />
        ))}
      </div>
    </>
  );
}

export default ProductList;
