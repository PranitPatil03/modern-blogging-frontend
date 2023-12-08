import { comment } from "postcss";
import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";
import { BlogContext } from "../pages/BlogPage";

const CommandField = ({ action }) => {
  const [comment, setComment] = useState();

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const {
    blog: {
      _id,
      author: { _id: blog_author },
    },
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
