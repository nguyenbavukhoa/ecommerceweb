import HomePage from "../pages/HomePage/HomePage"
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductsPage from "../pages/ProductsPage/ProductsPage";
import ProductDetailsPage from "../pages/ProductDetailsPage/ProductDetailsPage";
import SigninPage from "../pages/SigninPage/SigninPage";
import SignupPage from "../pages/SignupPage/SignupPage";
import AdminPage from "../pages/AdminPage/AdminPage";


export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true
    },
    {
        path: '/product-details',
        page: ProductDetailsPage,
        isShowHeader: true
    },
    {
        path: '/sign-in',
        page: SigninPage,
        isShowHeader: true
    },
    {
        path: '/sign-up',
        page: SignupPage,
        isShowHeader: true
    },
    {
        path: '/admin',
        page: AdminPage,
        isShowHeader: true
    },
    {
        path: '*',
        page: NotFoundPage
    }
]