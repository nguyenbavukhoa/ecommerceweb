// import logo from "../../../assets/images/logo/logo_v1.jpeg";
// import styles from "../styles/HeaderComponent.module.scss";

// import { useNavigate, Link, useLocation } from "react-router-dom";
// import {
//   useFilters,
//   useCategories,
//   useStores,
// } from "../../../context/FilterProvider";
// import { useCart } from "../../../context/CartProvider";
// import { useAuth } from "../../../context/AuthContext";
// import { useState, useEffect } from "react"; // Đã bỏ useRef
// import { useDebounce } from "../hooks/useDebounce";
// import AdvancedSearch from "./AdvancedSearch";
// // [DELETED] notificationService import

// // Helper scroll
// const scrollToProducts = () => {
//   document
//     .getElementById("home-service")
//     ?.scrollIntoView({ behavior: "smooth" });
// };

// export default function HeaderComponent() {
//   // 1. Lấy dữ liệu từ Context
//   const { openCart, getAmountCart } = useCart();
//   const { auth, logout } = useAuth();
//   const navigate = useNavigate();
//   const { filters, setFilters } = useFilters();
//   const { data: stores = [], isLoading: isLoadingStores } = useStores();

//   // 2. State quản lý UI
//   const [searchTerm, setSearchTerm] = useState(filters.name);
//   const debouncedSearchTerm = useDebounce(searchTerm, 500);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [showMobileSearch, setShowMobileSearch] = useState(false);
//   const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

//   // [DELETED] State & Effect cho Notification

//   // 3. Logic chọn Store mặc định
//   useEffect(() => {
//     if (!isLoadingStores && stores.length > 0) {
//       const currentStoreExists = stores.find(
//         (s) => s.id.toString() === filters.storeId?.toString()
//       );
//       if (!filters.storeId || !currentStoreExists) {
//         setFilters({ storeId: stores[0].id });
//       }
//     }
//   }, [stores, isLoadingStores, filters.storeId, setFilters]);

//   // 4. Logic Search & Filter
//   useEffect(() => {
//     if (!showMobileSearch) {
//       setIsFilterOpen(false);
//     }
//   }, [showMobileSearch]);

//   useEffect(() => {
//     const isSearching = searchTerm !== filters.name;
//     setFilters({ name: debouncedSearchTerm });
//     if (isSearching) setTimeout(scrollToProducts, 0);
//   }, [debouncedSearchTerm]);

//   useEffect(() => {
//     setSearchTerm(filters.name);
//   }, [filters.name]);

//   const handleStoreChange = (e) => {
//     const newStoreId = e.target.value;
//     setFilters({ storeId: newStoreId, page: 1 });
//     setTimeout(scrollToProducts, 0);
//   };

//   const handleToggleFilterClick = (e) => {
//     e.preventDefault();
//     setIsFilterOpen((prev) => !prev);
//     setTimeout(scrollToProducts, 0);
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       setIsFilterOpen((prev) => !prev);
//       setTimeout(scrollToProducts, 0);
//     }
//   };

//   // 5. Tính toán số lượng giỏ hàng
//   const totalAmount = getAmountCart ? getAmountCart() : 0;

//   // 6. Xử lý hiển thị Header Bottom
//   const location = useLocation();
//   const hideHeaderBottomOnPaths = ["/order-history", "/checkout"];
//   const isHeaderBottomVisible = !hideHeaderBottomOnPaths.includes(
//     location.pathname
//   );

//   useEffect(() => {
//     setShowMobileSearch(false);
//   }, [location.pathname]);

//   // 7. Tên hiển thị
//   const displayName = auth?.accountName || auth?.fullName || "Khách hàng";

//   return (
//     <>
//       <header>
//         <div className={styles.headerMiddle}>
//           <div className={styles.container}>
//             {/* GROUP 1: LOGO & STORE SELECTOR */}
//             <div className={styles.headerLeftGroup}>
//               <div className={styles.headerLogo}>
//                 <Link to="/">
//                   <img src={logo} alt="" className={styles.headerLogoImg} />
//                 </Link>
//               </div>

