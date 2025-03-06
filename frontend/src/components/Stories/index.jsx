import React from "react";
import styles from "./index.module.css";
import Story from "../../utils/Story";

function Stories({ children, seeMore, setSeeMore, section, stories, userId }) {
  return (
    <div className={styles.topStories}>
      {/* Heading */}
      <h3>{children}</h3>

      {/* Contain all stories. */}
      <div
        className={styles.allStories}
        style={{
          flexWrap: seeMore ? "wrap" : "",
        }}
      >
        {stories.length == 0 ? (
          <span className={styles.noStory}>No Stories Available</span>
        ) : !seeMore ? (
          stories
            .filter((e, i) => i < 4)
            .map((story, index) => (
              <Story story={story} key={index} userId={userId} />
            ))
        ) : (
          stories.map((story, index) => (
            <Story story={story} key={index} userId={userId} />
          ))
        )}
      </div>

      {/* See more button */}
      {stories.length > 4 && (
        <button
          className={styles.seeMore}
          onClick={() => {
            if (seeMore == section) {
              setSeeMore("");
            } else {
              setSeeMore(section);
            }
          }}
        >
          {seeMore ? "Go back" : "See more"}
        </button>
      )}
    </div>
  );
}

export default Stories;
