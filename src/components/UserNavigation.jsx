import { Link } from "react-router-dom";
import PageAnimation from "../common/PageAnimation";
import { UserContext } from "../App";
import { useContext } from "react";
import { RemoveSession } from "../common/Session";

const UserNavigationPanel = () => {
  const {
    userAuth: { userName },
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    RemoveSession("user");
    setUserAuth({ accessToken: null });
  };

  return (
    <>
      <PageAnimation
        className="absolute right-0 w-50"
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
          <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
            <i className="fi fi-rr-edit"></i>
            <p>Write</p>
          </Link>

          <Link to={`/user/${userName}`} className="flex gap-2 link pl-8 py-4 ">
            Profile
          </Link>

          <Link to="/dashboard/blogs" className="flex gap-2 link pl-8 py-4 ">
            Dashboard
          </Link>

          <Link
            to="/settings/edit-profile"
            className="flex gap-2 link pl-8 py-4"
          >
            Settings
          </Link>

          <span className="absolute border-t border-grey w-[100%]"></span>

          <button
            className="text-left w-full hover:bg-grey pl-8 py-4"
            onClick={signOutUser}
          >
            <h1 className="font-bold text-xl mb-1">Sign Out</h1>
            <p className="text-dark-grey">@{userName}</p>
          </button>
        </div>
      </PageAnimation>
    </>
  );
};

export default UserNavigationPanel;
