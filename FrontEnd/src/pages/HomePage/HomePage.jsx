import React from 'react';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WapperTypeProduct } from './style';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import  slider1 from '../../assets/images/slider1.png';
import  slider2  from '../../assets/images/slider2.png';
import CardComponent from '../../components/CardComponent/CardComponent';
import NavBarComponent from '../../components/NavBarComponent/NavBarComponent';

function HomePage() {
  const arr = ['Tom', 'Ga', 'Bo']
  return (
    <div style={{ padding: '0 20px' }}>
      <WapperTypeProduct>
      {arr.map((item, index) => {
        return (
          <TypeProduct key={index} name={item} />
        );
      })}
      </WapperTypeProduct>  
      <SliderComponent arrImages={[slider1, slider2]} />
      <div style={{ display: 'flex',  marginTop: '20px' , alignItems: 'center', gap: '20px'}}>
        <CardComponent />
      </div>
      <NavBarComponent />
    </div>
  );
}

export default HomePage;