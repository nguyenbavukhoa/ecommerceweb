// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { useToast } from "../../context/ToastContext";
// import styles from "./AuthPage.module.scss";

// function AuthPage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const action = searchParams.get("action");

//   const { loginUser, signupUser, forgotPassword, verifyOtp, resetPassword } =
//     useAuth();
//   const { showToast } = useToast();
//   const navigate = useNavigate();

//   const [view, setView] = useState("login");

//   // State Inputs
//   const [fullname, setFullname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otp, setOtp] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);
//   const [agreeTerms, setAgreeTerms] = useState(false);

//   // Đồng bộ URL khi mới vào
//   useEffect(() => {
//     if (action === "register") {
//       setView("register");
//     } else {
//       if (!["forgot", "verify", "reset"].includes(view)) {
//         setView("login");
//       }
//     }
//   }, [action]);

//   // Hàm xóa sạch form khi chuyển tab
//   const resetFormInput = () => {
//     setFullname("");
//     // setEmail(""); // Có thể giữ lại email để UX tốt hơn
//     setPassword("");
//     setConfirmPassword("");
//     setOtp("");
//     setAgreeTerms(false);
//   };

//   const switchView = (newView) => {
//     resetFormInput(); // Xóa dữ liệu cũ
//     setView(newView);
//     if (newView === "register") setSearchParams({ action: "register" });
//     else if (newView === "login") setSearchParams({ action: "login" });
//   };

//   // --- HANDLERS ---
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const result = await loginUser(email, password);
//     if (result.success) {
//       showToast({
//         title: "Thành công",
//         message: result.message,
//         type: "success",
//       });
//       navigate("/");
//     } else {
//       showToast({ title: "Lỗi", message: result.message, type: "error" });
//     }
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     if (password.length < 6)
//       return showToast({
//         title: "Lỗi",
//         message: "Mật khẩu < 6 ký tự",
//         type: "error",
//       });
//     if (password !== confirmPassword)
//       return showToast({
//         title: "Lỗi",
//         message: "Mật khẩu không khớp",
//         type: "error",
//       });
//     if (!agreeTerms)
//       return showToast({
//         title: "Lỗi",
//         message: "Bạn chưa đồng ý điều khoản",
//         type: "error",
//       });

//     const result = await signupUser({
//       email,
//       password,
//       accountName: fullname,
//       role: "USER",
//     });
//     if (result.success) {
//       showToast({
//         title: "Thành công",
//         message: result.message,
//         type: "success",
//       });
//       setTimeout(() => switchView("login"), 1500);
//     } else {
//       showToast({ title: "Lỗi", message: result.message, type: "error" });
//     }
//   };

//   // 1. Quên mật khẩu
//   const handleForgot = async (e) => {
//     e.preventDefault();
//     if (!email)
//       return showToast({
//         title: "Lỗi",
//         message: "Vui lòng nhập Email",
//         type: "error",
//       });

//     const result = await forgotPassword(email);
//     if (result.success) {
//       showToast({
//         title: "Đã gửi mã",
//         message: result.message,
//         type: "success",
//       });
//       setView("verify");
//     } else {
//       showToast({ title: "Lỗi", message: result.message, type: "error" });
//     }
//   };

//   // 2. Xác thực OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp)
//       return showToast({
//         title: "Lỗi",
//         message: "Vui lòng nhập OTP",
//         type: "error",
//       });

//     const result = await verifyOtp(email, otp);
//     if (result.success) {
//       showToast({
//         title: "Thành công",
//         message: result.message,
//         type: "success",
//       });
//       setView("reset"); // Chuyển sang đặt lại mật khẩu
//     } else {
//       showToast({ title: "Lỗi", message: result.message, type: "error" });
//     }
//   };

//   // 3. Đặt lại mật khẩu
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (password.length < 6)
//       return showToast({
//         title: "Lỗi",
//         message: "Mật khẩu mới phải >= 6 ký tự",
//         type: "error",
//       });
//     if (password !== confirmPassword)
//       return showToast({
//         title: "Lỗi",
//         message: "Xác nhận mật khẩu không khớp",
//         type: "error",
//       });

//     const result = await resetPassword(email, password);
//     if (result.success) {
//       showToast({
//         title: "Thành công",
//         message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
//         type: "success",
//       });
//       setTimeout(() => switchView("login"), 1500);
//     } else {
//       showToast({ title: "Lỗi", message: result.message, type: "error" });
//     }
//   };

