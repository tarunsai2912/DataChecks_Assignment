import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { getBookmark } from "../../apis/data";
import Slide from "../../utils/Slide";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import bookmarkIcon from "../../assets/bookmark.jpg";
import profileImg from "../../assets/profileImg.png";
import hamburger from "../../assets/hamburger.png";
import CreateStory from "../../components/CreateStory";

function Bookmark() {
  const [width, setWidth] = useState(window.innerWidth);

  const [slides, setSlides] = useState(null);
  const navigate = useNavigate();
  const [token, setToken] = useState(""); // Store the token.
  const [menu, setMenu] = useState(); // Store the state of hamburger.
  const [toggleMenu, setToggleMenu] = useState(false);

  const [currentState, setCurrentState] = useState({
    login: false,
    register: false,
    create: false,
  });

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Checks for token.
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setMenu(false);
  }, [currentState]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getBookmark().then((res) => {
        if (res.status == 200) {
          setSlides([...res.data]);
        } else {
          toast.error("Something went wrong while loading bookmarks!");
        }
      });
    } else {
      navigate("/");
    }
  }, []);
  return (
    <div className={styles.container}>
      {/* Navbar of homepage. */}
      <div className={styles.navbar}>
        {width < 769 && (
          <img
            src={hamburger}
            alt="hamburger"
            className={styles.authHamburger}
            onClick={() => {
              setToggleMenu(!toggleMenu);
            }}
          />
        )}
        <div
          className={styles.buttons}
          style={{
            display: width < 789 ? (toggleMenu ? "" : "none") : "",
          }}
        >
          {width < 769 && (
            <span
              className={styles.crossIcon}
              onClick={() => {
                setToggleMenu(false);
              }}
            >
              x
            </span>
          )}

          {width < 769 && token && (
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setToken("");
                toast.success("Logged out successfully!");
              }}
            >
              Logout
            </button>
          )}
          {!token ? (
            <div
              onClick={() => {
                setCurrentState({
                  login: false,
                  register: true,
                  create: false,
                });
                setToggleMenu(false);
              }}
            >
              Register Now
            </div>
          ) : (
            <>
              <div
                style={{ fontSize: "11px" }}
                onClick={() => {
                  navigate("/bookmark");
                }}
              >
                <img
                  src={bookmarkIcon}
                  alt=""
                  style={{
                    width: "13px",
                    objectFit: "contain",
                    marginRight: "5px",
                  }}
                />
                Bookmarks
              </div>
            </>
          )}
          {!token ? (
            <div
              className={styles.green}
              onClick={() => {
                setToggleMenu(false);
                setCurrentState({
                  login: true,
                  register: false,
                  create: false,
                });
              }}
            >
              Sign In
            </div>
          ) : (
            <div
              onClick={() => {
                setToggleMenu(false);
                setCurrentState({
                  login: false,
                  register: false,
                  create: true,
                });
              }}
            >
              Add story
            </div>
          )}

          {token && (
            <div className={styles.profileImg}>
              <img src={profileImg} alt="" />
              {width < 769 && (
                <span style={{ color: "black" }}>
                  {localStorage.getItem("username")}
                </span>
              )}
            </div>
          )}

          {token && (
            <>
              <img
                className={styles.hamburger}
                src={hamburger}
                alt="menu"
                onClick={() => setMenu(!menu)}
              />
              {menu && (
                <div className={styles.menu}>
                  {localStorage.getItem("username")}
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      setToken("");
                      toast.success("Logged out successfully!");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Go back */}
      <div
        className={styles.goback}
        onClick={() => {
          navigate("/");
        }}
      >
        Go back
      </div>

      {width < 769 && (
        <h3
          style={{
            width: "100%",
            textAlign: "center",
            padding: "17px 0px",
          }}
        >
          Your Bookmarks
        </h3>
      )}
      {/* Stories section */}
      <div className={styles.allStories}>
        {slides != null ? (
          slides.length == 0 ? (
            <span
              style={{
                width: "100%",
                textAlign: "center",
              }}
            >
              Your bookmark is empty!
            </span>
          ) : (
            slides.map((slide, index) => (
              <Slide slide={slide.slide} key={index} storyId={slide.storyId} />
            ))
          )
        ) : (
          <div className="loader"></div>
        )}
      </div>

      {currentState.create && <CreateStory setCurrentState={setCurrentState} />}

      <Toaster />
    </div>
  );
}

export default Bookmark;
