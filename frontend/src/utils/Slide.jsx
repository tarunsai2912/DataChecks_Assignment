import React from "react";
import styles from "./index.module.css";
import { Outlet, useNavigate } from "react-router-dom";

function Slide({ slide, storyId }) {
  const navigate = useNavigate();
  return (
    <div className={styles.story}>
      {/* Image or video. */}
      {slide.imageURL.match(/(\.mp4|\.3gp|\.webm)/) ? (
        <video src={slide.imageURL} muted></video>
      ) : (
        <img src={slide.imageURL} alt="Story image" />
      )}

      {/* Heading and description. */}
      <div className={styles.details}>
        <h2>{slide.heading}</h2>
        <p>{slide.description}</p>
      </div>

      {/* Inside Black shadow. */}
      <div
        className={styles.blackShadow}
        onClick={() => navigate(`/view/${storyId}/slide/${slide._id}`)}
      ></div>

      <Outlet />
    </div>
  );
}

export default Slide;
