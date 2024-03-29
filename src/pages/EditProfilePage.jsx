/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import { profileDataStructure } from "./ProfilePage";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import toast, { Toaster } from "react-hot-toast";
import InputBox from "../components/InputBox";
import uploadImg from "../common/AWS";
import { StoreSession } from "../common/Session";

const EditProfile = () => {
  const bioLimit = 150;
  const ImagePreviewRef = useRef();
  const FormRef = useRef();

  const {
    userAuth: { accessToken, userName },
    userAuth,
    setUserAuth,
  } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [updatedImgUrl, setUpdatedImgUrl] = useState(null);
  const [charactersLeft, setCharactersLeft] = useState(bioLimit);
  const [profile, setProfileData] = useState(profileDataStructure);

  let {
    personal_info: {
      bio,
      email,
      fullName,
      profile_img,
      userName: profile_userName,
    },
    social_links,
  } = profile;

  const handleCharacterChange = (e) => {
    setCharactersLeft(bioLimit - e.target.value.length);
  };

  const handleImagePreview = (e) => {
    const previewImg = e.target.files[0];

    ImagePreviewRef.current.src = URL.createObjectURL(previewImg);

    setUpdatedImgUrl(previewImg);
  };

  const handleImgUpload = (e) => {
    e.preventDefault();

    if (updatedImgUrl) {
      const loadingToast = toast.loading("Uploading....");

      e.target.setAttribute("disabled", true);

      uploadImg(updatedImgUrl)
        .then((url) => {
          console.log("URL2", url);

          if (url) {
            axios
              .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/user/update-profile-img",
                { updatedImgUrl: url },
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              )
              .then(({ data }) => {
                const newUserAuth = {
                  ...userAuth,
                  profile_img: data.profile_img,
                };
                StoreSession("user", JSON.stringify(newUserAuth));

                setUserAuth(newUserAuth);

                setUpdatedImgUrl(null);

                toast.dismiss(loadingToast);
                e.target.setAttribute("disabled", false);
                toast.success("Profile Image Updated👍✅");
              })
              .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.setAttribute("disabled", false);
                toast.success(response.data.error);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(FormRef.current);

    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const {
      bio,
      facebook,
      github,
      instagram,
      twitter,
      userName,
      website,
      youtube,
    } = formData;

    if (userName.length < 3) {
      return toast.error("UserName should be at least 3 characters long");
    }

    if (bio.length > bioLimit) {
      return toast.error(`Bio should be more than ${bioLimit}`);
    }

    const loadingToast = toast.loading("Uploading....");

    e.target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/user/update-profile",
        {
          userName,
          bio,
          social_links: {
            facebook,
            github,
            instagram,
            twitter,
            website,
            youtube,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(({ data }) => {
        if (userAuth.userName != data.userName) {
          const newUserAuth = {
            ...userAuth,
            userName: data.userName,
          };
          StoreSession("user", JSON.stringify(newUserAuth));
          setUserAuth(newUserAuth);
        }
        toast.dismiss(loadingToast);
        e.target.setAttribute("disabled", false);
        toast.success("Profile Image Updated👍✅");
      })
      .catch(({ response }) => {
        toast.dismiss(loadingToast);
        e.target.setAttribute("disabled", false);
        toast.success(response.data.error);
      });
  };

  useEffect(() => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/user/get-profile", {
        userName: userName,
      })
      .then(({ data }) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console(err);
      });
  }, [accessToken]);

  return (
    <PageAnimation>
      {loading ? (
        <Loader />
      ) : (
        <form ref={FormRef}>
          <Toaster />

          <h1 className="max-md:hidden">Edit Profile</h1>

          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5">
              <label
                className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                htmlFor="uploadImg"
                id="profileImageLabel"
              >
                <div className="w-full h-full absolute left-0 top-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer">
                  Upload Profile Image
                </div>
                <img ref={ImagePreviewRef} src={profile_img} />
              </label>
              <input
                hidden
                type="file"
                id="uploadImg"
                accept=".jpeg .png .jpg"
                onChange={handleImagePreview}
              />

              <button
                className="btn-light mt-5 max-lg:center lg:w-full px-10"
                onClick={handleImgUpload}
              >
                Upload
              </button>
            </div>

            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div className="">
                  <InputBox
                    name="fullName"
                    placeholder="Full Name"
                    type="text"
                    value={fullName}
                    disabled={true}
                    icon="fi-rr-user"
                  />
                </div>
                <div className="">
                  <InputBox
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    disabled={true}
                    icon="fi-rr-envelope"
                  />
                </div>
              </div>

              <InputBox
                type="text"
                name="userName"
                value={profile_userName}
                placeholder="UserName"
                icon="fi-rr-at"
              />

              <p className="text-dark-grey -mt-3">
                UserName will use to search user and will be visible to all user
              </p>

              <textarea
                name="bio"
                defaultValue={bio}
                maxLength={bioLimit}
                placeholder="bio"
                onChange={handleCharacterChange}
                className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
              ></textarea>

              <p className="text-right">{charactersLeft} characters left</p>

              <p className="my-6 text-dark-grey">
                Add your social handles below
              </p>

              <div className="md:grid md:grid-cols-2 gap-x-6">
                {Object.keys(social_links).map((key, i) => {
                  let link = social_links[key];

                  <i
                    className={
                      "fi " +
                      (key != "website" ? "fi-brands-" + key : "fi-rr-globe") +
                      " text-2xl hover:text-black"
                    }
                  ></i>;

                  return (
                    <InputBox
                      key={i}
                      name={key}
                      type="text"
                      value={link}
                      placeholder="https://"
                      icon={
                        "fi " +
                        (key != "website" ? "fi-brands-" + key : "fi-rr-globe")
                      }
                    />
                  );
                })}
              </div>

              <button
                className="btn-dark w-auto px-10"
                type="submit"
                onClick={handleSubmit}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </PageAnimation>
  );
};

export default EditProfile;
