import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/BlogEditor";
import PublishForm from "../components/PublishForm";

const blogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  description: '',
  author: { personal_info: {} }
}

export const EditorContext = createContext({})

const EditorPages = () => {

  const [blog, setBlog] = useState(blogStructure)

  const [editorState, setEditorState] = useState("editor");

  const [textEditor, setTextEditor] = useState({ isReady: false });

  const {
    userAuth: { accessToken },
  } = useContext(UserContext);

  return (
    <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
      {accessToken === null ? (
        <Navigate to="/sign-in" />
      ) : editorState == "editor" ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default EditorPages;
