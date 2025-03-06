import React, { useState } from "react";
import styles from "./index.module.css";
import eyeIcon from "../assets/eye.png";
import { useContext } from "react";
import RegisterContext from "../context/RegisterContext";
import toolTip from "../assets/tool-tip.png";

function CommonAuthForm({ children }) {
  const [togglePassword, setTogglePassword] = useState(true); // Toggle password.

  const { formData, handleInput, handleSubmit, errors, loader } =
    useContext(RegisterContext); // Getting data from context.

  return (
    <div className={styles.commonFormContainer}>
      {/* Heading */}
      <h3>{children}</h3>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Username */}
        <div>
          <label htmlFor="">Username</label>

          <div className={styles.inputTool}>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInput}
              placeholder="Enter username"
              required
              style={{
                width: children.props.children == "Register" ? "92%" : "",
              }}
            />
            {children.props.children == "Register" && (
              <div className="tooltip" id="signup-tool-tip">
                <img src={toolTip} alt="tooltip" />
                <span className="tooltiptext">
                  Username should start with alphabet and can only contain
                  alphabets, numbers and underscore. Minimum length should be 6
                  characters.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {errors.username && children.props.children == "Register" && (
          <span
            style={{
              color: "red",
              width: "80%",
              textAlign: "right",
              fontSize: "0.8rem",
              marginRight: "50px",
            }}
          >
            {errors.username}
          </span>
        )}

        {/* Password */}
        <div style={{ marginTop: "25px" }}>
          <label htmlFor="">Password</label>
          <div className={styles.inputTool}>
            <input
              required
              type={togglePassword ? "password" : "text"}
              value={formData.password}
              onChange={handleInput}
              name="password"
              placeholder="Enter password"
              id={styles.password}
              style={{
                width: children.props.children == "Register" ? "92%" : "",
              }}
            />
            <img
              src={eyeIcon}
              id={styles.eyeIcon}
              alt="eye icon"
              onClick={() => setTogglePassword(!togglePassword)}
              style={{
                right: children.props.children == "Login" ? "7px" : "",
              }}
            />

            {children.props.children == "Register" && (
              <div className="tooltip" id="signup-tool-tip">
                <img src={toolTip} alt="tooltip" />
                <span className="tooltiptext">
                  Password length should be atleast 8 characters and must
                  contain atleast one uppercase letter,one lowercase letter,one
                  number, and one special character.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {errors.password && children.props.children == "Register" && (
          <span
            style={{
              color: "red",
              width: "80%",
              textAlign: "right",
              fontSize: "0.8rem",
              marginRight: "50px",
            }}
          >
            {errors.password}
          </span>
        )}

        {/* Login and register. */}
        <button type="submit" disabled={loader}>
          {!loader ? children : <div id={styles.loader}></div>}
        </button>
      </form>
    </div>
  );
}

export default CommonAuthForm;
