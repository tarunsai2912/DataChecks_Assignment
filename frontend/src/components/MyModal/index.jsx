import React, { useEffect } from "react";
import styles from "./index.module.css";

function MyModal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <div onClick={onClose} className={styles.blackSpace}></div>
      <div className={styles.container}>{children}</div>
    </>
  );
}

export default MyModal;
