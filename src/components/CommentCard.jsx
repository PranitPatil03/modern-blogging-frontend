import { getDay } from "../common/Date";

/* eslint-disable react/prop-types */
const CommentCard = ({ index, leftVal, commentData }) => {
  let {
    commented_by: {
      personal_info: { fullName, profile_img, userName },
    },
    commentedAt,
    comment,
  } = commentData;

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
      </div>
    </div>
  );
};

export default CommentCard;
