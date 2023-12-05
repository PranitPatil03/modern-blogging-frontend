/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/BlogInteraction";

export const blogStructure = {
  title: " ",
  description: "",
  content: [],
  banner: "",
  author: { personal_info: {} },
  publishedAt: "",
  tags: [],
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);

  let {
    title,
    description,
    content,
    banner,
    author: {
      personal_info: { fullName, userName: author_userName, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlogs = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
      })
      .then(({ data: { blog } }) => {
        setBlog(blog);
        setLoading(false);
        console.log(blog);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <>
      <PageAnimation>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider value={{ blog, setBlog }}>
            <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
              <img src={banner} className="aspect-video" />

              <div className="mt-12">
                <h2>{title}</h2>

                <div className="flex max-sm:flex-col justify-between my-8">
                  <div className="flex gap-5 items-start">
                    <img src={profile_img} className="w-12 h-12 rounded-full" />

                    <p className="capitalize">
                      {fullName}
                      <br />@
                      <Link
                        to={`/user/${author_userName}`}
                        className="underline"
                      >
                        {author_userName}
                      </Link>
                    </p>
                  </div>

                  <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                    Published on {getDay(publishedAt)}
                  </p>
                </div>
              </div>

              <BlogInteraction />
            </div>
          </BlogContext.Provider>
        )}
      </PageAnimation>
    </>
  );
};

export default BlogPage;
