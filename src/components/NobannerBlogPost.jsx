/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import getDay from "../common/Date";

const MinimalBlogPost = ({ blog, index }) => {
  let {
    title,
    blog_id: id,
    author: {
      personal_info: { fullName, userName, profile_img },
    },
    publishedAt,
  } = blog;

  return (
    <Link to={`/blog/${id}`} className="flex gap-5 mb-4">
      <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

      <div>
        <div className="flex gap-2 items-center mb-5">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            {fullName} @{userName}
          </p>
          <p className="min-w-fit">{getDay(publishedAt)}</p>
        </div>

        <h1 className="blog-title mb-6">{title}</h1>
      </div>
    </Link>
  );
};

export default MinimalBlogPost;