//   return (
//     <div className={`${styles.modals} ${styles.signupLogin}`}>
//       <div className={styles.modalContainer}>
//         {/* Intro Left (Ẩn trên mobile) */}
//         <div className={styles.formContent}>
//           <h2 className={styles.logo}>KTM</h2>
//           <div className={styles.textSci}>
//             <h2>
//               Welcome! <br />
//               <span>To Our New Website.</span>
//             </h2>
//             <p>
//               {view === "register"
//                 ? "Đăng ký thành viên để mua hàng và nhận ưu đãi."
//                 : "Đăng nhập để trải nghiệm dịch vụ tốt nhất."}
//             </p>
//             <div className={styles.socialIcons}>
//               <a href="#">
//                 <i className="fab fa-facebook-f"></i>
//               </a>
//               <a href="#">
//                 <i className="fab fa-twitter"></i>
//               </a>
//               <a href="#">
//                 <i className="fab fa-linkedin-in"></i>
//               </a>
//               <a href="#">
//                 <i className="fab fa-whatsapp"></i>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Khung Form Phải */}
//         <div
//           className={`${styles.logregBox} ${
//             view === "register" ? styles.active : ""
//           }`}
//         >
//           {/* SLOT 1: Login / Forgot / Verify / Reset */}
//           <div className={styles.formBox}>
//             {view === "forgot" ? (
//               // --- FORM 1: NHẬP EMAIL ---
//               <form onSubmit={handleForgot}>
//                 <h3 className={styles.formTitle}>Quên mật khẩu</h3>
//                 <p
//                   style={{
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     color: "#666",
//                   }}
//                 >
//                   Nhập email để nhận mã OTP
//                 </p>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="email"
//                     placeholder=" "
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   <label>Email</label>
//                   <span className={styles.icon}>
//                     <i className="fa-regular fa-envelope"></i>
//                   </span>
//                 </div>
//                 <button type="submit" className={styles.formSubmit}>
//                   Gửi yêu cầu
//                 </button>
//                 <p className={styles.changeLogin}>
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switchView("login");
//                     }}
//                   >
//                     Quay lại
//                   </a>
//                 </p>
//               </form>
//             ) : view === "verify" ? (
//               // --- FORM 2: NHẬP OTP ---
//               <form onSubmit={handleVerifyOtp}>
//                 <h3 className={styles.formTitle}>Xác thực OTP</h3>
//                 <p
//                   style={{
//                     marginBottom: "20px",
//                     textAlign: "center",
//                     color: "#666",
//                   }}
//                 >
//                   Mã OTP đã gửi tới <b>{email}</b>
//                 </p>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="text"
//                     placeholder=" "
//                     required
//                     maxLength={6}
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                   />
//                   <label>Mã OTP</label>
//                   <span className={styles.icon}>
//                     <i className="fa-solid fa-key"></i>
//                   </span>
//                 </div>
//                 <button type="submit" className={styles.formSubmit}>
//                   Xác nhận
//                 </button>
//                 <p className={styles.changeLogin}>
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switchView("forgot");
//                     }}
//                   >
//                     Gửi lại mã?
//                   </a>
//                 </p>
//               </form>
//             ) : view === "reset" ? (
//               // --- FORM 3: ĐẶT MẬT KHẨU MỚI ---
//               <form onSubmit={handleResetPassword}>
//                 <h3 className={styles.formTitle}>Đặt lại mật khẩu</h3>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="password"
//                     placeholder=" "
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <label>Mật khẩu mới</label>
//                   <span className={styles.icon}>
//                     <i className="fa-regular fa-lock"></i>
//                   </span>
//                 </div>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="password"
//                     placeholder=" "
//                     required
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                   />
//                   <label>Xác nhận mật khẩu</label>
//                   <span className={styles.icon}>
//                     <i className="fa-regular fa-lock"></i>
//                   </span>
//                 </div>
//                 <button type="submit" className={styles.formSubmit}>
//                   Đổi mật khẩu
//                 </button>
//                 <p className={styles.changeLogin}>
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switchView("login");
//                     }}
//                   >
//                     Hủy bỏ
//                   </a>
//                 </p>
//               </form>
//             ) : (
//               // --- FORM GỐC: LOGIN ---
//               <form onSubmit={handleLogin}>
//                 <h3 className={styles.formTitle}>Đăng nhập</h3>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="email"
//                     placeholder=" "
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                   <label>Email</label>
//                   <span className={styles.icon}>
//                     <i className="fa-regular fa-envelope"></i>
//                   </span>
//                 </div>
//                 <div className={styles.formGroup}>
//                   <input
//                     type="password"
//                     placeholder=" "
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                   <label>Mật khẩu</label>
//                   <span className={styles.icon}>
//                     <i className="fa-regular fa-lock"></i>
//                   </span>
//                 </div>
//                 <div className={styles.rememberForgot}>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={rememberMe}
//                       onChange={(e) => setRememberMe(e.target.checked)}
//                     />{" "}
//                     Remember me
//                   </label>
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switchView("forgot");
//                     }}
//                   >
//                     Quên mật khẩu?
//                   </a>
//                 </div>
//                 <button type="submit" className={styles.formSubmit}>
//                   Đăng nhập
//                 </button>
//                 <p className={styles.changeLogin}>
//                   Bạn chưa có tài khoản?{" "}
//                   <a
//                     href="#"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       switchView("register");
//                     }}
//                   >
//                     Đăng ký ngay
//                   </a>
//                 </p>
//               </form>
//             )}
//           </div>

