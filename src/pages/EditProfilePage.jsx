/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { profileDataStructure } from "./ProfilePage";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import { Toaster } from "react-hot-toast";

const EditProfile = () => {
  const {
    userAuth: { accessToken, userName },
  } = useContext(UserContext);

  const [profile, setProfileData] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);

  let {
    personal_info: {
      bio,
      email,
      fullName,
      profile_img,
      userName: profile_userName,
    },
    social_links,
  } = profile;

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        userName: userName,
      })
      .then(({ data }) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console(err);
      });
  }, [accessToken]);

  return (
    <PageAnimation>
      {loading ? (
        <Loader />
      ) : (
        <form>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-center py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                htmlFor="uploadImg"
                id="profileImageLabel"
              >
                <div className="w-full h-full absolute left-0 top-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Profile Image
                </div>
                <img src={profile_img} />
              </label>
              <input
                type="file"
                id="uploadImg"
                accept=".jpeg .png .jpg"
                hidden
              />

              <button className="btn-light mt-5 max-lg:center lg:w-full px-10">
                Upload
              </button>
            </div>
          </div>
        </form>
      )}
    </PageAnimation>
  );
};

export default EditProfile;
