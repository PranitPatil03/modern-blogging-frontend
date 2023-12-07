import { useContext } from "react";
import PageAnimation from "../common/PageAnimation";
import { EditorContext } from "../pages/EditorPages";
import Tags from "./Tags";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";

const PublishForm = () => {
  const characterLength = 200;
  const tagLimit = 10;
  const { blog_id } = useParams();

  const navigate = useNavigate();

  const {
    blog,
    setBlog,
    setEditorState,
    blog: { title, banner, content, tags, description },
  } = useContext(EditorContext);

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const handleCloseEvent = () => {
    setEditorState("editor");
  };

  const handleBlogTitleChange = (e) => {
    const input = e.target;

    setBlog({ ...blog, title: input.value });
  };

  const handleBlogDescriptionChange = (e) => {
    const input = e.target;

    setBlog({ ...blog, description: input.value });
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      const tag = e.target.value;

      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      } else {
        toast.error(`You can add max ${tagLimit} tags`);
      }
      e.target.value = "";
    }
  };

  const handlePublishBlog = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!description.length) {
      return toast.error("Upload a blog banner to publish it");
    }

    if (!title.length) {
      return toast.error("Give Title to the blog to publish it");
    }

    if (!tags.length) {
      return toast.error("Add Tags to publish the blog");
    }

    const loadingToast = toast.loading("Publishing....");

    e.target.classList.add("disable");

    const blogObj = {
      title,
      description,
      banner,
      content,
      tags,
      draft: false,
    };

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
        { ...blogObj, id: blog_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
        toast.success("Blog Published ✅👍");

        setTimeout(() => {
          navigate("/");
        }, 500);
      })
      .catch(({ response }) => {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);

        return toast.error(response.data.error);
      });
  };

  return (
    <>
      <PageAnimation>
        <Toaster />

        <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4 ">
          <button
            className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top[10%]"
            onClick={handleCloseEvent}
          >
            <i className="fi fi-br-cross"></i>
          </button>

          <div className="max-w-[550px] center">
            <p className="text-dark-grey mb-1">Preview</p>

            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <img src={banner} />
            </div>

            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {title}
            </h1>

            <p className="font-gelasio line-clamp-2 text-xl mt-4">
              {description}
            </p>
          </div>

          <div className="border-grey lg:border-1 lg:pl-8">
            <p className="mb-2 mt-9 text-dark-grey">Blog Title</p>

            <input
              type="text"
              placeholder="Blog Title"
              defaultValue={title}
              className="input-box pl-4"
              onChange={handleBlogTitleChange}
            />

            <p className="mb-2 mt-9 text-dark-grey">
              Short description for your blog
            </p>

            <textarea
              maxLength={characterLength}
              defaultValue={description}
              className="h-40 resize-none leading-7 input-box pl-4"
              onChange={handleBlogDescriptionChange}
              onKeyDown={handleOnKeyDown}
            ></textarea>

            <p className="mt-1 text-sm text-dark-grey text-right">
              {characterLength - description.length} characters Left
            </p>

            <p className="mb-2 mt-9 text-dark-grey">
              Topics - Helps in optimizing searching and ranking the blog
            </p>

            <div className="relative input-box pl-2 py-2 pb-4">
              <input
                type="text"
                placeholder="Topic"
                onKeyDown={handleKeyDown}
                className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              />
              {tags.map((tag, i) => {
                return <Tags tag={tag} tagIndex={i} key={i} />;
              })}
            </div>
            <p className="mt-1 text-sm text-dark-grey text-right">
              {tagLimit - tags.length} Tags Left
            </p>

            <button className="btn-dark px-8" onClick={handlePublishBlog}>
              Publish
            </button>
          </div>
        </section>
      </PageAnimation>
    </>
  );
};

export default PublishForm;
