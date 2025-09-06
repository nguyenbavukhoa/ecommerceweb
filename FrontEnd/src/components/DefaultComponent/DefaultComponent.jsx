import React from "react";
import HeaderComponent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
import CopyrightComponent from "../CopyrightComponent/CopyrightComponent";
const DefaultComponent = ({ children }) => {
  return (
    <div>
      <HeaderComponent />
      {children}
      <FooterComponent />
      <CopyrightComponent />
    </div>
  );
};

export default DefaultComponent;
