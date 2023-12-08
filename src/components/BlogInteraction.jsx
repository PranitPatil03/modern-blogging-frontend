/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { userName: author_userName },
      },
    },
    setBlog,
    isLikeByUser,
    setIsLikeByUser,
  } = useContext(BlogContext);

  const {
    userAuth: { userName, accessToken },
  } = useContext(UserContext);

  useEffect(() => {
    if (accessToken) {
      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/is-liked-by-user",
          { _id },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          console.log("data blog", result);
          setIsLikeByUser(Boolean(result))
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleLike = () => {
    if (accessToken) {
      setIsLikeByUser((currVal) => !currVal);

      !isLikeByUser ? total_likes++ : total_likes--;

      setBlog({ ...blog, activity: { ...activity, total_likes } });

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
          { _id, isLikeByUser },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .then(({ data }) => {
          console.log("data blog", data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast.error("Login to Like this Blog");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikeByUser ? "bg-red/20 text-red " : " bg-grey/80")
            }
            onClick={handleLike}
          >
            <i
              className={"fi fi-" + (isLikeByUser ? "sr" : "rr") + "-heart"}
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-3 items-center">
          {userName === author_userName ? (
            <Link to={`/editor/${blog_id}`} className="underline text-purple">
              Edit
            </Link>
          ) : (
            " "
          )}

          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
