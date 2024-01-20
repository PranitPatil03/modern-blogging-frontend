import { Link } from "react-router-dom";
import { getDay } from "../common/Date";
import { useState } from "react";

/* eslint-disable react/prop-types */

const BlogStats = ({stats}) => {
  return (
    <div className="flex gap-1">
      {
        Object.keys(stats).map((info, i) => {
          return <div key={i} className="flex flex-col items-center w-full h-full justify-center">
          </div>
        })
      }
    </div>
  )
}

const ManagePublishedBlogsCard = ({ blog }) => {
  const { banner, blog_id, title, publishedAt,activity } = blog;

  const [showStats, setShowStats] = useState(false);

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
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">Edit</Link>

            <button
              className="lg:hidden pr-4 py-2 underline"
              onClick={() => setShowStats((preVal) => !preVal)}
            >
              Stats
            </button>

            <button className="pr-4 py-2 underline text-red">Delete</button>

          </div>
        </div>

        <div className="max-lg:hidden">
          <BlogStats stat={activity}/>
        </div>

      </div>

      {
        showStats ? <div className="lg:hidden">
          <BlogStats stats={activity}/>
        </div> : ""
      }

    </>
  );
};

export default ManagePublishedBlogsCard;
