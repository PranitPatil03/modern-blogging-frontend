import { useRef } from "react";
import PageAnimation from "../common/PageAnimation";
import InputBox from "../components/InputBox";
import toast, { Toaster } from "react-hot-toast";

const ChangePassword = () => {
  const changePasswordForm = useRef();
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(changePasswordForm.current);

    const formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    const { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Enter the Password...");
    }

    if (
      !passwordRegex.test(newPassword) ||
      !passwordRegex.test(currentPassword)
    ) {
      return toast.error("Password is Invalid");
    }
  };

  return (
    <>
      <PageAnimation>
        <Toaster />
        <form ref={changePasswordForm}>
          <h1 className="max-md:hidden">Change Password</h1>

          <div className="py-10 w-full md:max-w-[400px]">
            <InputBox
              name="currentPassword"
              type="password"
              className="profile-edit-input"
              placeholder="Current Password"
              icon="fi-rr-unlock"
            />
            <InputBox
              name="newPassword"
              type="password"
              className="profile-edit-input"
              placeholder="New Password"
              icon="fi-rr-unlock"
            />

            <button
              className="btn-dark px-10"
              type="submit"
              onClick={handleSubmit}
            >
              Change Password
            </button>
          </div>
        </form>
      </PageAnimation>
    </>
  );
};

export default ChangePassword;
