import { useState } from "react";

export default function UserInfoPage() {
  const [user, setUser] = useState({
    name: "",
    phone: "0123456789", // ví dụ bị disable
    email: "",
    address: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleChangeInfo = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const saveInfo = () => {
    console.log("Lưu thông tin:", user);
    // gọi API cập nhật
  };

  const changePassword = () => {
    if (passwords.new !== passwords.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    console.log("Đổi mật khẩu:", passwords);
    // gọi API đổi mật khẩu
  };

  return (
    <div className="container open" id="account-user">
      <div className="main-account">
        <div className="main-account-header">
          <h3>Thông tin tài khoản của bạn</h3>
          <p>Quản lý thông tin để bảo mật tài khoản</p>
        </div>

        <div className="main-account-body">
          {/* Cột 1 */}
          <div className="main-account-body-col">
            <form className="info-user" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="infoname" className="form-label">
                  Họ và tên
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  id="infoname"
                  value={user.name}
                  onChange={handleChangeInfo}
                />
              </div>

              <div className="form-group">
                <label htmlFor="infophone" className="form-label">
                  Số điện thoại
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="phone"
                  id="infophone"
                  value={user.phone}
                  disabled
                />
              </div>

              <div className="form-group">
                <label htmlFor="infoemail" className="form-label">
                  Email
                </label>
                <input
                  className="form-control"
                  type="email"
                  name="email"
                  id="infoemail"
                  value={user.email}
                  onChange={handleChangeInfo}
                  placeholder="Thêm địa chỉ email của bạn"
                />
              </div>

              <div className="form-group">
                <label htmlFor="infoaddress" className="form-label">
                  Địa chỉ
                </label>
                <input
                  className="form-control"
                  type="text"
                  name="address"
                  id="infoaddress"
                  value={user.address}
                  onChange={handleChangeInfo}
                  placeholder="Thêm địa chỉ giao hàng của bạn"
                />
              </div>
            </form>
          </div>

          {/* Cột 2 */}
          <div className="main-account-body-col">
            <form
              className="change-password"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="form-group">
                <label className="form-label w60">Mật khẩu hiện tại</label>
                <input
                  className="form-control"
                  type="password"
                  name="current"
                  value={passwords.current}
                  onChange={handleChangePassword}
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </div>

              <div className="form-group">
                <label className="form-label w60">Mật khẩu mới</label>
                <input
                  className="form-control"
                  type="password"
                  name="new"
                  value={passwords.new}
                  onChange={handleChangePassword}
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="form-group">
                <label className="form-label w60">Xác nhận mật khẩu mới</label>
                <input
                  className="form-control"
                  type="password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handleChangePassword}
                  placeholder="Nhập lại mật khẩu mới"
                />
              </div>
            </form>
          </div>

          {/* Nút */}
          <div className="main-account-body-row">
            <div>
              <button type="button" onClick={saveInfo}>
                💾 Lưu thay đổi
              </button>
            </div>
            <div>
              <button type="button" onClick={changePassword}>
                🔑 Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
