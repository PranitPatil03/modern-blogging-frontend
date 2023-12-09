/* eslint-disable no-unused-vars */
import { comment } from "postcss";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";
import { BlogContext } from "../pages/BlogPage";

const CommandField = ({ action }) => {
  const [comment, setComment] = useState();

  const {
    userAuth: { accessToken, userName, fullName, profile_img },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const handleComment = () => {
    if (!accessToken) {
      return toast.error("Login first to add comment");
    }

    if (!comment.length) {
      return toast.error("Write something to add the comment");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        { _id, blog_author, comment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(({ data }) => {
        console.log("data blog", data);

        setComment("");

        data.commented_by = {
          personal_info: {
            userName,
            fullName,
            profile_img,
          },
        };

        let newCommentArr;

        data.childLevel = 0;

        newCommentArr = [data, ...commentsArr];

        let parentCommentIncremental = 1;

        setBlog({
          ...blog,
          comments: {
            ...comments,
            results: newCommentArr,
            activity: {
              ...activity,
              total_comments: total_comments + 1,
              total_parent_comments:
                total_parent_comments + parentCommentIncremental,
            },
          },
        });

        setTotalParentCommentsLoaded(
          (preVal) => preVal + parentCommentIncremental
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommandField;
