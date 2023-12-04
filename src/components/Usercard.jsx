/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";

const UserCard = ({ user }) => {
  const {
    "personal_info": { fullName, userName, profile_img },
  } = user;

  return (
    <Link to={`/user/${userName}`} className="flex items-center gap-5 mb-5">
      <img src={profile_img} className="w-14 h-14 rounded-full" />

      <div>
        <h1 className="font-medium text-xl line-clamp-2">{fullName}</h1>
        <p className="text-dark-grey">@{userName}</p>
      </div>
    </Link>
  );
};

export default UserCard;
