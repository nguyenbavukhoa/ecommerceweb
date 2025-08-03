import React from 'react'
import Slider from 'react-slick';

const SliderComponent = ({ arrImages }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 1500
    };
    return (
        <div>
           <Slider {...settings}>
               {arrImages.map((image, index) => (
                   <div key={index}>
                       <img src={image} alt="slider" preview={false} width="100%" height="400px" />
                   </div>
               ))}
           </Slider>
        </div>
    )
}

export default SliderComponent
