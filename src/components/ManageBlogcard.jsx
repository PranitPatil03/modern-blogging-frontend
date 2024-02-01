import { Link } from "react-router-dom";
import { getDay } from "../common/Date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";

/* eslint-disable react/prop-types */

const deleteBlog = (blog, accessToken, target) => {
  const { index, blog_id, setStateFun } = blog;

  target.setAttribute("disabled", true);

  axios
    .post(
      import.meta.env.VITE_SERVER_DOMAIN + "/blog/delete-blog",
      { blog_id },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    .then(({ data }) => {
      target.removeAttribute("disabled");

      setStateFun((preVal) => {
        let { deletedDocCount, totalDocs, results } = preVal;

        results.splice(index, 1);

        if (!deletedDocCount) {
          deletedDocCount = 0;
        }

        if (!results.length && totalDocs - 1 > 0) {
          return null;
        }

        return {
          ...preVal,
          totalDocs: totalDocs - 1,
          deleteDocCount: deletedDocCount + 1,
        };
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const BlogStats = ({ stats }) => {
  return (
    <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
      {Object.keys(stats).map((info, i) => {
        return !info.includes("parent") ? (
          <div
            key={i}
            className={
              "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
              (i != 0 ? "border-grey border-l" : "")
            }
          >
            <h1 className="text-xl lg:text-2xl mb-2">{stats[info]}</h1>
            <p className="max-lg:text-dark-grey capitalize">
              {info.split("_")[1]}
            </p>
          </div>
        ) : (
          ""
        );
      })}
    </div>
  );
};

export const ManagePublishedDraftCard = ({ blog }) => {
  let { title, description, blog_id, index } = blog;

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  index++;

  return (
    <>
      <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
        <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
          {index < 10 ? "0" + index : index}
        </h1>

        <div>
          <h1 className="blog-title mb-3">{title}</h1>

          <p className="line-clamp-2 font-gelasio">
            {description?.length ? description : "No Description"}
          </p>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="pr-4 py-2 underline text-red"
              onClick={(e) => deleteBlog(blog, accessToken, e.target)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const ManagePublishedBlogsCard = ({ blog }) => {
  const { banner, blog_id, title, publishedAt, activity } = blog;

  const [showStats, setShowStats] = useState(false);

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  return (
    <>
      <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
        <img
          src={banner}
          className="max-md:hidden lg:hidden xl:block w-28 h-28 bg-grey object-cover flex-none"
        />

        <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
          <div className="">
            <Link
              to={`/blog/${blog_id}`}
              className="blog-title mb-4 hover:underline"
            >
              {title}
            </Link>
            <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>
          </div>

          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
              Edit
            </Link>

            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStats((preVal) => !preVal)}
            >
              Stats
            </button>

            <button
              className="pr-4 py-2 underline text-red"
              onClick={(e) => deleteBlog(blog, accessToken, e.target)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stats={activity} />
        </div>
      </div>

      {showStats ? (
        <div className="lg:hidden">
          <BlogStats stats={activity} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default ManagePublishedBlogsCard;