//               {/* <div className={styles.storeSelectorWrapper}>
//                 <i className="fa-solid fa-location-dot location-icon"></i>
//                 <select
//                   value={filters.storeId || ""}
//                   onChange={handleStoreChange}
//                   className={styles.storeSelect}
//                 >
//                   {stores.map((store) => (
//                     <option key={store.id} value={store.id}>
//                       {store.name
//                         ? store.name.replace("KHK Food ", "")
//                         : store.id}
//                     </option>
//                   ))}
//                 </select>
//               </div> */}
//             </div>

//             {/* GROUP 2: SEARCH BAR (DESKTOP) */}
//             <div className={styles.headerMiddleCenter}>
//               <form
//                 className={styles.formSearch}
//                 onSubmit={(e) => e.preventDefault()}
//               >
//                 <button className={styles.searchBtn}>
//                   <i className="fa-light fa-magnifying-glass"></i>
//                 </button>
//                 <input
//                   type="text"
//                   className={styles.input}
//                   placeholder="Tìm kiếm món ăn..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={handleInputKeyDown}
//                 />
//                 <button
//                   type="button"
//                   className={styles.filterBtn}
//                   onClick={handleToggleFilterClick}
//                 >
//                   <i className="fa-light fa-filter-list"></i>
//                   <span>Lọc</span>
//                 </button>
//               </form>
//             </div>

//             {/* GROUP 3: RIGHT MENU */}
//             <div className={styles.headerRight}>
//               <ul className={styles.list}>
//                 {/* ICON SEARCH MOBILE */}
//                 <li
//                   className={styles.searchIconMobile}
//                   onClick={() => setShowMobileSearch(!showMobileSearch)}
//                 >
//                   <i
//                     className={`fa-light ${
//                       showMobileSearch ? "fa-xmark" : "fa-magnifying-glass"
//                     }`}
//                   ></i>
//                 </li>

//                 {/* [DELETED] NOTIFICATION ITEM */}

//                 {/* USER DROPDOWN */}
//                 <li
//                   className={styles.item}
//                   onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
//                   style={{ position: "relative" }}
//                 >
//                   <i
//                     className={`fa-light fa-user ${
//                       auth ? styles.authActive : ""
//                     }`}
//                   ></i>

//                   <div className={styles.authContainer}>
//                     {!auth ? (
//                       <>
//                         <span className={styles.textDndk}>
//                           Đăng nhập / Đăng ký
//                         </span>
//                         <span className={styles.textTk}>
//                           Tài khoản{" "}
//                           <i className="fa-sharp fa-solid fa-caret-down"></i>
//                         </span>
//                       </>
//                     ) : (
//                       <>
//                         <span className={styles.textDndk}>Xin chào</span>
//                         <span className={styles.textTk}>
//                           {displayName}{" "}
//                           <i className="fa-sharp fa-solid fa-caret-down"></i>
//                         </span>
//                       </>
//                     )}
//                   </div>

//                   {/* DROPDOWN MENU */}
//                   {isUserDropdownOpen && (
//                     <ul
//                       className={styles.dropdownMenu}
//                       style={{ display: "block" }}
//                     >
//                       {!auth ? (
//                         <>
//                           <li>
//                             <Link to="/auth?action=login">
//                               <i className="fa-light fa-right-to-bracket"></i>{" "}
//                               Đăng nhập
//                             </Link>
//                           </li>
//                           <li>
//                             <Link to="/auth?action=register">
//                               <i className="fa-light fa-user-plus"></i> Đăng ký
//                             </Link>
//                           </li>
//                         </>
//                       ) : (
//                         <>
//                           <li>
//                             <Link to="/user-info">
//                               <i className="fa-light fa-circle-user"></i> Tài
//                               khoản
//                             </Link>
//                           </li>
//                           <li>
//                             <Link to="/order-history">
//                               <i className="fa-regular fa-bags-shopping"></i>{" "}
//                               Đơn hàng
//                             </Link>
//                           </li>
//                           <li className={styles.border}>
//                             <a
//                               href="#"
//                               onClick={(e) => {
//                                 e.preventDefault();
//                                 logout();
//                                 navigate("/");
//                               }}
//                             >
//                               <i className="fa-light fa-right-from-bracket"></i>{" "}
//                               Đăng xuất
//                             </a>
//                           </li>
//                         </>
//                       )}
//                     </ul>
//                   )}
//                 </li>

