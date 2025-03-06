import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import allIcon from "../../assets/all.png";
import medicalIcon from "../../assets/medical.png";
import fruitsIcon from "../../assets/fruits.png";
import worldIcon from "../../assets/world.png";
import indiaIcon from "../../assets/india.png";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import bookmarkIcon from "../../assets/bookmark.jpg";
import profileImg from "../../assets/profileImg.png";
import hamburger from "../../assets/hamburger.png";
import Stories from "../../components/Stories";
import educationIcon from "../../assets/education.jpg";
import { getAllStories, getStoriesByCategory } from "../../apis/story";
import Login from "../../components/Login";
import Register from "../../components/Register";
import CreateStory from "../../components/CreateStory";

function Homepage() {
  const [width, setWidth] = useState(window.innerWidth);

  const navigate = useNavigate();
  const location = useLocation(); // Gets the current path.

  const [token, setToken] = useState(""); // Store the token.
  const [menu, setMenu] = useState(); // Store the state of hamburger.
  const [yourStories, setYourStories] = useState(null); // Store your stories.
  const [seeMore, setSeeMore] = useState(""); // Store the state of see more button.
  const categories = [
    {
      title: "All",
      image: allIcon,
    },
    {
      title: "Medical",
      image: medicalIcon,
    },
    {
      title: "Fruits",
      image: fruitsIcon,
    },
    {
      title: "World",
      image: worldIcon,
    },
    {
      title: "India",
      image: indiaIcon,
    },
    {
      title: "Education",
      image: educationIcon,
    },
  ]; // all categories.
  const [stories, setStories] = useState({}); // Store stories of all categories.
  const [selCat, setSelCat] = useState(["all"]); // Store state of selected category.

  const [toggleMenu, setToggleMenu] = useState(false);
  const [toggleYourStory, setToggleYourStory] = useState(false);

  const [filterLoader, setFilterLoader] = useState(false);
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

  // Gets the data on category change.
  useEffect(() => {
    if (!currentState.login && !currentState.register && !currentState.create) {
      getData(); // Gets your stories.
    }
  }, [selCat, currentState]);

  // Gets your story and all other stories created by other user.
  function getData() {
    if (localStorage.getItem("token")) {
      getAllStories()
        .then((res) => {
          setYourStories([...res.data]);
        })
        .catch((err) => {
          toast.error("Something went wrong while loading your stories!");
        });
    }
    setFilterLoader(true);
    getStoriesByCategory(selCat)
      .then((res) => {
        if (res.status == 200) {
          setFilterLoader(false);
          setStories(res.data);
        }
      })
      .catch((err) => {
        toast.error("Something went wrong while loading category stories!");
      });
  }

  // Handle category selection part.
  const handleSelCat = (category) => {
    setSeeMore("");
    setFilterLoader(true);
    if (category == "all") {
      setSelCat(["all"]);
    } else {
      if (selCat.includes(category)) {
        let temp = selCat.filter((cat, index) => cat != category);
        if (temp.length == 0) {
          setSelCat(["all"]);
        } else {
          setSelCat([...temp]);
        }
      } else {
        let temp = selCat.filter((cat, index) => cat != "all");
        setSelCat([...temp, category]);
      }
    }
  };

  return (
    <div className={styles.homepage}>
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
                setYourStories([]);
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

          {width < 769 && token && (
            <button
              onClick={() => {
                setToggleYourStory(!toggleYourStory);
                setToggleMenu(false);
              }}
            >
              Your Profile
            </button>
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
                      setYourStories([]);
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

      {/* Stories section. */}
      {!toggleYourStory || width > 769 ? (
        <div className={styles.stories}>
          {/* All categories. */}
          <ul className={styles.categories}>
            {categories.map((category, index) => (
              <li
                key={index}
                onClick={() => handleSelCat(category.title.toLocaleLowerCase())}
                className={
                  selCat.includes(category.title.toLocaleLowerCase())
                    ? styles.selCategory
                    : ""
                }
              >
                <img src={category.image} alt="" />
                <span>{category.title}</span>
              </li>
            ))}
          </ul>

          {/* Your story section. */}

          {localStorage.getItem("token") &&
            width > 768 &&
            (yourStories == null ? (
              <div
                className="loader"
                style={{
                  marginTop: "20px",
                }}
              ></div>
            ) : (
              yourStories.length != 0 &&
              (seeMore == "your" || seeMore == "") && (
                <Stories
                  stories={yourStories}
                  seeMore={seeMore}
                  section={"your"}
                  setSeeMore={setSeeMore}
                  userId={yourStories[0].userId}
                >
                  <span>Your Stories</span>
                </Stories>
              )
            ))}

          {/* Other stories section. */}
          {filterLoader ? (
            <div
              className="loader"
              style={{
                marginTop: "10px",
              }}
            ></div>
          ) : (
            Object.keys(stories).map((cat, i) => {
              if (seeMore == cat || seeMore == "") {
                return (
                  <Stories
                    seeMore={seeMore}
                    setSeeMore={setSeeMore}
                    key={i}
                    section={cat}
                    stories={stories[cat]}
                    userId={
                      yourStories != null
                        ? yourStories.length != 0
                          ? yourStories[0].userId
                          : ""
                        : ""
                    }
                  >
                    <span>Top Stories About {cat}</span>
                  </Stories>
                );
              }
            })
          )}
        </div>
      ) : (
        yourStories.length != 0 &&
        (seeMore == "your" || seeMore == "") && (
          <>
            <button
              onClick={() => {
                setToggleYourStory(false);
                setSeeMore("");
              }}
              className={styles.goback}
            >
              Go back
            </button>
            <Stories
              stories={yourStories}
              seeMore={seeMore}
              section={"your"}
              setSeeMore={setSeeMore}
              userId={yourStories[0].userId}
            >
              <span>Your Stories</span>
            </Stories>
          </>
        )
      )}

      <Toaster />
      {/* Login, register, create story, view story */}
      <Outlet context={{ getData, setCurrentState }} />

      {currentState.login && <Login setCurrentState={setCurrentState} />}
      {currentState.register && <Register setCurrentState={setCurrentState} />}
      {currentState.create && <CreateStory setCurrentState={setCurrentState} />}
    </div>
  );
}

export default Homepage;
