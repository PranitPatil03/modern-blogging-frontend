import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import FilterPaginationData from "../common/FilterPaginationData";
import Loader from "../components/Loader";
import PageAnimation from "../common/PageAnimation";
import NotificationCard from "../components/NotificationCard";
import Nodata from "../components/Nodata";
import LoadMoreDataBtn from "../components/LoadMore";

const Notifications = () => {
  const {
    userAuth,
    setUserAuth,
    userAuth: { accessToken,new_notification_available},
  } = useContext(UserContext);

  let [filter, setFilter] = useState("All");
  const [notifications, setNotifications] = useState(null);

  const filters = ["All", "Like", "Comment", "Reply"];

  const fetchNotification = ({ page, deletedDocCount = 0 }) => {
    filter = filter.toLowerCase();
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/notifications",
        {
          page,
          filter,
          deletedDocCount,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(async ({ data: { notifications: data } }) => {

        if (new_notification_available) {
          setUserAuth({...userAuth,new_notification_available:false})
        }

        let formattedData = await FilterPaginationData({
          state: notifications,
          data,
          page,
          countRoute: "/all-notifications-count",
          data_to_send: { filter },
          user: accessToken,
        });
        setNotifications(formattedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFilter = (e) => {
    const btn = e.target.innerText;
    setFilter(btn);
    setNotifications(null);
  };

  useEffect(() => {
    if (accessToken) {
      fetchNotification({ page: 1 });
    }
  }, [accessToken, filter]);

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

      {notifications === null ? (
        <Loader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((notification, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={notification}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </PageAnimation>
              );
            })
          ) : (
            <Nodata message="Nothing available" />
          )}

          <LoadMoreDataBtn
            state={notifications}
            fetchDataFun={fetchNotification}
            additionalParams={{
              deletedDocCount: notifications.deletedDocCount,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Notifications;
