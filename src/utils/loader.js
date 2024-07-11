import axios from "axios";
import { defer } from "react-router-dom";

export const loader = async (url) => {
  const { data } = await axios.get(url);

  return defer({ data });
};
