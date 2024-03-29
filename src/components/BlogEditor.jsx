import { useContext, useEffect } from "react";
import logo from "../assets/logo.png";
import uploadImg from "../common/AWS";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import defaultBanner from "../assets/blogBanner.png";
import PageAnimation from "../common/PageAnimation";
import { EditorContext } from "../pages/EditorPages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./Tools";
import { Container } from "postcss";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  const {
    blog,
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
    blog: { title, banner, content, tags, description },
  } = useContext(EditorContext);

  const { blog_id } = useParams();

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "blogEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Write a something great ",
      })
    );
  }, []);

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];

    const loadingToast = toast.loading("Uploading");

    if (img) {
      uploadImg(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded 👍");
            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          toast.error(err);
        });
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  };

  const handleOnChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    const img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    if (!banner.length) {
      toast.error("Upload a blog banner to publish it");
    }

    if (!title.length) {
      toast.error("Give Title to the blog to publish it");
    }

    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        console.log(data);
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Write something to publish the Blog");
        }
      });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }

    if (!title.length) {
      return toast.error("Give Title to save the blog as a draft");
    }

    const loadingToast = toast.loading("Publishing....");

    e.target.classList.add("disable");

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        const blogObj = {
          title,
          description,
          banner,
          content,
          tags,
          draft: true,
        };

        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-blog",
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
            toast.success("Blog Saved as Drafted ✅👍");

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft");
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable");
            toast.dismiss(loadingToast);

            return toast.error(response.data.error);
          });
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1">
          {title.length ? title : "Blog Title"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save As Draft
          </button>
        </div>
      </nav>

      <Toaster />

      <PageAnimation>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".jpg , .png , .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                ></input>
              </label>
            </div>

            <textarea
              defaultValue="Title"
              value={title}
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
              placeholder="Blog Title"
              onKeyDown={handleOnKeyDown}
              onChange={handleOnChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div className="font-gelasio text-left" id="blogEditor"></div>
          </div>
        </section>
      </PageAnimation>
    </>
  );
};

export default BlogEditor;
