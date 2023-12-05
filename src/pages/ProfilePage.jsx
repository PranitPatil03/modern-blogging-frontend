/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageAnimation from "../common/PageAnimation";
import Loader from "../components/Loader";
import { useContext } from "react";
import { UserContext } from "../App";
import AboutUser from "../components/About";
import FilterPaginationData from "../common/FilterPaginationData";
import InPageNavigation from "../components/InpageNavigation";
import BlogPostCard from "../components/BlogPostCard";
import Nodata from "../components/Nodata";
import LoadMoreDataBtn from "../components/LoadMore";
import MinimalBlogPost from "../components/NobannerBlogPost";
import PageNotFound from "./Page404";

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

  const [blogs, setBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState("");
  const [profile, setProfile] = useState(profileDataStructure);

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
        if (user != null) {
          setProfile(user);
        }
        setProfileLoaded(profileId);
        getBlogs({ user_id: user._id });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getBlogs = ({ page = 1, user_id }) => {
    user_id = user_id === undefined ? blogs.user_id : user_id;
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        page,
        author: user_id,
      })
      .then(async ({ data }) => {
        const formattedData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { author: user_id },
        });

        formattedData.user_id = user_id;
        console.log(formattedData);
        setBlogs(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (profileId != profileLoaded) {
      setBlogs(null);
    }

    if (blogs == null) {
      resetState();
      fetchUserProfile();
    }
  }, [profileId, blogs]);

  const resetState = () => {
    setProfile(profileDataStructure);
    setLoading(true);
    setProfileLoaded("");
  };

  return (
    <>
      <PageAnimation>
        {loading ? (
          <Loader />
        ) : profile_userName.length ? (
          <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
            <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10">
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

              <AboutUser
                className="max-md:hidden"
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </div>

            <div className="max-md:mt-12 w-full">
              <InPageNavigation
                defaultHidden={["About"]}
                routes={["Blogs Published", "About"]}
              >
                <>
                  {blogs === null ? (
                    <Loader />
                  ) : blogs.results.length ? (
                    blogs.results.map((blog, i) => {
                      return (
                        <PageAnimation
                          key={i}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        >
                          <BlogPostCard
                            content={blog}
                            author={blog.author.personal_info}
                          />
                        </PageAnimation>
                      );
                    })
                  ) : (
                    <Nodata message="No Blogs Published yet" />
                  )}

                  <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} />
                </>

                <AboutUser
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                />
              </InPageNavigation>
            </div>
          </section>
        ) : (
          <PageNotFound />
        )}
      </PageAnimation>
    </>
  );
};

export default ProfilePage;
