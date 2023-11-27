import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import PageAnimation from "../common/PageAnimation";

import defaultBanner from "../assets/blogBanner.png";
import uploadImg from "../common/AWS";
import { useRef } from "react";

const BlogEditor = () => {
  const blogBannerRef = useRef();

  const handleBannerUpload = (e) => {
    const img = e.target.files[0];

    if (img) {
      uploadImg(img).then((url) => {
        if (url) {
          blogBannerRef.current.src = url;
        }
      });
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img className="w-full" src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Blog</p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save As Draft</button>
        </div>
      </nav>

      <PageAnimation>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img ref={blogBannerRef} src={defaultBanner} className="z-20" />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".jpg , .png , .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                ></input>
              </label>
            </div>
          </div>
        </section>
      </PageAnimation>
    </>
  );
};

export default BlogEditor;
