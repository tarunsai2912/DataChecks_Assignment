import axios from "axios";

// Register user
const registerUser = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/auth/register`,
      { ...formData }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Login user
const loginUser = async (formData) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_APP_BACKEND}/auth/login`,
      { ...formData }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

export { registerUser, loginUser };
