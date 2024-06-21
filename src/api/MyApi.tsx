import axios from "axios";
export default axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // server url
  // baseURL: `http://localhost:5010`, // server url
});