//           {/* SLOT 2: REGISTER (Luôn ở đây để trượt ra) */}
//           <div className={styles.formBox}>
//             <form onSubmit={handleSignup}>
//               <h3 className={styles.formTitle}>Đăng ký</h3>
//               <div className={styles.formGroup}>
//                 <input
//                   type="text"
//                   placeholder=" "
//                   required
//                   value={fullname}
//                   onChange={(e) => setFullname(e.target.value)}
//                 />
//                 <label>Họ tên</label>
//                 <span className={styles.icon}>
//                   <i className="fa-regular fa-user"></i>
//                 </span>
//               </div>
//               <div className={styles.formGroup}>
//                 <input
//                   type="email"
//                   placeholder=" "
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <label>Email</label>
//                 <span className={styles.icon}>
//                   <i className="fa-regular fa-envelope"></i>
//                 </span>
//               </div>
//               <div className={styles.formGroup}>
//                 <input
//                   type="password"
//                   placeholder=" "
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <label>Mật khẩu</label>
//                 <span className={styles.icon}>
//                   <i className="fa-regular fa-lock"></i>
//                 </span>
//               </div>
//               <div className={styles.formGroup}>
//                 <input
//                   type="password"
//                   placeholder=" "
//                   required
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <label>Nhập lại mật khẩu</label>
//                 <span className={styles.icon}>
//                   <i className="fa-regular fa-lock"></i>
//                 </span>
//               </div>
//               <div className={styles.rememberForgot}>
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={agreeTerms}
//                     onChange={(e) => setAgreeTerms(e.target.checked)}
//                     required
//                   />
//                   Tôi đồng ý với <a href="#">Chính sách</a>
//                 </label>
//               </div>
//               <button type="submit" className={styles.formSubmit}>
//                 Đăng ký
//               </button>
//               <p className={styles.changeLogin}>
//                 Đã có tài khoản?{" "}
//                 <a
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     switchView("login");
//                   }}
//                 >
//                   Đăng nhập ngay
//                 </a>
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AuthPage;
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import styles from "./AuthPage.module.scss";

function AuthPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const action = searchParams.get("action");

  const { loginUser, signupUser, forgotPassword, verifyOtp, resetPassword } =
    useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [view, setView] = useState("login");
  // [UX] Thêm state loading để disable nút khi đang gọi API
  const [loading, setLoading] = useState(false);

  // State Inputs
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Đồng bộ URL khi mới vào
  useEffect(() => {
    if (action === "register") {
      setView("register");
    } else {
      if (!["forgot", "verify", "reset"].includes(view)) {
        setView("login");
      }
    }
  }, [action]);

  // Hàm xóa sạch form khi chuyển tab
  const resetFormInput = () => {
    setFullname("");
    // setEmail(""); // Giữ lại email để UX tốt hơn
    setPassword("");
    setConfirmPassword("");
    setOtp("");
    setAgreeTerms(false);
  };

  const switchView = (newView) => {
    resetFormInput();
    setView(newView);
    if (newView === "register") setSearchParams({ action: "register" });
    else if (newView === "login") setSearchParams({ action: "login" });
  };

  // --- HANDLERS ---

  // 1. ĐĂNG NHẬP
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading
    try {
      const result = await loginUser(email, password);
      if (result.success) {
        showToast({
          title: "Thành công",
          message: result.message,
          type: "success",
        });
        navigate("/");
      } else {
        showToast({ title: "Lỗi", message: result.message, type: "error" });
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  // 2. ĐĂNG KÝ
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password.length < 6)
      return showToast({
        title: "Lỗi",
        message: "Mật khẩu < 6 ký tự",
        type: "error",
      });
    if (password !== confirmPassword)
      return showToast({
        title: "Lỗi",
        message: "Mật khẩu không khớp",
        type: "error",
      });
    if (!agreeTerms)
      return showToast({
        title: "Lỗi",
        message: "Bạn chưa đồng ý điều khoản",
        type: "error",
      });

    setLoading(true);
    try {
      const result = await signupUser({
        email,
        password,
        accountName: fullname,
        role: "USER",
      });
      if (result.success) {
        showToast({
          title: "Thành công",
          message: result.message,
          type: "success",
        });
        setTimeout(() => switchView("login"), 1500);
      } else {
        showToast({ title: "Lỗi", message: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // 3. QUÊN MẬT KHẨU
  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email)
      return showToast({
        title: "Lỗi",
        message: "Vui lòng nhập Email",
        type: "error",
      });

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.success) {
        showToast({
          title: "Đã gửi mã",
          message: result.message,
          type: "success",
        });
        setView("verify");
      } else {
        showToast({ title: "Lỗi", message: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // 4. XÁC THỰC OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp)
      return showToast({
        title: "Lỗi",
        message: "Vui lòng nhập OTP",
        type: "error",
      });

    setLoading(true);
    try {
      const result = await verifyOtp(email, otp);
      if (result.success) {
        showToast({
          title: "Thành công",
          message: result.message,
          type: "success",
        });
        setView("reset"); // Chuyển sang đặt lại mật khẩu
      } else {
        showToast({ title: "Lỗi", message: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  // 5. ĐẶT LẠI MẬT KHẨU
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password.length < 6)
      return showToast({
        title: "Lỗi",
        message: "Mật khẩu mới phải >= 6 ký tự",
        type: "error",
      });
    if (password !== confirmPassword)
      return showToast({
        title: "Lỗi",
        message: "Xác nhận mật khẩu không khớp",
        type: "error",
      });

    setLoading(true);
    try {
      const result = await resetPassword(email, password);
      if (result.success) {
        showToast({
          title: "Thành công",
          message: "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.",
          type: "success",
        });
        setTimeout(() => switchView("login"), 1500);
      } else {
        showToast({ title: "Lỗi", message: result.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.modals} ${styles.signupLogin}`}>
      <div className={styles.modalContainer}>
        {/* Intro Left (Ẩn trên mobile) */}
        <div className={styles.formContent}>
          <h2 className={styles.logo}>KTM</h2>
          <div className={styles.textSci}>
            <h2>
              Welcome! <br />
              <span>To Our New Website.</span>
            </h2>
            <p>
              {view === "register"
                ? "Đăng ký thành viên để mua hàng và nhận ưu đãi."
                : "Đăng nhập để trải nghiệm dịch vụ tốt nhất."}
            </p>
            <div className={styles.socialIcons}>
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

        {/* Khung Form Phải */}
        <div
          className={`${styles.logregBox} ${
            view === "register" ? styles.active : ""
          }`}
        >
          {/* SLOT 1: Login / Forgot / Verify / Reset */}
          <div className={styles.formBox}>
            {view === "forgot" ? (
              // --- FORM 1: NHẬP EMAIL ---
              <form onSubmit={handleForgot}>
                <h3 className={styles.formTitle}>Quên mật khẩu</h3>
                <p
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Nhập email để nhận mã OTP
                </p>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    placeholder=" "
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Email</label>
                  <span className={styles.icon}>
                    <i className="fa-regular fa-envelope"></i>
                  </span>
                </div>
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={loading}
                >
                  {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
                <p className={styles.changeLogin}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchView("login");
                    }}
                  >
                    Quay lại
                  </a>
                </p>
              </form>
            ) : view === "verify" ? (
              // --- FORM 2: NHẬP OTP ---
              <form onSubmit={handleVerifyOtp}>
                <h3 className={styles.formTitle}>Xác thực OTP</h3>
                <p
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#666",
                  }}
                >
                  Mã OTP đã gửi tới <b>{email}</b>
                </p>
                <div className={styles.formGroup}>
                  <input
                    type="text"
                    placeholder=" "
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <label>Mã OTP</label>
                  <span className={styles.icon}>
                    <i className="fa-solid fa-key"></i>
                  </span>
                </div>
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={loading}
                >
                  {loading ? "Đang xác thực..." : "Xác nhận"}
                </button>
                <p className={styles.changeLogin}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchView("forgot");
                    }}
                  >
                    Gửi lại mã?
                  </a>
                </p>
              </form>
            ) : view === "reset" ? (
              // --- FORM 3: ĐẶT MẬT KHẨU MỚI ---
              <form onSubmit={handleResetPassword}>
                <h3 className={styles.formTitle}>Đặt lại mật khẩu</h3>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label>Mật khẩu mới</label>
                  <span className={styles.icon}>
                    <i className="fa-regular fa-lock"></i>
                  </span>
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    placeholder=" "
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <label>Xác nhận mật khẩu</label>
                  <span className={styles.icon}>
                    <i className="fa-regular fa-lock"></i>
                  </span>
                </div>
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
                <p className={styles.changeLogin}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchView("login");
                    }}
                  >
                    Hủy bỏ
                  </a>
                </p>
              </form>
            ) : (
              // --- FORM GỐC: LOGIN ---
              <form onSubmit={handleLogin}>
                <h3 className={styles.formTitle}>Đăng nhập</h3>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    placeholder=" "
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="login-email" /* [FIX E2E] */
                  />
                  <label>Email</label>
                  <span className={styles.icon}>
                    <i className="fa-regular fa-envelope"></i>
                  </span>
                </div>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    placeholder=" "
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="login-password" /* [FIX E2E] */
                  />
                  <label>Mật khẩu</label>
                  <span className={styles.icon}>
                    <i className="fa-regular fa-lock"></i>
                  </span>
                </div>
                <div className={styles.rememberForgot}>
                  <label>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />{" "}
                    Remember me
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchView("forgot");
                    }}
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <button
                  type="submit"
                  className={styles.formSubmit}
                  disabled={loading}
                  data-testid="login-submit" /* [FIX E2E] */
                >
                  {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
                <p className={styles.changeLogin}>
                  Bạn chưa có tài khoản?{" "}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      switchView("register");
                    }}
                  >
                    Đăng ký ngay
                  </a>
                </p>
              </form>
            )}
          </div>

          {/* SLOT 2: REGISTER (Luôn ở đây để trượt ra) */}
          <div className={styles.formBox}>
            <form onSubmit={handleSignup}>
              <h3 className={styles.formTitle}>Đăng ký</h3>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder=" "
                  required
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  data-testid="register-fullname"
                />
                <label>Họ tên</label>
                <span className={styles.icon}>
                  <i className="fa-regular fa-user"></i>
                </span>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="email"
                  placeholder=" "
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="register-email"
                />
                <label>Email</label>
                <span className={styles.icon}>
                  <i className="fa-regular fa-envelope"></i>
                </span>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder=" "
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="register-password"
                />
                <label>Mật khẩu</label>
                <span className={styles.icon}>
                  <i className="fa-regular fa-lock"></i>
                </span>
              </div>
              <div className={styles.formGroup}>
                <input
                  type="password"
                  placeholder=" "
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  data-testid="register-confirm-password"
                />
                <label>Nhập lại mật khẩu</label>
                <span className={styles.icon}>
                  <i className="fa-regular fa-lock"></i>
                </span>
              </div>
              <div className={styles.rememberForgot}>
                <label>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    required
                  />
                  Tôi đồng ý với <a href="#">Chính sách</a>
                </label>
              </div>
              <button
                type="submit"
                className={styles.formSubmit}
                disabled={loading}
                data-testid="register-submit"
              >
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
              <p className={styles.changeLogin}>
                Đã có tài khoản?{" "}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    switchView("login");
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
