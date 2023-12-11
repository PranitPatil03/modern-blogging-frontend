import { useContext, useState } from "react";
import { getDay } from "../common/Date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentField from "./CommentField";
import { BlogContext } from "../pages/BlogPage";
import axios from "axios";

/* eslint-disable react/prop-types */
const CommentCard = ({ index, leftVal, commentData }) => {
  const [isReplying, setReplying] = useState(false);

  let {
    commented_by: {
      personal_info: { fullName, profile_img, userName },
    },
    _id,
    commentedAt,
    comment,
    children,
  } = commentData;

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      comments,
      comments: { results: commentsArr },
    },
    setBlog,
  } = useContext(BlogContext);

  const removeCommentsCard = (startingPoint) => {
    if (commentsArr[startingPoint]) {
      while (
        commentsArr[startingPoint].childrenLevel > commentData.childrenLevel
      ) {
        commentsArr.splice(startingPoint, 1);

        if (!commentsArr[startingPoint]) {
          break;
        }
      }
    }

    setBlog({ ...blog, comments: { results: commentsArr } });
  };

  const handleHideReply = () => {
    commentData.isReplyLoaded = false;
    removeCommentsCard(index + 1);
  };

  const handleLoadReplies = ({ skip = 0 }) => {
    if (children.length) {
      handleHideReply();

      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", {
          _id,
          skip,
        })
        .then(({ data: { replies } }) => {
          console.log("replies", replies);
          commentData.isReplyLoaded = true;

          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel = commentData.childrenLevel + 1;
            commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
          }

          setBlog({
            ...blog,
            comments: { ...comments, results: { commentsArr } },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleReplyClick = () => {
    if (!accessToken) {
      return toast.error("Login first to give reply");
    }
    setReplying((preVal) => !preVal);
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullName} @{userName}
          </p>
          <p className="min-w-fit">{getDay(commentedAt)}</p>
        </div>
        <p className="font-gelasio text-xl ml-3">{comment}</p>

        <div className="flex gap-5 items-center mt-5">
          {commentData.isReplyLoaded ? (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-full flex items-center gap-2 "
              onClick={handleHideReply}
            >
              <i className="fi fi-rs-comment-dots"></i>
              Hide Reply
            </button>
          ) : (
            <button
              className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-full flex items-center gap-2"
              onClick={handleLoadReplies}
            >
              <i className="fi fi-rs-comment-dots"></i>
              {children.length} Reply
            </button>
          )}

          <button className="underline" onClick={handleReplyClick}>
            Reply
          </button>
        </div>

        {isReplying ? (
          <div className="mt-8">
            <CommentField
              action="reply"
              index={index}
              replyingTo={_id}
              setReplying={setReplying}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CommentCard;
