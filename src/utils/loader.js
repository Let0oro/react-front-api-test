import axios from "axios";
import { defer } from "react-router-dom";

export const loader = async (url) => {
  const { data } = await axios.get(url);

  return defer({ data });
};

export const loaderHardvar = async (url) => {
  try {
    const { objectnumber, title, dated } = await axios.get("https://api.harvardartmuseums.org/object", {
      query: {
        apikey: "31536e72-a131-486f-a9a3-77ad4659aa0a",
        title: "dog",
        fields: "objectnumber,title,dated",
        size: 100,
      },
    });

    console.log(objectnumber)

    return defer({ objectnumber, title, dated });
  } catch (error) {
    console.error({message: error.message});
    return error.message
  }
};
