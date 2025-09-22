import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./sign-login.css";

function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action"); // lấy ?action=...

  const navigate = useNavigate();
  const [isLoginActive, setIsLoginActive] = useState(true);

  // Chỉ cập nhật state khi action thay đổi
  useEffect(() => {
    if (action === "login") {
      setIsLoginActive(true);
    } else if (action === "register") {
      setIsLoginActive(false);
    }
  }, [action]);

  const handleSignup = () => {
    const user = {
      fullname: "Demo",
      phone: "0783374678",
      password: "123456",
      address: "",
      email: "",
      status: 1,
      join: new Date(),
      cart: [],
      userType: 0,
    };

    if (window.confirm("Bạn có chắc chắn muốn đăng ký tài khoản ?")) {
      localStorage.setItem("currentuser", JSON.stringify(user));
      // Implement toast message here
      setTimeout(() => {
        navigate("/");
      }, 1500);
    }
  };

  const handleLogin = () => {
    const user = {
      fullname: "Demo",
      phone: "0783374678",
      password: "123456",
      address: "",
      email: "",
      status: 1,
      join: new Date(),
      cart: [],
      userType: 0,
    };

    localStorage.setItem("currentuser", JSON.stringify(user));
    // Implement toast message here
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="modals signup-login">
      <div className="modal-signup-login-container">
        <div className="form-content">
          <h2 className="logo">KTM</h2>
          <div className="text-sci">
            <h2>
              Welcome!
              <br />
              <span>To Our New Website.</span>
            </h2>
            <p className="form-description">
              {isLoginActive
                ? "Đăng nhập thành viên để mua hàng và nhận những ưu đãi đặc biệt từ chúng tôi"
                : "Đăng ký thành viên để mua hàng và nhận những ưu đãi đặc biệt từ chúng tôi"}
            </p>
            <div className="social-icons">
              <a href="#">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="#">
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>

        <div className={`logreg-box ${!isLoginActive ? "active" : ""}`}>
          <div className="form-box">
            <form
              className="login-form"
              style={{ display: isLoginActive ? "block" : "none" }}
            >
              <h3 className="form-title">Đăng nhập tài khoản</h3>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-phone"></i>
                </span>
                <input
                  id="phone-login"
                  name="phone"
                  type="text"
                  className="form-control"
                  required
                />
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  id="password-login"
                  name="password"
                  type="password"
                  className="form-control"
                  required
                />
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
              </div>
              <div className="remember-forgot">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
              </div>
              <button
                type="button"
                className="form-submit"
                onClick={handleLogin}
              >
                Đăng nhập
              </button>
              <p className="change-login">
                Bạn chưa có tài khoản?{" "}
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginActive(false);
                    setSearchParams({ action: "register" });
                  }}
                  className="signup-link"
                >
                  Đăng ký ngay
                </a>
              </p>
            </form>
          </div>
          <div className="form-box">
            <form
              className="sign-up-form"
              style={{ display: isLoginActive ? "none" : "block" }}
            >
              <h3 className="form-title">Đăng ký tài khoản</h3>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-user"></i>
                </span>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  className="form-control"
                  required
                />
                <label htmlFor="fullname" className="form-label">
                  Tên đầy đủ
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-phone"></i>
                </span>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  className="form-control"
                  required
                />
                <label htmlFor="phone" className="form-label">
                  Số điện thoại
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  required
                />
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
              </div>
              <button
                type="button"
                className="form-submit"
                onClick={handleSignup}
              >
                Đăng ký
              </button>
              <p className="change-login">
                Bạn đã có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginActive(true);
                    setSearchParams({ action: "login" });
                  }}
                  className="login-link"
                >
                  Đăng nhập ngay
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
