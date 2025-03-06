import axios from "axios";

const setBookAndLike = async (storyId, bookmark, like) => {
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_APP_BACKEND}/data/create/${storyId}`,
      {
        bookmark,
        like,
      },
      {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const getBookandLike = async (storyId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/data/fetch/${storyId}`,
      {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const getLike = async (storyId) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_BACKEND}/data/like/${storyId}`
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

const getBookmark = async () => {
  try {
    const response = await axios.get(
      `
      ${import.meta.env.VITE_APP_BACKEND}/data/bookmark
      `,
      {
        headers: {
          "x-token": localStorage.getItem("token"),
        },
      }
    );

    return response;
  } catch (error) {
    return error.response;
  }
};

export { setBookAndLike, getBookandLike, getLike, getBookmark };
