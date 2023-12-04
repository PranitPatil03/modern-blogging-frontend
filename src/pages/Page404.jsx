/* eslint-disable react/no-unescaped-entities */
import { Link } from "react-router-dom";
import PageNotFoundImage from "../assets/404.png";
import fullLogo from "../assets/full-logo.png";

const PageNotFound = () => {
  return (
    <>
      <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
        <img
          src={PageNotFoundImage}
          className="select-none border-2 border-grey/10 w-80 aspect-square object-cover rounded"
        />

        <h1 className="text-4xl font-gelasio leading-7">Page Not Found</h1>
        <p className="text-dark-grey text-xl leading-7 -mt-8">
          The page you are looking got doesn't exist. Go back to{" "}
          <Link to="/" className="text-black underline">
            Home Page
          </Link>
        </p>

        <div className="mt-auto">
          <img
            src={fullLogo}
            className="h-8 object-contain block mx-auto select-none"
          />
          <p className="mt-5 text-dark-grey">
            Read Millions of Stories round the world
          </p>
        </div>
      </section>
    </>
  );
};

export default PageNotFound;
