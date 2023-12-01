import axios from "axios";
import PageAnimation from "../common/PageAnimation";
import InPageNavigation from "../components/InpageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogPostCard from "../components/BlogPostCard";
import MinimalBlogPost from "../components/NobannerBlogPost";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);

  const fetchLatestBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
      .then(({ data }) => {
        setBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchLatestBlogs();
    fetchTrendingBlogs();
  }, []);

  return (
    <PageAnimation>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            defaultHidden={["treading blogs"]}
            routes={["home", "treading blogs"]}
          >
            <>
              {blogs == null ? (
                <Loader />
              ) : (
                blogs.map((blog, i) => {
                  return (
                    <PageAnimation
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <BlogPostCard
                        content={blog}
                        author={blog.author.personal_info}
                      />
                    </PageAnimation>
                  );
                })
              )}
            </>
            {trendingBlogs == null ? (
              <Loader />
            ) : (
              blogs.map((blog, i) => {
                return (
                  <PageAnimation
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i}/>
                  </PageAnimation>
                );
              })
            )}
          </InPageNavigation>
        </div>

        <div></div>
      </section>
    </PageAnimation>
  );
};

export default HomePage;
