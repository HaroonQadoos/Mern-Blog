import React, { useEffect, useState } from "react";
import api from "../api/axios";

const UsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [pendingRes, activeRes] = await Promise.all([
          api.get("/admin/pending-users"),
          api.get("/admin/active-users"),
        ]);
        setPendingUsers(pendingRes.data);
        setActiveUsers(activeRes.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleUserAction = async (id, action) => {
    try {
      setLoadingIds((prev) => [...prev, id]);
      const endpoint =
        action === "approve" ? `/admin/approve/${id}` : `/admin/reject/${id}`;
      await api.patch(endpoint);
      setLoadingIds((prev) => prev.filter((userId) => userId !== id));

      if (action === "approve") {
        const approvedUser = pendingUsers.find((u) => u._id === id);
        if (approvedUser) {
          setActiveUsers((prev) => [
            ...prev,
            { ...approvedUser, status: "approved" },
          ]);
        }
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
      } else {
        const rejectedUserPending = pendingUsers.find((u) => u._id === id);
        if (!rejectedUserPending) {
          const rejectedUserActive = activeUsers.find((u) => u._id === id);
          if (rejectedUserActive) {
            setActiveUsers((prev) => prev.filter((u) => u._id !== id));
            setPendingUsers((prev) => [
              ...prev,
              { ...rejectedUserActive, status: "pending" },
            ]);
          }
        } else {
          setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        }
      }
    } catch (err) {
      setLoadingIds((prev) => prev.filter((userId) => userId !== id));
      console.error(err);
      alert(`Failed to ${action} user`);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-navy)", color: "var(--navy)" }}
      >
        Loading users...
      </div>
    );
  }

  return (
    <div
      className="max-w-[900px] mx-auto px-4 sm:px-6 md:px-8 py-6 space-y-8"
      style={{ backgroundColor: "var(--bg-color)", color: "var(--navy)" }}
    >
      {/* ================= Pending Requests ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-navy">
          Pending User Requests
        </h1>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-4 ">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className=" transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-4xl gap-2 sm:gap-0 shadow-md"
                style={{
                  backgroundColor: "var(--navy-card)",
                  color: "var(--navy)",
                }}
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button
                    onClick={() => handleUserAction(user._id, "approve")}
                    disabled={loadingIds.includes(user._id)}
                    className={`px-3 py-1 rounded-2xl transition cursor-pointer ${
                      loadingIds.includes(user._id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-[#1c2541] hover:bg-[#1c2541]/80 text-white"
                    }`}
                  >
                    {loadingIds.includes(user._id)
                      ? "Processing..."
                      : "Approve"}
                  </button>
                  <button
                    onClick={() => handleUserAction(user._id, "reject")}
                    disabled={loadingIds.includes(user._id)}
                    className={`px-3 py-1 rounded-2xl transition cursor-pointer ${
                      loadingIds.includes(user._id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-red-600 hover:bg-red-500 text-white"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= Active Users ================= */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-navy">
          Active Users
        </h1>

        {activeUsers.length === 0 ? (
          <p className="text-gray-500">No active users.</p>
        ) : (
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div
                key={user._id}
                className="transition-transform duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-4xl gap-2 sm:gap-0 shadow-md"
                style={{
                  backgroundColor: "var(--navy-card)",
                  color: "var(--navy)",
                }}
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm truncate">{user.email}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <span className="text-[#1c2541]/50 font-semibold">
                    Approved
                  </span>
                  <button
                    onClick={() => handleUserAction(user._id, "reject")}
                    className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-2xl transition cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
