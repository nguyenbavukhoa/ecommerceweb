import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";
import "./sign-login.css";

function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");
  const { loginUser, signupUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoginActive, setIsLoginActive] = useState(action !== "register");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginUser(email, password, rememberMe);
      if (!user) throw new Error("Tên tài khoản hoặc mật khẩu không đúng!");
      showToast({
        title: "Login Success",
        message: `Xin chào ${user.accountName || email}`,
        type: "success",
      });
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      showToast({
        title: "Login Failed",
        message: err.message || "Đăng nhập thất bại!",
        type: "error",
      });
    }
  };

  // --- SIGNUP ---
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast({
        title: "Signup Failed",
        message: "Mật khẩu phải có ít nhất 6 ký tự.",
        type: "error",
      });
      return;
    }

    if (password !== confirmPassword) {
      showToast({
        title: "Signup Failed",
        message: "Mật khẩu nhập lại không khớp.",
        type: "error",
      });
      return;
    }

    if (!agreeTerms) {
      showToast({
        title: "Signup Failed",
        message: "Bạn phải đồng ý với Chính sách trang web!",
        type: "error",
      });
      return;
    }

    try {
      const result = await signupUser(email, password, fullname);

      showToast({
        title: "Signup Success",
        message: result.message,
        type: "success",
      });

      // Reset form và chuyển sang login
      setTimeout(() => {
        setIsLoginActive(true);
        setSearchParams({ action: "login" });
        setFullname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreeTerms(false);
      }, 1500);
    } catch (err) {
      // Ở đây sẽ nhận được err từ signupUser
      (err.messages || [err.message]).forEach((msg) => {
        showToast({
          title: "Signup Failed",
          message: msg,
          type: "error",
        });
      });
    }
  };

  return (
    <div className="modals signup-login">
      <div className="modal-signup-login-container">
        {/* Form intro */}
        <div className="form-content">
          <h2 className="logo">KTM</h2>
          <div className="text-sci">
            <h2>
              Welcome! <br />
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

        {/* LOGIN / SIGNUP */}
        <div className={`logreg-box ${!isLoginActive ? "active" : ""}`}>
          {/* LOGIN */}
          <div className="form-box">
            <form
              className="login-form"
              style={{ display: isLoginActive ? "block" : "none" }}
              onSubmit={handleLogin}
            >
              <h3 className="form-title">Đăng nhập tài khoản</h3>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  id="email-login"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email-login" className="form-label">
                  Email
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  id="password-login"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password-login" className="form-label">
                  Mật khẩu
                </label>
              </div>
              <div className="remember-forgot">
                <label>
                  <input
                    id="checkbox-login"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />{" "}
                  Remember me
                </label>
              </div>
              <button className="form-submit" id="login-button" type="submit">
                Đăng nhập
              </button>
              <p className="change-login">
                Bạn chưa có tài khoản ?{" "}
                <a
                  href="#"
                  className="signup-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginActive(false);
                    setSearchParams({ action: "register" });
                  }}
                >
                  Đăng ký ngay
                </a>
              </p>
            </form>
          </div>

          {/* SIGNUP */}
          <div className="form-box">
            <form
              className="sign-up-form"
              style={{ display: isLoginActive ? "none" : "block" }}
              onSubmit={handleSignup}
            >
              <h3 className="form-title">Đăng ký tài khoản</h3>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-user"></i>
                </span>
                <input
                  id="fullname"
                  type="text"
                  className="form-control"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                />
                <label htmlFor="fullname" className="form-label">
                  Tên đầy đủ
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-envelope"></i>
                </span>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email" className="form-label">
                  Email
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
              </div>
              <div className="form-group">
                <span className="icon">
                  <i className="fa-regular fa-lock"></i>
                </span>
                <input
                  id="password_confirmation"
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="password_confirmation" className="form-label">
                  Nhập lại mật khẩu
                </label>
              </div>
              <div className="remember-forgot">
                <label className="form-checkbox" htmlFor="checkbox-signup">
                  <input
                    id="checkbox-signup"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />{" "}
                  Tôi đồng ý với{" "}
                  <a href="#" title="chính sách trang web" target="_blank">
                    Chính sách trang web
                  </a>
                </label>
              </div>
              <button className="form-submit" id="signup-button" type="submit">
                Đăng ký
              </button>
              <p className="change-login">
                Bạn đã có tài khoản ?{" "}
                <a
                  href="#"
                  className="login-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsLoginActive(true);
                    setSearchParams({ action: "login" });
                  }}
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
