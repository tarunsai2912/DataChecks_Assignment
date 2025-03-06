import React from "react";
import styles from "./index.module.css";
import { saveAs } from "file-saver";
import saveIcon from "../../assets/save.png";
import whiteHeart from "../../assets/white.png";
import redHeart from "../../assets/red.png";
import crossIcon from "../../assets/cross.png";
import shareIcon from "../../assets/share.png";
import lessIcon from "../../assets/less.png";
import greatIcon from "../../assets/great.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getRandomId, getStoryByIdAndSlide } from "../../apis/story";
import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useRef } from "react";
import bookmarkBlue from "../../assets/bookmark-blue.png";
import { getBookandLike, getLike, setBookAndLike } from "../../apis/data";
import downloadIcon from "../../assets/download.png";
import { useOutletContext } from "react-router-dom";
import muteIcon from "../../assets/mute.png";
import soundIcon from "../../assets/sound-on.png";

function ViewStory() {
  const [width, setWidth] = useState(window.innerWidth);
  const location = useLocation();
  const { setCurrentState } = useOutletContext();
  const navigate = useNavigate();
  const { id, slideId } = useParams(); // Story id and slide id.
  const [storyInfo, setStoryInfo] = useState({}); // Stories and visit index.
  const [visitIndex, setVisitIndex] = useState(-1); // Stores visit index.
  const loadOnce = useRef(true); // load once.
  const [bookmarkState, setBookMarkState] = useState([-1]);
  const [likeState, setLikeState] = useState([-1]);
  const [like, setLike] = useState(null);
  const [downloadState, setDownloadState] = useState(true);

  // State to manage if the video is muted or not
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const currentStoryId = useRef(id);

  // Function to toggle mute/unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location]);

  // loads story.
  useEffect(() => {
    if (currentStoryId.current != id) {
      currentStoryId.current = id;
      loadOnce.current = true;
    }
    if (loadOnce.current) {
      getStoryByIdAndSlide(id, slideId)
        .then((res) => {
          if (res.data.visitIndex == -1) {
            navigate("*");
          }
          if (res.status == 200) {
            setStoryInfo({ ...res.data });
            setVisitIndex(res.data.visitIndex);
            loadOnce.current = false;
          }
        })
        .catch((err) => {
          toast.error("Something went wrong!");
        });

      if (localStorage.getItem("token")) {
        getBookandLike(id).then((res) => {
          if (res.status == 200) {
            setBookMarkState(res.data.bookmark);
            setLikeState(res.data.like);
          } else {
            toast.error(
              "Something went wrong while loading bookmark and like data!"
            );
          }
        });
      }

      getLike(id).then((res) => {
        if (res.status == 200) {
          setLike({ ...res.data });
        } else {
          toast.error("Something went wrong will loading like counts!");
        }
      });
    }
    // if (Object.keys(storyInfo).length != 0) {
    //   let timeout;
    //   if (visitIndex < storyInfo.slides.length - 1) {
    //     timeout = setTimeout(() => {
    //       setVisitIndex(visitIndex + 1);
    //     }, 3000);
    //   }
    // }
  }, [location]);

  function download() {
    return new Promise((resolve, reject) => {
      saveAs(storyInfo.slides[visitIndex].imageURL, "story");
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
  // Handle download
  const handleDownload = () => {
    setDownloadState(false);
    download().then(() => {
      setDownloadState(true);
    });
  };
  return (
    <>
      <div className={styles.container}>
        {/* Previous slide. */}
        <div
          className={styles.control}
          onClick={(e) => {
            if (visitIndex >= 1) {
              navigate(
                `/view/${id}/slide/${storyInfo.slides[visitIndex - 1]._id}`
              );
              setVisitIndex(visitIndex - 1);
            }
            if (width < 769) {
              e.stopPropagation();
            }
            if (localStorage.getItem("token")) {
              setBookAndLike(id, bookmarkState, likeState)
                .then((res) => {
                  if (!(res.status == 200)) {
                    toast.error(
                      "Something went wrong while saving bookmark and like!"
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
          style={{
            left: width < 769 ? "0px" : "",
          }}
        >
          <img src={lessIcon} alt="" />
        </div>

        {/* Slides */}
        <div className={styles.slides}>
          {/* Number of slide. */}
          <ul className={styles.totalSlides}>
            {Object.keys(storyInfo).length != 0 &&
              storyInfo.slides.map((slide, index) => (
                <li
                  key={index}
                  style={{
                    borderColor: index <= visitIndex ? "white" : "#D9D9D980",
                  }}
                ></li>
              ))}
          </ul>

          {/* Share and close button. */}
          <div className={styles.crossShare}>
            <img
              src={crossIcon}
              alt="cross icon"
              className={styles.cross}
              onClick={() => {
                if (localStorage.getItem("slideURL")) {
                  localStorage.removeItem("slideURL");
                }

                if (localStorage.getItem("token")) {
                  navigate("/");
                  setBookAndLike(id, bookmarkState, likeState)
                    .then((res) => {
                      if (!(res.status == 200)) {
                        toast.error(
                          "Something went wrong while saving bookmark and like!"
                        );
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  navigate("/");
                }
              }}
            />
            <div onClick={toggleMute}>
              <img src={!isMuted ? soundIcon : muteIcon} alt="" />
            </div>
            <img
              src={shareIcon}
              alt="share icon"
              onClick={() => {
                window.navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => {
                    toast.success("Link copied to clipboard!");
                  });
              }}
            />
          </div>

          {/* Slide */}
          {Object.keys(storyInfo).length == 0 ? (
            <div
              className="loader"
              style={{
                position: "absolute",
                top: "48%",
                left: "45.5%",
                opacity: "0.2",
              }}
            ></div>
          ) : (
            <>
              {storyInfo.slides[visitIndex].imageURL.match(
                /(\.mp4|\.3gp|\.webm)/
              ) ? (
                <video
                  src={storyInfo.slides[visitIndex].imageURL}
                  autoPlay
                  muted={isMuted}
                  ref={videoRef}
                ></video>
              ) : (
                <img src={storyInfo.slides[visitIndex].imageURL} alt="" />
              )}

              {/* Details of slide. */}
              <div className={styles.details}>
                <h2>{storyInfo.slides[visitIndex].heading}</h2>
                <p>{storyInfo.slides[visitIndex].description}</p>
                <div className={styles.saveLike}>
                  {bookmarkState[0] != -1 &&
                  bookmarkState.includes(storyInfo.slides[visitIndex]._id) ? (
                    <img
                      src={bookmarkBlue}
                      alt=""
                      onClick={() => {
                        const newState = bookmarkState.filter(
                          (b, i) => b != storyInfo.slides[visitIndex]._id
                        );
                        setBookMarkState([...newState]);
                      }}
                      className={styles.save}
                    />
                  ) : (
                    <img
                      src={saveIcon}
                      onClick={() => {
                        setBookMarkState([
                          ...bookmarkState,
                          storyInfo.slides[visitIndex]._id,
                        ]);
                      }}
                      alt=""
                      className={styles.save}
                    />
                  )}

                  {localStorage.getItem("token") ? (
                    downloadState ? (
                      <img
                        src={downloadIcon}
                        alt="download"
                        style={{
                          width: "16px",
                        }}
                        onClick={handleDownload}
                      />
                    ) : (
                      <div className="loader"></div>
                    )
                  ) : (
                    ""
                  )}

                  <div className={styles.heart}>
                    {likeState[0] != -1 &&
                    likeState.includes(storyInfo.slides[visitIndex]._id) ? (
                      <img
                        src={redHeart}
                        onClick={() => {
                          const newState = likeState.filter(
                            (l, i) => l != storyInfo.slides[visitIndex]._id
                          );
                          setLikeState([...newState]);
                          setLike({
                            ...like,
                            [storyInfo.slides[visitIndex]._id]:
                              like[storyInfo.slides[visitIndex]._id] - 1,
                          });
                        }}
                        alt=""
                      />
                    ) : (
                      <img
                        src={whiteHeart}
                        onClick={() => {
                          if (localStorage.getItem("token")) {
                            setLikeState([
                              ...likeState,
                              storyInfo.slides[visitIndex]._id,
                            ]);
                            setLike({
                              ...like,
                              [storyInfo.slides[visitIndex]._id]:
                                like[storyInfo.slides[visitIndex]._id] + 1,
                            });
                          } else {
                            localStorage.setItem(
                              "slideURL",
                              `/view/${id}/slide/${slideId}`
                            );
                            setCurrentState({
                              login: true,
                              register: false,
                              create: false,
                              edit: false,
                            });
                            navigate("/");
                          }
                        }}
                        alt=""
                      />
                    )}
                    {like != null && (
                      <span>{like[storyInfo.slides[visitIndex]._id]}</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Black shadow */}
          <div className={styles.blackShadow}></div>
        </div>

        {/* Next slide. */}
        <div
          className={styles.control}
          onClick={(e) => {
            if (visitIndex < storyInfo.slides.length - 1) {
              navigate(
                `/view/${id}/slide/${storyInfo.slides[visitIndex + 1]._id}`
              );
              setVisitIndex(visitIndex + 1);
            } else {
              getRandomId().then((res) => {
                if (res.status == 200) {
                  navigate(`/view/${res.data._id}/slide/${res.data.slideId}`);
                } else {
                  toast.error(
                    "Something went wrong while loading next story!!!"
                  );
                }
              });
            }
            if (width < 769) {
              e.stopPropagation();
            }
            if (localStorage.getItem("token")) {
              setBookAndLike(id, bookmarkState, likeState)
                .then((res) => {
                  if (!(res.status == 200)) {
                    toast.error(
                      "Something went wrong while saving bookmark and like!"
                    );
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }}
          style={{
            right: width < 769 ? "0px" : "",
          }}
        >
          <img src={greatIcon} alt="" />
        </div>
      </div>
      <div className={styles.blackSpace}></div>
    </>
  );
}

export default ViewStory;
