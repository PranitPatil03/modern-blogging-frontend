import { useParams } from "react-router-dom";
import InPageNavigation from "../components/InpageNavigation";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import BlogPostCard from "../components/BlogPostCard";
import Nodata from "../components/Nodata";
import LoadMoreDataBtn from "../components/LoadMore";
import axios from "axios";
import FilterPaginationData from "../common/FilterPaginationData";
import { useEffect, useState } from "react";
import UserCard from "../components/Usercard";

const SearchPage = () => {
  const { query } = useParams();

  const [blogs, setBlogs] = useState(null);
  const [users, setUsers] = useState(null);

  const searchBlogs = ({ page = 1, create_new_arr = false }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {
        query,
        page,
      })
      .then(async ({ data }) => {
        const formateData = await FilterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/blog/search-blogs-count",
          create_new_arr,
        });

        setBlogs(formateData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const searchUser = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/user/search-users", {
        query,
      })
      .then(({ data: { users } }) => {
        setUsers(users);
      });
  };

  useEffect(() => {
    resetState();
    searchBlogs({ page: 1 });
    searchUser();
  }, [query]);

  const resetState = () => {
    setBlogs(null);
    searchUser(null);
  };

  const UserCardWrapper = () => {
    return (
      <>
        {users === null ? (
          <Loader />
        ) : (
          users.map((user, i) => {
            console.log(user);
            return (
              <PageAnimation
                key={i}
                transition={{ duration: 1, delay: i * 0.08 }}
              >
                <UserCard user={user} />
              </PageAnimation>
            );
          })
        )}
      </>
    );
  };

  return (
    <>
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <InPageNavigation
            routes={[`Search Results from "${query}"`, "Account Matched"]}
            defaultHidden={["Account Matched"]}
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

              <LoadMoreDataBtn state={blogs} fetchDataFun={searchBlogs} />
            </>

            <UserCardWrapper />
          </InPageNavigation>
        </div>

        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8">
            Users related to search
            <i className="fi fi-rr-user mt-1"></i>
          </h1>
          <UserCardWrapper />
        </div>
      </section>
    </>
  );
};

export default SearchPage;
