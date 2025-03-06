import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import MyModal from "../MyModal";
import { useNavigate, useOutletContext } from "react-router-dom";
import crossIcon from "../../assets/cross.jpg";
import toast from "react-hot-toast";
import { createStory } from "../../apis/story";
import { useRef } from "react";

function CreateStory({ setCurrentState }) {
  const [width, setWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const [error, setError] = useState(""); // Store error
  const [slides, setSlides] = useState([
    {
      heading: "",
      description: "",
      imageURL: "",
      category: "",
    },
    {
      heading: "",
      description: "",
      imageURL: "",
      category: "",
    },
    {
      heading: "",
      description: "",
      imageURL: "",
      category: "",
    },
  ]); // Store slides state.
  const [selSlide, setSelSlide] = useState(0); // Keep track of selected slide.
  const [loader, setLoader] = useState(false); // Store state of loader.
  const [videoError, setVideoError] = useState([
    {
      errorCode: -1,
    },
    {
      errorCode: -1,
    },
    {
      errorCode: -1,
    },
  ]);
  const [urlState, setUrlState] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Checks for token.
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  // Handle add slide functionality.
  const handleAddSlide = () => {
    if (slides.length < 6) {
      slides.push({
        heading: "",
        description: "",
        imageURL: "",
        category: slides[0].category,
      });
      setSlides([...slides]);
      videoError.push({
        errorCode: -1,
      });
      setVideoError([...videoError]);
    }
  };

  // Handle close slide functionality.
  const handleCloseSlide = (e, index) => {
    e.stopPropagation();
    const newSlides = slides.filter((e, i) => i != index);
    if (selSlide == index) {
      setSelSlide(index - 1);
    }
    if (selSlide == slides.length - 1) {
      setSelSlide(selSlide - 1);
    }
    setSlides(newSlides);
    const newVideoError = videoError.filter((e, i) => i != index);
    setVideoError(newVideoError);
  };

  // Converts number array to comman separated string.
  function convertArrayToString(a) {
    let b = "";

    if (a.length == 1) {
      return a[0] + ".";
    }
    a.forEach((e, i) => {
      if (i == a.length - 1) {
        b += "and " + e + ".";
      } else {
        b += e + ", ";
      }
    });
    return b;
  }

  // Validate image url.
  function validateImageUrl(url, callback) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;

      img.onload = function () {
        resolve(true);
      };

      img.onerror = function () {
        resolve(false);
      };
    });
  }

  // Validate video duration.
  function validateVideoUrl(url) {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");

      video.src = url;
      video.preload = "metadata";

      video.onloadedmetadata = function () {
        const durationInSeconds = video.duration;
        if (durationInSeconds <= 15) {
          resolve({ valid: true, msg: "" });
        } else {
          resolve({
            valid: false,
            msg: "Video duration should be less than 15sec",
          });
        }
      };
      video.onerror = function () {
        resolve({ valid: false, msg: "Invalid URL" });
      };
    });
  }

  let interval = useRef();
  // Sync react state with form state.
  const handleInput = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name == "category") {
      slides.map((slide, index) => (slide.category = value));
      setSlides([...slides]);
    } else {
      slides[selSlide][name] = value;
      setSlides([...slides]);
    }
    if (name == "imageURL") {
      clearTimeout(interval.current);
      interval.current = setTimeout(async () => {
        setUrlState(true);
        const image = await validateImageUrl(value);
        if (!image) {
          const video = await validateVideoUrl(value);
          if (video.valid) {
            videoError[selSlide].errorCode = -1;
          } else {
            videoError[selSlide].errorCode = video.msg;
          }
        } else {
          videoError[selSlide].errorCode = -1;
          setVideoError(videoError);
        }
        setUrlState(false);
      }, 400);
    }
  };

  // Handle post story functionality.
  const handlePost = (e) => {
    let err = 0;
    let slideNo = [];

    // Checks whether any field in slides are empty or not.
    slides.map((slide, index) => {
      if (
        slide.heading == "" ||
        slide.description == "" ||
        slide.imageURL == "" ||
        slide.category == ""
      ) {
        slideNo.push(index + 1);
        err++;
      }
    });

    let urlError = 0;
    videoError.forEach((ele) => {
      if (ele.errorCode != -1) {
        urlError++;
      }
    });

    if (err == 0 && urlError == 0) {
      setLoader(true);
      setVideoError([]);
      setError("");
      createStory(slides).then((res) => {
        if (res.status == "200") {
          toast.success(res.data.msg);
          setLoader(false);
          setCurrentState({
            login: false,
            register: false,
            create: false,
          });
        } else {
          toast.error(res.data.msg);
        }
      });
    } else {
      let msg = "";
      if (slideNo.length != 0) {
        msg = `Please fill all details in slide number ${convertArrayToString(
          slideNo
        )}`;
      } else {
        videoError.forEach((ele, index) => {
          if (ele.errorCode != -1) {
            msg += ele.errorCode + " in slide " + (index + 1) + ", ";
          }
        });
      }

      setError(msg);
    }
  };

  return (
    <MyModal>
      <div className={styles.container}>
        <span className={styles.heading}>Add upto 6 slides</span>
        {width < 769 && (
          <h3 className={styles.respHeading}>Add story to feed</h3>
        )}
        {/* All slides */}
        <div className={styles.slides}>
          <ul>
            {slides.map((slide, index) => (
              <li
                className={styles.slide}
                key={index}
                style={{
                  border: selSlide == index ? "1.5px solid #73ABFF" : "",
                }}
                onClick={() => setSelSlide(index)}
              >
                <span>Slide {index + 1}</span>
                {index > 2 && (
                  <span
                    className={styles.closeSlide}
                    onClick={(e) => handleCloseSlide(e, index)}
                  >
                    x
                  </span>
                )}
              </li>
            ))}
          </ul>
          {slides.length < 6 && (
            <div className={styles.addSlide} onClick={handleAddSlide}>
              Add+
            </div>
          )}
        </div>

        {/* Slide content */}
        <div className={styles.slideData}>
          <form>
            <div>
              <label>Heading:</label>
              <input
                type="text"
                placeholder="Your heading"
                name="heading"
                onChange={handleInput}
                value={slides[selSlide].heading}
                autoComplete="off"
              />
            </div>
            <div>
              <label>Description:</label>
              <textarea
                name="description"
                placeholder="Story Description"
                onChange={handleInput}
                value={slides[selSlide].description}
                autoComplete="off"
              ></textarea>
            </div>
            <div className={styles.imageURL}>
              <label>Image/video:</label>
              <input
                type="text"
                placeholder="Add Image/video url"
                name="imageURL"
                onChange={handleInput}
                value={slides[selSlide].imageURL}
                autoComplete="off"
                disabled={urlState}
              />
              {urlState && (
                <div id={styles.loaderDiv}>
                  <div id={styles.loader}></div>
                </div>
              )}
            </div>

            <div className={styles.category}>
              <label>Category:</label>
              <div>
                <select
                  defaultValue={"default"}
                  name="category"
                  onChange={handleInput}
                >
                  <option value="default" disabled>
                    Select Category
                  </option>
                  <option value="medical">Medical</option>
                  <option value="fruits">Fruits</option>
                  <option value="world">World</option>
                  <option value="india">India</option>
                  <option value="education">Education</option>
                </select>
                <span>This field will be common for all slides</span>
              </div>
            </div>
          </form>
        </div>

        {/* Previous, next and post. */}
        <div className={styles.buttons}>
          <div className={styles.prevNext}>
            <button
              style={{ backgroundColor: "#7EFF73" }}
              onClick={() => {
                if (selSlide - 1 >= 0) {
                  setSelSlide(selSlide - 1);
                }
              }}
            >
              Previous
            </button>
            <button
              style={{ backgroundColor: "#73ABFF" }}
              onClick={() => {
                if (slides.length > selSlide + 1) {
                  setSelSlide(selSlide + 1);
                }
              }}
            >
              Next
            </button>
          </div>
          <button
            style={{ backgroundColor: "#FF7373" }}
            onClick={handlePost}
            disabled={loader || urlState}
          >
            {loader ? <div className="loader"></div> : "Post"}
          </button>
        </div>

        {/* Close create story modal. */}
        <img
          src={crossIcon}
          alt="cross"
          className={styles.cross}
          onClick={() =>
            setCurrentState({
              login: false,
              register: false,
              create: false,
            })
          }
        />

        {/* Error */}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </MyModal>
  );
}

export default CreateStory;