//                 {/* CART */}
//                 <li className={styles.item} onClick={openCart}>
//                   <div className={styles.cartIconMenu}>
//                     <i className="fa-light fa-basket-shopping"></i>
//                     <span className={styles.count}>{totalAmount}</span>
//                   </div>
//                   <span>Giỏ hàng</span>
//                 </li>
//               </ul>
//             </div>

//             {/* MOBILE SEARCH SLIDEDOWN */}
//             <div
//               className={`${styles.mobileSearchContainer} ${
//                 showMobileSearch ? styles.open : ""
//               }`}
//             >
//               <form
//                 className={styles.mobileForm}
//                 onSubmit={(e) => e.preventDefault()}
//               >
//                 <i
//                   className={`fa-light fa-magnifying-glass ${styles.mobileSearchIconDeco}`}
//                 ></i>
//                 <input
//                   type="text"
//                   placeholder="Tìm món ăn..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyDown={handleInputKeyDown}
//                 />
//                 <button
//                   type="button"
//                   className={styles.mobileFilterBtn}
//                   onClick={handleToggleFilterClick}
//                 >
//                   <i className="fa-light fa-filter-list"></i>
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </header>

//       <AdvancedSearch
//         isOpen={isFilterOpen}
//         onClose={() => setIsFilterOpen(false)}
//         isMobileSearchOpen={showMobileSearch}
//       />

//       {isHeaderBottomVisible && <HeaderBottom />}
//     </>
//   );
// }

// function HeaderBottom() {
//   const { filters, setFilters } = useFilters();
//   const { data: categories = [] } = useCategories();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleCategoryChange = (e, catId) => {
//     e.preventDefault();
//     setFilters({ category: catId });
//     if (location.pathname !== "/") navigate(`/`);
//     else setTimeout(scrollToProducts, 0);
//   };

//   return (
//     <nav className={styles.headerBottom}>
//       <div className="container">
//         <ul className={styles.menuList}>
//           <li>
//             <a
//               href="#"
//               className={`${styles.menuLink} ${
//                 filters.category === "all" ? styles.active : ""
//               }`}
//               onClick={(e) => handleCategoryChange(e, "all")}
//             >
//               Trang chủ
//             </a>
//           </li>
//           {categories.map((cat) => (
//             <li key={cat.id}>
//               <a
//                 href="#"
//                 className={`${styles.menuLink} ${
//                   filters.category === cat.id ? styles.active : ""
//                 }`}
//                 onClick={(e) => handleCategoryChange(e, cat.id)}
//               >
//                 {cat.name}
//               </a>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </nav>
//   );
// }
import logo from "../../../assets/images/logo/logo_v1.jpeg";
import styles from "../styles/HeaderComponent.module.scss";

import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  useFilters,
  useCategories,
  useStores,
} from "../../../context/FilterProvider";
import { useCart } from "../../../context/CartProvider";
import { useAuth } from "../../../context/AuthContext";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import AdvancedSearch from "./AdvancedSearch";

// Helper scroll
const scrollToProducts = () => {
  document
    .getElementById("home-service")
    ?.scrollIntoView({ behavior: "smooth" });
};

