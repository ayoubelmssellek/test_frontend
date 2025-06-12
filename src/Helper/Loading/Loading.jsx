// components/Loading.jsx
import React from 'react';
import styles from './loading.module.css';

const Loading = () => {
  return (
    <div className={styles["loading-container"]}>
      <div className={styles["loading-spinner"]}></div>
      <span className={styles["loading-text"]}>Loading...</span>
    </div>
  );
};

export default Loading;