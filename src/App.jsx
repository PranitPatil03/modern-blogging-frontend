import { Route, Routes } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthFormPage";
import { createContext, useEffect, useState } from "react";
import { LookInSession } from "./common/Session";
import EditorPages from "./pages/EditorPages";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import PageNotFound from "./pages/Page404";
import ProfilePage from "./pages/ProfilePage";
import BlogPage from "./pages/BlogPage";

export const UserContext = createContext({});

function App() {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    const userInSession = LookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accessToken: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<EditorPages />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="sign-in" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage/>} />
          <Route path="blog/:blog_id" element={<BlogPage/>} />
          <Route path="*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