export default function HeaderComponent() {
  const { openCart, getAmountCart } = useCart();
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const { data: stores = [], isLoading: isLoadingStores } = useStores();

  const [searchTerm, setSearchTerm] = useState(filters.name);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Logic chọn Store mặc định
  useEffect(() => {
    if (!isLoadingStores && stores.length > 0) {
      const currentStoreExists = stores.find(
        (s) => s.id.toString() === filters.storeId?.toString()
      );
      if (!filters.storeId || !currentStoreExists) {
        setFilters({ storeId: stores[0].id });
      }
    }
  }, [stores, isLoadingStores, filters.storeId, setFilters]);

  // Logic Search & Filter
  useEffect(() => {
    if (!showMobileSearch) {
      setIsFilterOpen(false);
    }
  }, [showMobileSearch]);

  useEffect(() => {
    const isSearching = searchTerm !== filters.name;
    setFilters({ name: debouncedSearchTerm });
    if (isSearching) setTimeout(scrollToProducts, 0);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(filters.name);
  }, [filters.name]);

  const handleToggleFilterClick = (e) => {
    e.preventDefault();
    setIsFilterOpen((prev) => !prev);
    setTimeout(scrollToProducts, 0);
  };

  // [FIX UX] Enter chỉ search, không mở filter
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowMobileSearch(false);
      setTimeout(scrollToProducts, 0);
    }
  };

  const totalAmount = getAmountCart ? getAmountCart() : 0;
  const location = useLocation();
  const hideHeaderBottomOnPaths = ["/order-history", "/checkout"];
  const isHeaderBottomVisible = !hideHeaderBottomOnPaths.includes(
    location.pathname
  );

  useEffect(() => {
    setShowMobileSearch(false);
  }, [location.pathname]);

  const displayName = auth?.accountName || auth?.fullName || "Khách hàng";

  // CSS inline để reset button trong li (Giữ layout không vỡ)
  const resetBtnStyle = {
    background: "transparent",
    border: "none",
    padding: 0,
    margin: 0,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    color: "inherit",
    font: "inherit",
  };

  return (
    <>
      <header>
        <div className={styles.headerMiddle}>
          <div className={styles.container}>
            {/* GROUP 1: LOGO */}
            <div className={styles.headerLeftGroup}>
              <div className={styles.headerLogo}>
                <Link to="/">
                  <img src={logo} alt="" className={styles.headerLogoImg} />
                </Link>
              </div>
            </div>

            {/* GROUP 2: SEARCH BAR (DESKTOP) */}
            <div className={styles.headerMiddleCenter}>
              <form
                className={styles.formSearch}
                onSubmit={(e) => e.preventDefault()}
              >
                <button className={styles.searchBtn}>
                  <i className="fa-light fa-magnifying-glass"></i>
                </button>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Tìm kiếm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  data-testid="search-input" // [FIX E2E]
                />
                <button
                  type="button"
                  className={styles.filterBtn}
                  onClick={handleToggleFilterClick}
                >
                  <i className="fa-light fa-filter-list"></i>
                  <span>Lọc</span>
                </button>
              </form>
            </div>

            {/* GROUP 3: RIGHT MENU */}
            <div className={styles.headerRight}>
              <ul className={styles.list}>
                {/* ICON SEARCH MOBILE */}
                <li
                  className={styles.searchIconMobile}
                  onClick={() => setShowMobileSearch(!showMobileSearch)}
                >
                  <i
                    className={`fa-light ${
                      showMobileSearch ? "fa-xmark" : "fa-magnifying-glass"
                    }`}
                  ></i>
                </li>

                {/* USER DROPDOWN */}
                <li
                  className={styles.item}
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  style={{ position: "relative" }}
                  data-testid="user-dropdown-trigger" // [FIX E2E]
                >
                  <i
                    className={`fa-light fa-user ${
                      auth ? styles.authActive : ""
                    }`}
                  ></i>

                  <div className={styles.authContainer}>
                    {!auth ? (
                      <>
                        <span className={styles.textDndk}>
                          Đăng nhập / Đăng ký
                        </span>
                        <span className={styles.textTk}>
                          Tài khoản{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    ) : (
                      <>
                        <span className={styles.textDndk}>Xin chào</span>
                        <span className={styles.textTk}>
                          {displayName}{" "}
                          <i className="fa-sharp fa-solid fa-caret-down"></i>
                        </span>
                      </>
                    )}
                  </div>

                  {/* DROPDOWN MENU */}
                  {isUserDropdownOpen && (
                    <ul
                      className={styles.dropdownMenu}
                      style={{ display: "block" }}
                    >
                      {!auth ? (
                        <>
                          <li>
                            <Link
                              to="/auth?action=login"
                              data-testid="login-link"
                            >
                              <i className="fa-light fa-right-to-bracket"></i>{" "}
                              Đăng nhập
                            </Link>
                          </li>
                          <li>
                            <Link to="/auth?action=register">
                              <i className="fa-light fa-user-plus"></i> Đăng ký
                            </Link>
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            <Link to="/user-info">
                              <i className="fa-light fa-circle-user"></i> Tài
                              khoản
                            </Link>
                          </li>
                          <li>
                            <Link to="/order-history">
                              <i className="fa-regular fa-bags-shopping"></i>{" "}
                              Đơn hàng
                            </Link>
                          </li>
                          <li className={styles.border}>
                            {/* [FIX SEMANTIC] Dùng button thay vì a href="#" */}
                            <button
                              style={{ ...resetBtnStyle, width: "100%" }}
                              onClick={(e) => {
                                e.preventDefault();
                                logout();
                                navigate("/");
                              }}
                              data-testid="logout-btn"
                            >
                              <i
                                className="fa-light fa-right-from-bracket"
                                style={{ marginRight: "8px" }}
                              ></i>{" "}
                              Đăng xuất
                            </button>
                          </li>
                        </>
                      )}
                    </ul>
                  )}
                </li>

                {/* CART - [FIX E2E] Bọc trong button */}
                <li className={styles.item}>
                  <button
                    onClick={openCart}
                    style={resetBtnStyle}
                    data-testid="header-cart-btn"
                    aria-label="Giỏ hàng"
                  >
                    <div className={styles.cartIconMenu}>
                      <i className="fa-light fa-basket-shopping"></i>
                      <span className={styles.count}>{totalAmount}</span>
                    </div>
                    <span>Giỏ hàng</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* MOBILE SEARCH SLIDEDOWN */}
            <div
              className={`${styles.mobileSearchContainer} ${
                showMobileSearch ? styles.open : ""
              }`}
            >
              <form
                className={styles.mobileForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <i
                  className={`fa-light fa-magnifying-glass ${styles.mobileSearchIconDeco}`}
                ></i>
                <input
                  type="text"
                  placeholder="Tìm món ăn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                />
                <button
                  type="button"
                  className={styles.mobileFilterBtn}
                  onClick={handleToggleFilterClick}
                >
                  <i className="fa-light fa-filter-list"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <AdvancedSearch
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isMobileSearchOpen={showMobileSearch}
      />

      {isHeaderBottomVisible && <HeaderBottom />}
    </>
  );
}

// ... HeaderBottom giữ nguyên (hoặc thay a href="#" thành button nếu bạn muốn chuẩn 100%)
function HeaderBottom() {
  const { filters, setFilters } = useFilters();
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryChange = (e, catId) => {
    e.preventDefault();
    setFilters({ category: catId });
    if (location.pathname !== "/") navigate(`/`);
    else setTimeout(scrollToProducts, 0);
  };

  return (
    <nav className={styles.headerBottom}>
      <div className="container">
        <ul className={styles.menuList}>
          <li>
            <a
              href="#"
              className={`${styles.menuLink} ${
                filters.category === "all" ? styles.active : ""
              }`}
              onClick={(e) => handleCategoryChange(e, "all")}
            >
              Trang chủ
            </a>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <a
                href="#"
                className={`${styles.menuLink} ${
                  filters.category === cat.id ? styles.active : ""
                }`}
                onClick={(e) => handleCategoryChange(e, cat.id)}
              >
                {cat.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
