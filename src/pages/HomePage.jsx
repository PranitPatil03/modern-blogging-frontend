import axios from "axios";
import PageAnimation from "../common/PageAnimation";
import InPageNavigation, { activeTabRef } from "../components/InpageNavigation";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import BlogPostCard from "../components/BlogPostCard";
import MinimalBlogPost from "../components/NobannerBlogPost";
import Nodata from "../components/Nodata";
import FilterPaginationData from "../common/FilterPaginationData";
import LoadMoreDataBtn from "../components/LoadMore";

const HomePage = () => {
  const [blogs, setBlogs] = useState(null);
  const [trendingBlogs, setTrendingBlogs] = useState(null);
  const [pageState, setPageState] = useState("home");

  const categories = [
    "Lifestyle",
    "Business",
    "Travel",
    "Food",
    "Fashion",
    "Health",
    "Tech",
    "Programming",
    "Personal Finance",
    "Book",
    "Movie",
  ];

  const LoadBlogByCategory = (e) => {
    const category = e.target.innerText;
    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/latest-blogs", { page })
      .then(async ({ data }) => {
        const formateData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/all-latest-blogs-count",
        });

        setBlogs(formateData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchBlogsByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        const formateData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        console.log(formateData);
        setBlogs(formateData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/blog/trending-blogs")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();

    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogsByCategory({ page: 1 });
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <PageAnimation>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            defaultHidden={["treading blogs"]}
            routes={[pageState, "treading blogs"]}
          >
            <>
              {blogs === null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <Nodata message="No Blogs Published yet" />
              )}

              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState === "home" ? fetchLatestBlogs : fetchBlogsByCategory
                }
              />
            </>
            {trendingBlogs === null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <PageAnimation
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </PageAnimation>
                );
              })
            ) : (
              <Nodata message="No Trending Blogs Found" />
            )}
          </InPageNavigation>
        </div>

        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <div>
              <h1 className="font-medium text-xl mb-8">
                Stories form all interests
              </h1>

              <div className="flex flex-wrap gap-3">
                {categories.map((category, i) => {
                  return (
                    <button
                      onClick={LoadBlogByCategory}
                      className={
                        "tag " +
                        (pageState == category ? " bg-black text-white" : " ")
                      }
                      key={i}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h1 className="font-medium text-xl mb-8">
                Trending
                <i className="fi fi-rr-arrow-trend-up"></i>
              </h1>

              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <PageAnimation
                      key={i}
                      transition={{ duration: 1, delay: i * 0.1 }}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </PageAnimation>
                  );
                })
              ) : (
                <Nodata message="No Trending Blogs Found" />
              )}
            </div>
          </div>
        </div>
      </section>
    </PageAnimation>
  );
};

export default HomePage;
