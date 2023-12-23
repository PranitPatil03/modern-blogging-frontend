/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useContext, useEffect } from "react";
import { UserContext } from "../App";

const EditProfile = () => {
  const {
    userAuth: { accessToken, userName },
  } = useContext(UserContext);

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        userName: userName,
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console(err);
      });
  }, [accessToken]);

  return <h1>Edit User Profile </h1>;
};

export default EditProfile;
