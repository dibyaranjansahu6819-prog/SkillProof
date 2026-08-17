import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AsyncState from "./AsyncState";

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notificationService";


function NotificationBell() {

  const navigate = useNavigate();

  const dropdownRef = useRef(null);


  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  /* =====================================================
     LOAD NOTIFICATIONS
  ===================================================== */

  const loadNotifications = useCallback(async () => {

    try {

      setLoading(true);
      setError("");

      const [
        notificationData,
        countData,
      ] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      setNotifications(
        Array.isArray(notificationData)
          ? notificationData
          : []
      );

      setUnreadCount(
        Number(
          countData?.count || 0
        )
      );

    } catch (error) {

      console.error(
        "Notification loading error:",
        error
      );

      setError(
        error?.response?.data?.detail ||
        "Unable to load notifications. Please try again."
      );

    } finally {

      setLoading(false);

    }

  }, []);


  /* =====================================================
     INITIAL LOAD + POLLING
  ===================================================== */

  useEffect(() => {

    loadNotifications();


    const interval = setInterval(
      async () => {

        try {

          const countData =
            await getUnreadNotificationCount();

          setUnreadCount(
            Number(
              countData?.count || 0
            )
          );

        } catch (error) {

          console.error(
            "Notification count error:",
            error
          );

        }

      },
      30000
    );


    return () => {

      clearInterval(interval);

    };

  }, [loadNotifications]);


  /* =====================================================
     CLOSE WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {

    const handleOutsideClick = (
      event
    ) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target
        )
      ) {

        setOpen(false);

      }

    };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

    };

  }, []);


  /* =====================================================
     OPEN NOTIFICATION
  ===================================================== */

  const handleNotificationClick =
    async (notification) => {

      try {

        if (!notification.is_read) {

          await markNotificationAsRead(
            notification.id
          );


          setNotifications(
            (previous) =>
              previous.map(
                (item) =>
                  item.id ===
                  notification.id
                    ? {
                        ...item,
                        is_read: true,
                      }
                    : item
              )
          );


          setUnreadCount(
            (previous) =>
              Math.max(
                0,
                previous - 1
              )
          );

        }

      } catch (error) {

        console.error(
          "Unable to mark notification as read:",
          error
        );

        setError(
          error?.response?.data?.detail ||
          "Unable to mark this notification as read."
        );

      }


      setOpen(false);


      if (
        notification.application_id
      ) {

        navigate(
          `/student/applications/` +
          `${notification.application_id}`
        );

      }

    };


  /* =====================================================
     MARK ALL AS READ
  ===================================================== */

  const handleMarkAllAsRead =
    async () => {

      if (unreadCount === 0) {
        return;
      }


      try {

        await markAllNotificationsAsRead();


        setNotifications(
          (previous) =>
            previous.map(
              (notification) => ({
                ...notification,
                is_read: true,
              })
            )
        );


        setUnreadCount(0);

      } catch (error) {

        console.error(
          "Unable to mark all notifications:",
          error
        );

        setError(
          error?.response?.data?.detail ||
          "Unable to mark all notifications as read."
        );

      }

    };


  /* =====================================================
     DATE FORMATTER
  ===================================================== */

  const formatNotificationDate =
    (date) => {

      if (!date) {
        return "";
      }


      const notificationDate =
        new Date(date);

      const now =
        new Date();


      const difference =
        now.getTime() -
        notificationDate.getTime();


      const minutes =
        Math.floor(
          difference /
          (1000 * 60)
        );


      const hours =
        Math.floor(
          difference /
          (1000 * 60 * 60)
        );


      const days =
        Math.floor(
          difference /
          (1000 * 60 * 60 * 24)
        );


      if (minutes < 1) {
        return "Just now";
      }


      if (minutes < 60) {
        return `${minutes}m ago`;
      }


      if (hours < 24) {
        return `${hours}h ago`;
      }


      if (days < 7) {
        return `${days}d ago`;
      }


      return notificationDate.toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      );

    };


  /* =====================================================
     NOTIFICATION ICON
  ===================================================== */

  const getNotificationIcon =
    (type) => {

      switch (type) {

        case "application_status":
          return "📋";

        case "application_received":
          return "📨";

        default:
          return "🔔";

      }

    };


  return (

    <div
      className="notification-wrapper"
      ref={dropdownRef}
    >


      {/* =================================================
          BELL BUTTON
      ================================================= */}

      <button
        type="button"
        className={
          "notification-bell " +
          (
            unreadCount > 0
              ? "has-notifications"
              : ""
          )
        }
        onClick={() =>
          setOpen(
            (previous) =>
              !previous
          )
        }
        aria-label="Notifications"
        aria-expanded={open}
      >

        <span className="notification-bell-icon">
          🔔
        </span>


        {unreadCount > 0 && (

          <span className="notification-count">

            {unreadCount > 99
              ? "99+"
              : unreadCount}

          </span>

        )}

      </button>


      {/* =================================================
          DROPDOWN
      ================================================= */}

      {open && (

        <div className="notification-dropdown">


          {/* HEADER */}

          <div className="notification-dropdown-header">


            <div>

              <h3>
                Notifications
              </h3>


              {unreadCount > 0 ? (

                <span>
                  {unreadCount} unread
                </span>

              ) : (

                <span>
                  All caught up
                </span>

              )}

            </div>


            {unreadCount > 0 && (

              <button
                type="button"
                className="notification-mark-all"
                onClick={
                  handleMarkAllAsRead
                }
              >
                Mark all as read
              </button>

            )}


          </div>


          {/* ERROR */}

          {error &&
          notifications.length > 0 && (

            <div className="notification-error">

              <span>
                {error}
              </span>

              <button
                type="button"
                className="notification-retry"
                onClick={loadNotifications}
              >
                Retry
              </button>

            </div>

          )}


          {/* LOADING */}

          {loading &&
          notifications.length === 0 ? (

            <div className="notification-async-state">

              <AsyncState
                loading
                loadingMessage="Loading notifications..."
              />

            </div>

          ) : error &&
          notifications.length === 0 ? (

            <div className="notification-async-state">

              <AsyncState
                error={error}
                onRetry={loadNotifications}
              />

            </div>

          ) : notifications.length === 0 ? (


            /* EMPTY */

            <div className="notification-empty">


              <div className="notification-empty-icon">
                🔔
              </div>


              <strong>
                No notifications
              </strong>


              <span>
                Application updates will
                appear here.
              </span>


            </div>


          ) : (


            /* LIST */

            <div className="notification-list">


              {notifications
                .slice(0, 10)
                .map(
                  (notification) => (

                    <button
                      type="button"
                      className={
                        "notification-item " +
                        (
                          notification.is_read
                            ? "read"
                            : "unread"
                        )
                      }
                      key={
                        notification.id
                      }
                      onClick={() =>
                        handleNotificationClick(
                          notification
                        )
                      }
                    >


                      <div className="notification-item-icon">

                        {getNotificationIcon(
                          notification.notification_type
                        )}

                      </div>


                      <div className="notification-item-content">


                        <div className="notification-item-title-row">


                          <strong>

                            {notification.title}

                          </strong>


                          {!notification.is_read && (

                            <span className="notification-unread-dot" />

                          )}


                        </div>


                        <p>

                          {notification.message}

                        </p>


                        <span className="notification-time">

                          {formatNotificationDate(
                            notification.created_at
                          )}

                        </span>


                      </div>


                    </button>

                  )
                )}


            </div>

          )}


          {/* FOOTER */}

          {notifications.length > 10 && (

            <div className="notification-dropdown-footer">

              Showing the latest 10 notifications.

            </div>

          )}


        </div>

      )}


    </div>

  );

}


export default NotificationBell;