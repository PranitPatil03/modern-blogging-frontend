/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageAnimation from "../common/PageAnimation";
import Loader from "../components/Loader";
import { useContext } from "react";
import { UserContext } from "../App";
import AboutUser from "../components/About";

export const profileDataStructure = {
  personal_info: {
    fullName: "",
    email: "",
    userName: "",
    bio: "",
    profile_img: "",
  },
  social_links: {
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    github: "",
    website: "",
  },
  account_info: {
    total_posts: 0,
    total_reads: 0,
  },
  _id: "",
  joinedAt: "",
};

const ProfilePage = () => {
  const { id: profileId } = useParams();

  const [profile, setProfile] = useState(profileDataStructure);
  const [loading, setLoading] = useState(true);

  const {
    userAuth: { userName },
  } = useContext(UserContext);

  let {
    personal_info: { fullName, userName: profile_userName, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt,
  } = profile;

  const fetchUserProfile = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
        userName: profileId,
      })
      .then(({ data: user }) => {
        console.log(user);
        setProfile(user);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetState();
    fetchUserProfile();
  }, [profileId]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
  };

  return (
    <>
      <PageAnimation>
        {loading ? (
          <Loader />
        ) : (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">
              <img
                src={profile_img}
                className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
              />

              <h1 className="text-2xl font-medium"> @{profile_userName}</h1>

              <p className="text-xl capitalize h-6">{fullName}</p>

              <p>
                {total_posts.toLocaleString()} Blogs -{" "}
                {total_reads.toLocaleString()} Reads
              </p>

              <div className="flex gap-4 mt-2">
                {profileId === userName ? (
                  <Link
                    to="/settings/edit-profile"
                    className="btn-light rounded-md"
                  >
                    Edit Profile
                  </Link>
                ) : (
                  " "
                )}
                </div>
                
                <AboutUser className="max-md:hidden" bio={bio} social_links={social_links} joinedAt={joinedAt} />
            </div>
          </section>
        )}
      </PageAnimation>
    </>
  );
};

export default ProfilePage;
