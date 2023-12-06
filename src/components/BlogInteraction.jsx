/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

const BlogInteraction = () => {
  let {
    blog: {
      blog_id,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { userName: author_userName },
      },
    },
    setBlog,
  } = useContext(BlogContext);

  const {
    userAuth: { userName },
  } = useContext(UserContext);

  return (
    <>
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
            <i className="fi fi-rr-heart"></i>
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
