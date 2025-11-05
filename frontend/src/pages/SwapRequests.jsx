import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const SwapRequests = () => {
  const { user } = useAuth();
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const token = localStorage.getItem("token");

  //Fetch incoming requests (requests where you are receiver)
  const fetchIncoming = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/swaproute/requests/incoming`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIncoming(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //Fetch outgoing requests (requests you sent)
  const fetchOutgoing = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/swaproute/requests/outgoing`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutgoing(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncoming();
    fetchOutgoing();
  }, []);

  //Accept / Reject actions
  const handleResponse = async (requestId, action) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/swaproute/response`,
        { requestId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Request ${action.toLowerCase()}ed`);
      fetchIncoming();
      fetchOutgoing();
    } catch (err) {
      console.error(err);
      alert("Failed to update request");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Swap Requests</h3>

        {/*Incoming Requests */}
        <h5>Incoming Requests</h5>
        {incoming.length > 0 ? (
          <ul className="list-group mb-4">
            {incoming.map((req) => (
              <li
                key={req._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{req.requesterId?.name || "Someone"}</strong> wants to swap:
                  <br />
                  <small>
                    Their slot: {req.theirSlotId?.title} <br />
                    Your slot: {req.mySlotId?.title}
                  </small>
                  <br />
                  <span
                    className={`badge ${
                      req.status === "PENDING"
                        ? "bg-warning text-dark"
                        : req.status === "ACCEPTED"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>

                {req.status === "PENDING" && (
                  <div>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleResponse(req._id, "ACCEPTED")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleResponse(req._id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No incoming requests</p>
        )}

        {/*Outgoing Requests */}
        <h5>Outgoing Requests</h5>
        {outgoing.length > 0 ? (
          <ul className="list-group">
            {outgoing.map((req) => (
              <li
                key={req._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  To: <strong>{req.receiverId?.name || "Unknown"}</strong> <br />
                  <small>
                    You offered: {req.mySlotId?.title} <br />
                    For: {req.theirSlotId?.title}
                  </small>
                </div>
                <span
                  className={`badge ${
                    req.status === "PENDING"
                      ? "bg-warning text-dark"
                      : req.status === "ACCEPTED"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {req.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No outgoing requests</p>
        )}
      </div>
    </div>
  );
};


export default SwapRequests;