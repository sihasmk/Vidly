import Axios from "axios";
import logger from "./logService";
import { toast } from "react-toastify";

Axios.interceptors.response.use(null, (error) => {
  const expectedErr =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedErr) {
    logger.log(error);
    toast.error("An unexpected error has occured.");
  }

  return Promise.reject(error);
});

function setJwt(jwt) {
  Axios.defaults.headers.common["x-auth-token"] = jwt;
}

const exportedObject = {
  get: Axios.get,
  post: Axios.post,
  put: Axios.put,
  delete: Axios.delete,
  setJwt,
};

export default exportedObject;
