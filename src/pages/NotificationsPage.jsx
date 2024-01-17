import { useState } from "react";

const Notifications = () => {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Like", "Comment", "Reply"];

  const handleFilter = (e) => {
    const btn = e.target.innerText;
    setFilter(btn)
  }

  return (
    <div>
      <h1 className="max-md:hidden">Recent Notification</h1>

      <div className="my-8 flex gap-6">
        {filters.map((filterName, i) => {
          return (
            <button
              className={
                "py-2 " + (filter == filterName ? "btn-dark" : "btn-light")
              }
              key={i}
              onClick={handleFilter}
            >
              {filterName}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
