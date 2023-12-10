/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import { getDay } from "../common/Date";
import BlogInteraction from "../components/BlogInteraction";
import BlogPostCard from "../components/BlogPostCard";
import BlogContent from "../components/BlogContent";
import CommentsContainer, { fetchComments } from "../components/Comments";

export const blogStructure = {
  title: " ",
  description: "",
  content: [],
  banner: "",
  author: { personal_info: {} },
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [loading, setLoading] = useState(true);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [isLikeByUser, setIsLikeByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  let {
    title,
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
      .then(async ({ data: { blog } }) => {
        console.log("Before", blog);

        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded,
        });

        console.log("After", blog);

        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });
        setLoading(false);
        console.log(blog);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    resetStates();
    fetchBlogs();
  }, [blog_id]);

  const resetStates = () => {
    setBlog(blogStructure);
    setLoading(true);
    setSimilarBlogs(null);
    setIsLikeByUser(false);
  };

  return (
    <>
      <PageAnimation>
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider
            value={{
              blog,
              setBlog,
              isLikeByUser,
              setIsLikeByUser,
              commentsWrapper,
              setCommentsWrapper,
              totalParentCommentsLoaded,
              setTotalParentCommentsLoaded,
            }}
          >
            <CommentsContainer />

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

              <div className="my-12 font-gelasio blog-post-content">
                {content[0]?.blocks?.map((block, i) => {
                  return (
                    <div key={i} className="my-4 md:my-8">
                      <BlogContent block={block} />
                    </div>
                  );
                })}
              </div>

              <BlogInteraction />

              {similarBlogs != null && similarBlogs.length ? (
                <>
                  <h1 className="text-2xl mt-14 mb-10 font-medium">
                    Similar Blogs
                  </h1>

                  {similarBlogs.map((blog, i) => {
                    const {
                      author: { personal_info },
                    } = blog;

                    return (
                      <PageAnimation
                        key={i}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      >
                        <BlogPostCard content={blog} author={personal_info} />
                      </PageAnimation>
                    );
                  })}
                </>
              ) : (
                " "
              )}
            </div>
          </BlogContext.Provider>
        )}
      </PageAnimation>
    </>
  );
};

export default BlogPage;
