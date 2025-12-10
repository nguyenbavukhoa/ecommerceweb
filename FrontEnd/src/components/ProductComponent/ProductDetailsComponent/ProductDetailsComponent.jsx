import React, { useState, useEffect, useCallback } from "react";
import { vnd } from "../../../utils/vnd";
import { useCart } from "../../../context/CartProvider";
import ImageWithFallback from "../../ImageWithFallbackComponent/ImageWithFallback";
import VariantOptions from "../../VariantOptionComponent/VariantOptions";
import useProductDetail from "../../../Hooks/useProductDetail";

const ProductDetailsComponent = ({ productId, onClose }) => {
  const { product, loading, error } = useProductDetail(productId);
  const { addItemToCart, openCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [optionsPrice, setOptionsPrice] = useState(0);
  const [selectedValueIds, setSelectedValueIds] = useState([]);
  const [selectedOptionsDTO, setSelectedOptionsDTO] = useState([]);

  // [QUAN TRỌNG] Reset form khi productId thay đổi
  useEffect(() => {
    setQuantity(1);
    setNote("");
    setOptionsPrice(0);
    setSelectedValueIds([]);
    setSelectedOptionsDTO([]);
  }, [productId]);

  const handleSelectionChange = useCallback(
    (selection, priceOfOptions, ids, optionObjects) => {
      setOptionsPrice(priceOfOptions);
      setSelectedValueIds(ids);
      setSelectedOptionsDTO(optionObjects);
    },
    []
  );

  useEffect(() => {
    if (product) {
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
      // Dùng id và name trực tiếp từ product hiện tại
      id: product.id, // [FIX] Đảm bảo dùng 'id' để khớp logic findIndex trong hook
      productName: product.name,
      imgUrl: product.imgMain,
      price: product.priceBase + optionsPrice,
      storeId: product.storeId,
      optionValuesDTO: selectedOptionsDTO,
      quantity: quantity,
      note: note,
    };

    // Gọi hàm add
    await addItemToCart(cartItemData);

    alert("Đã thêm vào giỏ hàng!");
    openCart();
    onClose();
  };

  if (loading) return <div style={{ padding: 20 }}>Đang tải sản phẩm...</div>;
  if (error) return <div style={{ padding: 20 }}>Lỗi: {error}</div>;
  if (!product) return null;

  return (
    <>
      <div className="modal-header">
        <ImageWithFallback
          className="product-image"
          src={product.imgMain}
          alt={product.name}
        />
      </div>
      <div className="modal-body">
        <h2 className="product-title">{product.name}</h2>
        <div className="product-control">
          <div className="priceBox">
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
              readOnly
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

      {/* Chỉ render VariantOptions khi có optionGroups */}
      {product.optionGroups && product.optionGroups.length > 0 && (
        <div className="modal-variants">
          <VariantOptions
            optionGroups={product.optionGroups}
            onSelectionChange={handleSelectionChange}
          />
        </div>
      )}

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
