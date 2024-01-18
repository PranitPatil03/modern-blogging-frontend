import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const NotificationCard = ({ data, index, notificationState }) => {
  const {
    user: {
      personal_info: { profile_img, fullName, userName },
    },
  } = data;

  return (
    <>
      <div className="p-6 border-b border-grey border-l-black">
        <div className="flex gap-5 mb-3">
          <img src={profile_img} className="w-14 h-14 rounded-full flex-none" />
          <div className="w-full">
            <h1 className="font-medium text-xl text-dark-grey">
              <span>{fullName}</span>
              <Link to={`/user/${userName}`}>@{userName}</Link>
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationCard;
