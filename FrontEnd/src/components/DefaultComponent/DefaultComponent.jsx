import HeaderComponent from "../HeaderComponent/components/HeaderComponent";
import CartModal from "../../components/CartComponent/CartModal";
import FooterComponent from "../FooterComponent/FooterComponent";
import CopyrightComponent from "../CopyrightComponent/CopyrightComponent";

const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
      <CartModal />
      <FooterComponent />
      <CopyrightComponent />
    </div>
  );
};

export default DefaultComponent;
