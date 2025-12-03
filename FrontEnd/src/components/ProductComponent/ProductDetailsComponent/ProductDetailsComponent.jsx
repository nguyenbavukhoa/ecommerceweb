import React, { useState, useEffect, useCallback } from "react";
import { vnd } from "../../../utils/vnd";
// Import hook giỏ hàng mới
import { useCart } from "../../../context/CartProvider";
import ImageWithFallback from "../../ImageWithFallbackComponent/ImageWithFallback";
// Đảm bảo đường dẫn import đúng
import VariantOptions from "../../VariantOptionComponent/VariantOptions";
import { useProductDetail } from "../../../hooks/useProductDetail";

const ProductDetailsComponent = ({
  productId,
  // product object có thể được truyền trực tiếp nếu đã có sẵn từ list
  product: initialProduct,
  onClose,
  onAddToCart,
  onOrderNow,
}) => {
  // Gọi API lấy chi tiết (để lấy optionGroups đầy đủ)
  // Nếu initialProduct đã có id, dùng nó để fetch
  const idToFetch = productId || initialProduct?.id;
  const { data: productDetail, loading, error } = useProductDetail(idToFetch);

  // Lấy hàm thêm giỏ hàng từ Context mới
  const { addItemToCart, openCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [optionsPrice, setOptionsPrice] = useState(0);

  const [selectedValueIds, setSelectedValueIds] = useState([]);
  const [selectedOptionsDTO, setSelectedOptionsDTO] = useState([]);

  // Ưu tiên dùng dữ liệu chi tiết từ API, nếu chưa có thì dùng dữ liệu sơ bộ từ list
  const product = productDetail || initialProduct;

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
      // API trả về priceBase hoặc basePrice, service đã chuẩn hóa thành priceBase
      const base = product.priceBase || product.basePrice || 0;
      const finalPrice = (base + optionsPrice) * quantity;
      setTotalPrice(finalPrice);
    }
  }, [quantity, optionsPrice, product]);

  // Reset state khi mở sản phẩm mới
  useEffect(() => {
    setQuantity(1);
    setNote("");
    setOptionsPrice(0);
    setSelectedValueIds([]);
    setSelectedOptionsDTO([]);
  }, [idToFetch]);

  const handleIncrease = () => {
    if (quantity < 100) setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCartLocal = async () => {
    if (!product) return;

    // Chuẩn bị object item để thêm vào giỏ
    // Cấu trúc này cần khớp với cartService.addToCart
    const cartItemData = {
      productId: product.id,
      productName: product.name,
      // Service đã chuẩn hóa thành imgMain
      imgUrl: product.imgMain || product.imgUrl,
      price: (product.priceBase || product.basePrice || 0) + optionsPrice,
      storeId: product.storeId,

      // API nhận optionValues là mảng object {id, value, price...}
      // cartService sẽ tự map sang optionValueId (mảng ID) để gửi lên server
      optionValues: selectedOptionsDTO,

      quantity: quantity,
      note: note,
    };

    const result = await addItemToCart(cartItemData);
    if (result && result.success) {
      // alert("Đã thêm vào giỏ hàng!"); // Có thể dùng Toast thay alert
      if (onClose) onClose();
      // openCart(); // Tùy chọn: mở giỏ hàng ngay sau khi thêm
    }
  };

  if (loading)
    return <div style={{ padding: "20px" }}>Đang tải sản phẩm...</div>;
  // if (error) return <div style={{padding: '20px'}}>Lỗi: {error.message || "Không thể tải sản phẩm"}</div>;
  if (!product) return null;

  // GIỮ NGUYÊN UI CŨ
  return (
    <>
      <div className="modal-header">
        <ImageWithFallback
          className="product-image"
          src={product.imgMain || product.imgUrl}
          alt={product.name}
        />
      </div>
      <div className="modal-body">
        <h2 className="product-title">{product.name}</h2>
        <div className="product-control">
          <div className="priceBox">
            <span className="current-price">
              {vnd(product.priceBase || product.basePrice)}
            </span>
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
          <button className="button-dat" onClick={handleAddToCartLocal}>
            <i className="fa-light fa-basket-shopping"></i> Thêm vào giỏ
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetailsComponent;
