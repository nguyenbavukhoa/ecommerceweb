// import React from "react";
// import { Row, Col } from "antd";
// import imageProduct from "../../assets/images/slider1.png";
// import imageProductSmall from "../../assets/images/slider1.png";
// import ButtonComponent from "../../ButtonComponent/ButtonComponent";
// import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
// import InputNumber from "antd/es/input-number";

// const ProductDetailsComponent = () => {
//   const onChange = () => {};
//   return (
//     <Row>
//       <Col span={12}>
//         <img src={imageProduct} alt="Product" preview="false" />
//         <div>
//           <img
//             src={imageProductSmall}
//             alt="Product Small"
//             style={{ width: "100px", height: "100px" }}
//           />
//         </div>
//       </Col>
//       <Col span={12}>
//         <h1>Product Name</h1>
//         <p>Description of the product goes here.</p>
//         <h2>$29.99</h2>
//         <p>quantity:</p>
//         <div>
//           <PlusOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
//           <InputNumber min={1} max={10} defaultValue={3} onChange={onChange} />;
//           <MinusOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
//         </div>
//         <div>
//           <ButtonComponent
//             size={40}
//             textButton="Add to Cart"
//             styleButton={{ background: "pink", border: "none" }}
//             styleTextButton={{ color: "white" }}
//           />
//         </div>
//       </Col>
//     </Row>
//   );
// };

// export default ProductDetailsComponent;
import React, { useState, useEffect } from "react";
import { vnd } from "../../../utils/vnd";

const ProductDetailsComponent = ({
  product,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(product?.price || 0);

  useEffect(() => {
    if (product) {
      setTotalPrice(product.price * quantity);
    }
  }, [quantity, product]);

  const handleIncrease = () => {
    if (quantity < 100) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  if (!product) return null;

  return (
    <>
      <div className="modal-header">
        <img className="product-image" src={product.img} alt={product.title} />
      </div>
      <div className="modal-body">
        <h2 className="product-title">{product.title}</h2>
        <div className="product-control">
          <div className="priceBox">
            <span className="current-price">{vnd(product.price)}</span>
          </div>
          <div className="buttons_added">
            <input
              className="minus is-form"
              type="button"
              value="-"
              onClick={handleDecrease}
            />
            <input
              className="input-qty"
              max="100"
              min="1"
              type="number"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= 100) setQuantity(val);
              }}
            />
            <input
              className="plus is-form"
              type="button"
              value="+"
              onClick={handleIncrease}
            />
          </div>
        </div>
        <p className="product-description">{product.desc}</p>
      </div>
      <div className="notebox">
        <p className="notebox-title">Ghi chú</p>
        <textarea
          className="text-note"
          id="popup-detail-note"
          placeholder="Nhập thông tin cần lưu ý..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      <div className="modal-footer">
        <div className="price-total">
          <span className="thanhtien">Thành tiền</span>
          <span className="price">{vnd(totalPrice)}</span>
        </div>
        <div className="modal-footer-control">
          <button
            className="button-dathangngay"
            data-product={product.id}
            onClick={() => onOrderNow(quantity, note)}
          >
            Đặt hàng ngay
          </button>
          <button
            className="button-dat"
            id="add-cart"
            onClick={() => onAddToCart(quantity, note)}
          >
            <i className="fa-light fa-basket-shopping"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
