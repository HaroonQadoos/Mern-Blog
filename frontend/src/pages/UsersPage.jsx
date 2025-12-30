import React, { useEffect, useState } from "react";
import api from "../api/axios";

const UsersPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState([]); // track loading per user

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
      setLoadingIds((prev) => [...prev, id]); // mark user as loading

      const endpoint =
        action === "approve" ? `/admin/approve/${id}` : `/admin/reject/${id}`;

      await api.patch(endpoint);

      // Remove user from loading
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
        // For reject, move approved back to pending OR remove from pending
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
      <div className="min-h-screen flex items-center justify-center">
        Loading users...
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto p-6 space-y-8">
      {/* ================= Pending Requests ================= */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Pending User Requests</h1>

        {pendingUsers.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded-4xl"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleUserAction(user._id, "approve")}
                    disabled={loadingIds.includes(user._id)}
                    className={`px-3 py-1 rounded-2xl transition cursor-pointer ${
                      loadingIds.includes(user._id)
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-black/90 text-white hover:bg-green-500"
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
                        : "bg-black/50 text-white hover:bg-red-500"
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
        <h1 className="text-3xl font-bold mb-6">Active Users</h1>

        {activeUsers.length === 0 ? (
          <p className="text-gray-500">No active users.</p>
        ) : (
          <div className="space-y-4">
            {activeUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border rounded-4xl bg-gray-50"
              >
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="flex justify-end space-x-1">
                  <span className="text-green-600 font-semibold">Approved</span>{" "}
                  <button
                    onClick={() => handleUserAction(user._id, "reject")}
                    className="px-3 py-1 bg-black/50 text-white rounded-2xl hover:bg-red-500 transition cursor-pointer"
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
