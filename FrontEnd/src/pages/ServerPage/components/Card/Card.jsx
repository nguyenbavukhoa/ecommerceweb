import React from "react";
import styles from "./Card.module.scss";

const Card = ({ id, value, image, title, description }) => {
  return (
    <div className={styles.cardSingle}>
      <div className={styles.box}>
        <h2 id={id}>{value}</h2>
        <div className={styles.onBox}>
          <img src={image} alt={title} style={{ width: "200px" }} />
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
