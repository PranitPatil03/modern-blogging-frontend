import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

const EditorPages = () => {
  const [editorState, setEditorState] = useState("editor");

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  return (
    <>
      {accessToken === null ? (
        <Navigate to="/sign-in" />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </>
  );
};

export default EditorPages;
