import { useState, useEffect } from "react";
import { useCategory } from "../../Hooks/useCategory";

import banner2 from "../../assets/images/banner-2.png";
import banner3 from "../../assets/images/banner-3.png";
import banner4 from "../../assets/images/banner-4.png";
import banner5 from "../../assets/images/banner-5.png";

import ProductList from "../ProductComponent/ProductListComponent/ProductListComponent";

const banners = [banner2, banner3, banner4, banner5];
export default function MainComponent() {
  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 12;
  
  // Get the selected category from the context
  const [selectedCategory] = useCategory();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/products.json");
        const data = await res.json();

        // nếu JSON dạng { products: [...] }
        setProducts(data.products || []);
        // nếu JSON trực tiếp là array thì setProducts(data);
      } catch (err) {
        console.error("Lỗi fetch:", err);
        setProducts([]); // fallback rỗng
      }
    }

    fetchProducts();
  }, []);

  // Filter products based on selected category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => 
        product.category === selectedCategory
      );
      setFilteredProducts(filtered);
    }
    // Reset to first page when category changes
    setCurrentPage(1);
  }, [selectedCategory, products]);

  const handleDetail = (id) => {
    console.log("Xem chi tiết sản phẩm:", id);
  };

  // Page pagination
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const currentProducts = filteredProducts.slice(start, end);

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 3000); // đổi sau 1 giây
    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <main className="main-wrapper">
      <div className="container" id="trangchu">
        <div className="home-slider">
          <img
            src={banners[current]}
            alt={`banner-${current + 2}`}
            className="w-full rounded-lg transition-all duration-700"
          />
        </div>

        <div className="home-service" id="home-service">
          <div className="home-service-item">
            <div className="home-service-item-icon">
              <i className="fa-light fa-person-carry-box"></i>
            </div>
            <div className="home-service-item-content">
              <h4 className="home-service-item-content-h">GIAO HÀNG NHANH</h4>
              <p className="home-service-item-content-desc">
                Cho tất cả đơn hàng
              </p>
            </div>
          </div>

          <div className="home-service-item">
            <div className="home-service-item-icon">
              <i className="fa-light fa-shield-heart"></i>
            </div>
            <div className="home-service-item-content">
              <h4 className="home-service-item-content-h">SẢN PHẨM AN TOÀN</h4>
              <p className="home-service-item-content-desc">
                Cam kết chất lượng
              </p>
            </div>
          </div>

          <div className="home-service-item">
            <div className="home-service-item-icon">
              <i className="fa-light fa-headset"></i>
            </div>
            <div className="home-service-item-content">
              <h4 className="home-service-item-content-h">HỖ TRỢ 24/7</h4>
              <p className="home-service-item-content-desc">
                Tất cả ngày trong tuần
              </p>
            </div>
          </div>

          <div className="home-service-item">
            <div className="home-service-item-icon">
              <i className="fa-light fa-circle-dollar"></i>
            </div>
            <div className="home-service-item-content">
              <h4 className="home-service-item-content-h">HOÀN LẠI TIỀN</h4>
              <p className="home-service-item-content-desc">
                Nếu không hài lòng
              </p>
            </div>
          </div>
        </div>

        <ProductList products={currentProducts} onDetail={handleDetail} />

        <div className="page-nav">
          <ul className="page-nav-list">
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i + 1}
                className={`page-nav-item ${
                  currentPage === i + 1 ? "active" : ""
                }`}
              >
                <a
                  href="#!"
                  onClick={() => {
                    setCurrentPage(i + 1);
                    document
                      .getElementById("home-service")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Account User */}
      <div className="container" id="account-user">
        <div className="main-account">
          <div className="main-account-header">
            <h3>Thông tin tài khoản của bạn</h3>
            <p>Quản lý thông tin để bảo mật tài khoản</p>
          </div>

          <div className="main-account-body">
            <div className="main-account-body-col">
              <form className="info-user">
                <div className="form-group">
                  <label htmlFor="infoname" className="form-label">
                    Họ và tên
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="infoname"
                    id="infoname"
                    placeholder=""
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="infophone" className="form-label">
                    Số điện thoại
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="infophone"
                    id="infophone"
                    disabled
                    placeholder=""
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="infoemail" className="form-label">
                    Email
                  </label>
                  <input
                    className="form-control"
                    type="email"
                    name="infoemail"
                    id="infoemail"
                    placeholder="Thêm địa chỉ email của bạn"
                  />
                  <span className="inforemail-error form-message"></span>
                </div>

                <div className="form-group">
                  <label htmlFor="infoaddress" className="form-label">
                    Địa chỉ
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    name="infoaddress"
                    id="infoaddress"
                    placeholder="Thêm địa chỉ giao hàng của bạn"
                  />
                </div>
              </form>
            </div>

            <div className="main-account-body-col">
              <form className="change-password">
                <div className="form-group">
                  <label className="form-label w60">Mật khẩu hiện tại</label>
                  <input
                    className="form-control"
                    type="password"
                    id="password-cur-info"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <span className="password-cur-info-error form-message"></span>
                </div>

                <div className="form-group">
                  <label className="form-label w60">Mật khẩu mới </label>
                  <input
                    className="form-control"
                    type="password"
                    id="password-after-info"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <span className="password-after-info-error form-message"></span>
                </div>

                <div className="form-group">
                  <label className="form-label w60">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    className="form-control"
                    type="password"
                    id="password-comfirm-info"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <span className="password-after-comfirm-error form-message"></span>
                </div>
              </form>
            </div>

            <div className="main-account-body-row">
              <div>
                <button id="save-info-user">
                  <i className="fa-regular fa-floppy-disk"></i> Lưu thay đổi
                </button>
              </div>
              <div>
                <button id="save-password">
                  <i className="fa-regular fa-key"></i> Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order history */}
      <div className="container" id="order-history">
        <div className="main-account">
          <div className="main-account-header">
            <h3>Quản lý đơn hàng của bạn</h3>
            <p>Xem chi tiết, trạng thái của những đơn hàng đã đặt.</p>
          </div>
          <div className="main-account-body">
            <div className="order-history-section"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
