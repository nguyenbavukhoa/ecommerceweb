import React, { useState, useEffect, useCallback } from "react";
import { vnd } from "../../../utils/vnd";
import { useCart } from "../../../context/CartProvider";
import ImageWithFallback from "../../ImageWithFallbackComponent/ImageWithFallback";
import VariantOptions from "../../VariantOptionComponent/VariantOptions";
import useProductDetail from "../../../hooks/useProductDetail";

const ProductDetailsComponent = ({
  productId,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  const { product, loading, error } = useProductDetail(productId);
  const { addItemToCart, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [optionsPrice, setOptionsPrice] = useState(0);

  const [selectedValueIds, setSelectedValueIds] = useState([]);
  // 1. Thêm state lưu danh sách object option để hiển thị tên trong giỏ
  const [selectedOptionsDTO, setSelectedOptionsDTO] = useState([]);

  // 2. Cập nhật callback nhận tham số thứ 4 (optionObjects)
  const handleSelectionChange = useCallback(
    (selection, priceOfOptions, ids, optionObjects) => {
      setOptionsPrice(priceOfOptions);
      setSelectedValueIds(ids);
      setSelectedOptionsDTO(optionObjects); // Lưu DTO
    },
    []
  );

  useEffect(() => {
    if (product) {
      // 3. Sửa product.basePrice thành product.priceBase (theo mockData)
      const base = product.priceBase || 0;
      const finalPrice = (base + optionsPrice) * quantity;
      setTotalPrice(finalPrice);
    }
  }, [quantity, optionsPrice, product]);

  const handleIncrease = () => {
    if (quantity < 100) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!product) return;

    const cartItemData = {
      productId: product.id,
      productName: product.name,
      imgUrl: product.imgMain,
      price: product.priceBase + optionsPrice,

      // [QUAN TRỌNG] Thêm storeId vào item trong giỏ
      storeId: product.storeId,

      optionValuesDTO: selectedOptionsDTO,
      quantity: quantity,
      note: note,
    };

    await addItemToCart(cartItemData);
    alert("Đã thêm vào giỏ hàng!");
    openCart();
    onClose();
  };

  if (loading) return <div>Đang tải sản phẩm...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!product) return null;

  return (
    <>
      <div className="modal-header">
        <ImageWithFallback
          className="product-image"
          src={product.imgMain} // Sửa imgUrl thành imgMain theo mockData
          alt={product.name}
        />
      </div>
      <div className="modal-body">
        <h2 className="product-title">{product.name}</h2>
        <div className="product-control">
          <div className="priceBox">
            {/* 5. Sửa hiển thị giá */}
            <span className="current-price">{vnd(product.priceBase)}</span>
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
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= 100) setQuantity(val);
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
        <p className="product-description">{product.description}</p>
      </div>
      <div className="modal-variants">
        <VariantOptions
          optionGroups={product.optionGroups}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <div className="notebox">
        <p className="notebox-title">Ghi chú</p>
        <textarea
          className="text-note"
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
          <button className="button-dat" onClick={handleAddToCart}>
            <i className="fa-light fa-basket-shopping"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
