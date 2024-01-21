/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import FilterPaginationData from "../common/FilterPaginationData";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/InpageNavigation";
import Loader from "../components/Loader";
import Nodata from "../components/Nodata";
import PageAnimation from "../common/PageAnimation";
import ManagePublishedBlogsCard, {
  ManagePublishedDraftCard,
} from "../components/ManageBlogcard";
import LoadMoreDataBtn from "../components/LoadMore";

const ManageBlogs = () => {
  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs",
        {
          page,
          draft,
          query,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data }) => {
        const formattedData = await FilterPaginationData({
          state: draft ? drafts : blogs,
          data: data.blogs,
          page,
          user: accessToken,
          countRoute: "/user-written-blogs-count",
          data_to_send: { query, draft },
        });

        console.log("formattedData", formattedData);

        if (draft) {
          setDrafts(formattedData);
        } else {
          setBlogs(formattedData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (accessToken) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }

      if (drafts == null) {
        getBlogs({ page: 1, draft: true });
      }
    }
  }, [accessToken, blogs, drafts, query]);

  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery("");
      setBlogs(null);
      setDrafts(null);
    }
  };

  const handleSearch = (e) => {
    let searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode === 13 && searchQuery.length) {
      setBlogs(null);
      setDrafts(null);
    }
  };

  return (
    <>
      <h1 className="max-md:hidden">Manage Blogs</h1>

      <Toaster />

      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
          placeholder="Search Blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />

        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <InPageNavigation routes={["Published Blogs", "Drafts"]}>
        {blogs == null ? (
          <Loader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogsCard
                    blog={{ ...blog, index: i, setStateFun: setBlogs }}
                  />
                </PageAnimation>
              );
            })}

            <LoadMoreDataBtn
              state={blogs}
              fetchDataFun={getBlogs}
              additionalParams={{
                draft: false,
                deletedDocCount: blogs.deletedDocCount,
              }}
            />
          </>
        ) : (
          <Nodata message="No Published Blogs" />
        )}

        {drafts == null ? (
          <Loader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedDraftCard
                    blog={{ ...blog, index: i, setStateFun: setDrafts }}
                  />
                </PageAnimation>
              );
            })}
            <LoadMoreDataBtn
              state={drafts}
              fetchDataFun={getBlogs}
              additionalParams={{
                draft: true,
                deletedDocCount: setDrafts.deletedDocCount,
              }}
            />
          </>
        ) : (
          <Nodata message="No Drafts Blogs" />
        )}
      </InPageNavigation>
    </>
  );
};

export default ManageBlogs;
