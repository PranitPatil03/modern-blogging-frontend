/* eslint-disable react-refresh/only-export-components */
import { useContext } from "react";
import { BlogContext } from "../pages/BlogPage";
import CommentField from "./CommentField";
import axios from "axios";
import PageAnimation from "../common/PageAnimation";
import Nodata from "./Nodata";
import CommentCard from "./CommentCard";

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFun,
  comment_array = null,
}) => {
  let res;

  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0;
      });

      setParentCommentCountFun((preVal) => preVal + data.length);

      if (comment_array === null) {
        res = { results: data };
      } else {
        res = { results: [...comment_array, ...data] };
      }
    });

  return res;
};

const CommentsContainer = () => {
  const {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentsArr },
      activity: { total_parent_comments },
    },
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoaded,
    setTotalParentCommentsLoaded,
    setBlog,
  } = useContext(BlogContext);

  const handleLoadMore = async () => {
    const newCommentArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });
    setBlog({ ...blog, comments: newCommentArr });
  };

  return (
    <>
      <div
        className={
          "max-sm:w-full fixed " +
          (commentsWrapper
            ? "top-0 sm:right-0"
            : "top-[100%] sm:right-[-100%]") +
          " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
        }
      >
        <div className="relative">
          <h1 className="text-xl font-medium">Comments</h1>
          <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
            {title}
          </p>

          <button
            className="absolute top-0 right-0 flex justify-center items-center bg-grey rounded-full w-12 h-12"
            onClick={() => setCommentsWrapper((currVal) => !currVal)}
          >
            <i className="fi fi-br-cross text-2xl mt-1"></i>
          </button>
        </div>

        <hr className="border-grey my-8 w-[120%] -ml-10" />

        <CommentField action="Comment" />

        {commentsArr && commentsArr.length ? (
          commentsArr.map((comment, i) => {
            return (
              <PageAnimation key={i}>
                <CommentCard
                  index={i}
                  leftVal={comment.childrenLevel * 4}
                  commentData={comment}
                />
              </PageAnimation>
            );
          })
        ) : (
          <Nodata message="No Comments" />
        )}

        {total_parent_comments > totalParentCommentsLoaded ? (
          <button className="btn-light mt-5 px-10" onClick={handleLoadMore}>
            load More
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default CommentsContainer;
