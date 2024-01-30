/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
/* eslint-disable react/prop-types */
import InputBox from "../components/InputBox";
import googleIcon from "../assets/google.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import PageAnimation from "../common/PageAnimation";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { StoreSession } from "../common/Session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/Firebase";

const UserAuthFormPage = ({ type }) => {
  const navigate = useNavigate();

  const {
    userAuth: { accessToken },
    setUserAuth,
  } = useContext(UserContext);

  console.log(accessToken);

  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const serverRoute = type == "sign-in" ? "/auth/sign-in" : "/auth/signup";

  const userAuthFromServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        console.log("Data ==>", data);
        StoreSession("user", JSON.stringify(data));
        setUserAuth(data);
        toast.success(`${type} successful ✅`);
      })
      .catch(({ response }) => {
        toast.error(response?.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(FormElement);

    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { fullName, email, password } = formData;

    if (fullName) {
      if (fullName.length < 3) {
        return toast.error("FullName must be at least 3 Letters long");
      }
    }

    if (!email.length) {
      return toast.error("Enter Mail");
    }

    if (!emailRegex.test(email)) {
      return toast.error("Mail is Invalid");
    }

    if (!passwordRegex.test(password)) {
      return toast.error("Password is Invalid");
    }

    userAuthFromServer(serverRoute, formData);

    if (type == "signup") {
      navigate("/sign-in");
    }
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        console.log(user.accessToken.length);

        const serverRoute = "/auth/google-auth";

        const formData = {
          accessToken: user.accessToken,
        };

        console.log(formData.accessToken.length);

        userAuthFromServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("Something went wrong , Try Again");
        return console.log(err);
      });
  };

  return accessToken ? (
    <Navigate to="/" />
  ) : (
    <PageAnimation key={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster />
        <form id="FormElement" className="w-[90%] md:w-[35%] max-w-250px">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in" ? "Welcome Back" : "Join Us"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullName"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-8 uppercase text-black font-black">
            <hr className="w-1/2 border-black"></hr>
            <p className="text-dark-grey">OR</p>
            <hr className="w-1/2 border-black"></hr>
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" /> continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join Now
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/sign-in" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </PageAnimation>
  );
};

export default UserAuthFormPage;
