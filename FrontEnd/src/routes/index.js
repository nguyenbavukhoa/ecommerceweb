import { useSearchParams } from "react-router-dom";
import HomePage from "../pages/HomePage/HomePage";
import OrderHistoryPage from "../pages/OrderHistoryPage/OrderPage.jsx";
import AuthPage from "../pages/AuthPage/AuthPage.jsx";
import AdminPage from "../pages/AdminPage/AdminPage";
import AdminLogin from "../pages/AdminLogin.jsx/AdminLogin.jsx";
import ServerPage from "../pages/ServerPage/ServerPage.jsx";
import CheckoutPage from "../pages/CheckoutPage/CheckoutPage"; // Import trang Checkout
import ProfilePage from "../pages/ProfilePage/ProfilePage";
import NotificationPage from "../pages/NotificationPage/NotificationPage.jsx";
import PaymentResultPage from "../pages/PaymentResultPage/PaymentResultPage.jsx";
export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: CheckoutPage,
    // isShowHeader: true,
  },
  {
    path: "/order-history",
    page: OrderHistoryPage,
    isShowHeader: true,
  },
  {
    path: "/user-info", // For signup and signin
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/auth", // For signup and signin
    page: AuthPage,
    isShowHeader: true,
  },
  {
    path: "/notifications", // For notifications
    page: NotificationPage,
    isShowHeader: true,
  },
  {
    path: "/payment-result", // For notifications
    page: PaymentResultPage,
    isShowHeader: true,
  },
  {
    path: "/admin-login", // For signin admin
    page: AdminLogin,
    // isShowHeader: true,
  },
  {
    path: "/admin", // For admin dashboard
    page: AdminPage,
    // isPrivate: true,
    // isShowHeader: true,
  },
  {
    path: "/server", // For server dashboard
    page: ServerPage,
    // isPrivate: true,
    // isShowHeader: true,
  },
];
