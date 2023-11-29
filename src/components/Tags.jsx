import { useContext } from "react";
import { EditorContext } from "../pages/EditorPages";

const Tags = ({ tag, tagIndex }) => {
  let {
    blog,
    setBlog,
    blog: { tags },
  } = useContext(EditorContext);

  const handleTagDelete = () => {
    tags = tags.filter((t) => t != tag);
    setBlog({ ...blog, tags });
  };

  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      const currentTag = e.target.innerText;

      tags[tagIndex] = currentTag;

      setBlog({ ...blog, tags });

      e.target.setAttribute("contentEditable", false);
    }
  };

  const addEditable = (e) => {
    e.target.setAttribute("contentEditable", true);
  };

  return (
    <div className="relative p-2 mt-2 px-5 mr-3 rounded-full bg-white pl-8 pr-10 inline-block hover:bg-opacity-50">
      <p
        className="outline-none"
        contentEditable="true"
        onKeyDown={handleTagEdit}
        onClick={addEditable}
      >
        {tag}
      </p>

      <button
        className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
        onClick={handleTagDelete}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
};

export default Tags;
