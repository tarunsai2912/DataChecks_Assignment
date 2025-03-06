import React from "react";
import styles from "./index.module.css";

function Error() {
  return (
    <div className={styles.container}>
      <span className={styles.error1}>404</span>
      <span className={styles.error2}>Not found!</span>
    </div>
  );
}

export default Error;
