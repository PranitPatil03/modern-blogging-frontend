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
      personal_info: { fullName, profile_img, userName: commented_by_username },
    },
    _id,
    commentedAt,
    comment,
    children,
  } = commentData;

  const {
    userAuth: { accessToken, userName },
  } = useContext(UserContext);

  const {
    blog,
    blog: {
      comments,
      activity,
      activity: { total_parent_comments },
      comments: { results: commentsArr },
      author: {
        personal_info: { userName: blog_author },
      },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  const getParentIndex = () => {
    let startingPoint = index - 1;

    try {
      while (
        commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel
      ) {
        startingPoint--;
      }
    } catch {
      startingPoint = undefined;
    }

    return startingPoint;
  };

  const removeCommentsCard = (startingPoint, isDelete = false) => {
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

    if (isDelete) {
      const parentIndex = getParentIndex();

      if (parentIndex != undefined) {
        commentsArr[parentIndex].children = commentsArr[
          parentIndex
        ].children.filter((child) => child != _id);

        if (!commentsArr[parentIndex].children.length) {
          commentsArr[parentIndex].isReplyLoaded = false;
        }
      }

      commentsArr.splice(index, 1);
    }

    if (commentsArr.childrenLevel == 0 && isDelete) {
      setTotalParentCommentsLoaded((preVal) => preVal - 1);
    }

    setBlog({
      ...blog,
      comments: { results: commentsArr },
      activity: {
        ...activity,
        total_parent_comments:
          total_parent_comments -
          (commentData.childrenLevel == 0 && isDelete ? 1 : 0),
      },
    });
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
            comments: { ...comments, results: commentsArr },
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleReplyClick = () => {
    alert("handle Reply Click");
    if (!accessToken) {
      return toast.error("Login first to give reply");
    }
    setReplying((preVal) => !preVal);
  };

  const handleDeleteComment = (e) => {
    e.target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        {
          _id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        e.target.removeAttribute("disable");
        removeCommentsCard(index + 1, true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-grey">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullName} @{commented_by_username}
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

          {userName === commented_by_username || userName === blog_author ? (
            <button
              className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30
             hover:text-red flex items-center"
              onClick={handleDeleteComment}
            >
              <i className="fi fi-rr-trash pointer-events-none"></i>
            </button>
          ) : (
            " "
          )}
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
