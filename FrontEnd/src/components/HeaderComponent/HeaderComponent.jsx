import logo from "../../assets/images/logo/logo.png";

import { useCategory } from "../../Hooks/useCategory";
export default function HeaderComponent() {
  const searchProducts = () => {
    console.log("Searching...");
  };

  const openSearchMb = () => {
    console.log("Open mobile search");
  };

  const closeSearchMb = () => {
    console.log("Close mobile search");
  };

  const openCart = () => {
    console.log("Open cart");
  };

  return (
    <>
      <header>
        {/* Header top */}
        <div className="header-top">
          <div className="container">
            <div className="header-top-left">
              <ul className="header-top-list">
                <li>
                  <a href="">
                    <i className="fa-regular fa-phone"></i> 0123 456 789 (miễn
                    phí)
                  </a>
                </li>
                <li>
                  <a href="">
                    <i className="fa-light fa-location-dot"></i> Xem vị trí cửa
                    hàng
                  </a>
                </li>
              </ul>
            </div>
            <div className="header-top-right">
              <ul className="header-top-list">
                <li>
                  <a href="">Giới thiệu</a>
                </li>
                <li>
                  <a href="">Cửa hàng</a>
                </li>
                <li>
                  <a href="">Chính sách</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Header middle */}
        <div className="header-middle">
          <div className="container">
            {/* Logo */}
            <div className="header-middle-left">
              <div className="header-logo">
                <a href="#">
                  <img src={logo} alt="" className="header-logo-img" />
                </a>
              </div>
            </div>

            {/* Search */}
            <div className="header-middle-center">
              <form action="" className="form-search">
                <span className="search-btn">
                  <i className="fa-light fa-magnifying-glass"></i>
                </span>
                <input
                  type="text"
                  className="form-search-input"
                  placeholder="Tìm kiếm món ăn..."
                  onInput={searchProducts}
                />
                <button type="button" className="filter-btn">
                  <i className="fa-light fa-filter-list"></i>
                  <span>Lọc</span>
                </button>
              </form>
            </div>

            {/* Right menu */}
            <div className="header-middle-right">
              <ul className="header-middle-right-list">
                <li
                  className="header-middle-right-item dnone open"
                  onClick={openSearchMb}
                >
                  <div className="cart-icon-menu">
                    <i className="fa-light fa-magnifying-glass"></i>
                  </div>
                </li>
                <li
                  className="header-middle-right-item close"
                  onClick={closeSearchMb}
                >
                  <div className="cart-icon-menu">
                    <i className="fa-light fa-circle-xmark"></i>
                  </div>
                </li>
                <li className="header-middle-right-item dropdown open">
                  <i className="fa-light fa-user"></i>
                  <div className="auth-container">
                    <span className="text-dndk">Đăng nhập / Đăng ký</span>
                    <span className="text-tk">
                      Tài khoản{" "}
                      <i className="fa-sharp fa-solid fa-caret-down"></i>
                    </span>
                  </div>
                  <ul className="header-middle-right-menu">
                    <li>
                      <a id="login" href="/sign-in">
                        <i className="fa-light fa-right-to-bracket"></i> Đăng
                        nhập
                      </a>
                    </li>
                    <li>
                      <a id="signup" href="/sign-up">
                        <i className="fa-light fa-user-plus"></i> Đăng ký
                      </a>
                    </li>
                  </ul>
                </li>
                <li
                  className="header-middle-right-item open"
                  onClick={openCart}
                >
                  <div className="cart-icon-menu">
                    <i className="fa-light fa-basket-shopping"></i>
                    <span className="count-product-cart">0</span>
                  </div>
                  <span>Giỏ hàng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <HeaderBottom />
    </>
  );
}

function HeaderBottom() {
  const [selectedCategory, showCategory] = useCategory();

  return (
    <nav className="header-bottom">
      <div className="container">
        <ul className="menu-list">
          <li className="menu-list-item">
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                showCategory('all');
              }}
            >
              Trang chủ
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món chay")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món chay' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món chay
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món mặn")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món mặn' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món mặn
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món lẩu")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món lẩu' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món lẩu
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món ăn vặt")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món ăn vặt' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món ăn vặt
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món tráng miệng")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món tráng miệng' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món tráng miệng
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Nước uống")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Nước uống' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Nước uống
            </a>
          </li>
          <li
            className="menu-list-item"
            onClick={() => showCategory("Món khác")}
          >
            <a 
              href="#" 
              className={`menu-link ${selectedCategory === 'Món khác' ? 'active' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              Món khác
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
