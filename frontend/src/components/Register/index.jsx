import React from "react";
import styles from "./index.module.css";
import crossIcon from "../../assets/cross.jpg";
import CommonAuthForm from "../../utils/CommonAuthForm";
import MyModal from "../MyModal";
import { useNavigate } from "react-router-dom";
import RegisterContext from "../../context/RegisterContext";
import { useState } from "react";
import toast from "react-hot-toast";
import { registerUser } from "../../apis/auth";

function Register({ setCurrentState }) {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  // Handle close functionality of modal.
  const onClose = () => {
    setCurrentState({
      login: false,
      register: false,
      create: false,
    });
  };

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

    let err = 0;
    const { username, password } = formData;

    if (!username.match(/^[A-Za-z][A-Za-z0-9_]{5,29}$/)) {
      err++;
      setErrors((prev) => ({ ...prev, username: "Invalid username!" }));
    } else {
      setErrors((prev) => ({ ...prev, username: "" }));
    }

    if (
      !password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
    ) {
      err++;
      setErrors((prev) => ({ ...prev, password: "Invalid password!" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    if (err == 0) {
      setLoader(true);
      registerUser(formData).then((res) => {
        if (res.status == 200) {
          toast.success(res.data.msg + " please login to proceed.");
          setFormData({
            username: "",
            password: "",
          });
          setLoader(false);
          setTimeout(() => {
            onClose();
          }, 1000);
        } else if (res.status == 400) {
          toast.error(res.data.msg);
          setLoader(false);
        } else {
          toast.error(res.data.msg);
          setLoader(false);
        }
      });
    }
  };

  return (
    <MyModal>
      <RegisterContext.Provider
        value={{ formData, handleInput, handleSubmit, errors, loader }}
      >
        <div className={styles.container}>
          {/* Registration form. */}
          <CommonAuthForm>
            <span>Register</span>
          </CommonAuthForm>

          {/* close modal */}
          <img src={crossIcon} alt="cross icon" onClick={onClose} />
        </div>
      </RegisterContext.Provider>
    </MyModal>
  );
}

export default Register;
