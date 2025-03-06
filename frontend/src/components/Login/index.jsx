import React from "react";
import styles from "./index.module.css";
import MyModal from "../MyModal";
import { useNavigate } from "react-router-dom";
import crossIcon from "../../assets/cross.jpg";
import CommonAuthForm from "../../utils/CommonAuthForm";
import RegisterContext from "../../context/RegisterContext";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { loginUser } from "../../apis/auth";
import { useOutletContext } from "react-router-dom";

function Login({ setCurrentState }) {
  const navigate = useNavigate();
  const getData = useOutletContext(); // Get user story after login.
  const [loader, setLoader] = useState(false); // Store state of loader.
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  }); // Store state of form.
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  }); // Store state of error.

  // Handle form changes.
  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setErrors({ username: "", password: "" });
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submit.
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    loginUser(formData).then((res) => {
      if (res.status == "200") {
        localStorage.setItem("token", res.headers["x-token"]);
        localStorage.setItem("username", formData.username);
        setLoader(false);
        toast.success(res.data.msg);
        setCurrentState({
          login: false,
          register: false,
          create: false,
          edit: false,
        });
        if (localStorage.getItem("slideURL")) {
          navigate(localStorage.getItem("slideURL"));
        }
      } else if (res.status == "400") {
        toast.error(res.data.msg);
        setLoader(false);
      } else {
        toast.error(res.data.msg);
        setLoader(false);
      }
    });
  };

  // Handle closing login modal.
  const onClose = () => {
    setCurrentState({
      login: false,
      register: false,
      create: false,
      edit: false,
    });
  };
  return (
    <MyModal>
      <RegisterContext.Provider
        value={{ formData, handleInput, handleSubmit, errors, loader }}
      >
        <div className={styles.container}>
          {/* Form for login */}
          <CommonAuthForm>
            <span>Login</span>
          </CommonAuthForm>

          {/* close modal */}
          <img src={crossIcon} alt="cross icon" onClick={onClose} />
        </div>
      </RegisterContext.Provider>
    </MyModal>
  );
}

export default Login;
