import React from "react";
import styles from "./index.module.css";
import editImg from "../assets/edit.png";
import { useNavigate } from "react-router-dom";

function Story({ story, userId }) {
  const navigate = useNavigate();

  function trimHeading(str) {
    if (str.split("").length <= 25) {
      return str;
    }
    return str.substring(0, 25) + "...";
  }
  function trimDescription(str) {
    return str.substring(0, 80) + " . . .";
  }
  return (
    <div className={styles.story}>
      {/* Image or video. */}
      {story.slides[0].imageURL.match(/(\.mp4|\.3gp|\.webm)/) ? (
        <video src={story.slides[0].imageURL} muted></video>
      ) : (
        <img src={story.slides[0].imageURL} alt="Story image" />
      )}

      {/* Heading and description. */}
      <div className={styles.details}>
        <h2>{trimHeading(story.slides[0].heading)}</h2>
        <p>{trimDescription(story.slides[0].description)}</p>
      </div>

      {/* Edit button. */}
      {userId == story.userId && (
        <div
          className={styles.edit}
          onClick={() => {
            navigate(`/edit/${story._id}`);
          }}
        >
          <img src={editImg} alt="" /> <span>Edit</span>
        </div>
      )}

      {/* Inside Black shadow. */}
      <div
        className={styles.blackShadow}
        onClick={() =>
          navigate(`/view/${story._id}/slide/${story.slides[0]._id}`)
        }
      ></div>
    </div>
  );
}

export default Story;
