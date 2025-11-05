import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });

  //Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) fetchEvents();
  }, [user]);

  //Add a new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/events`,
        newEvent,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEvents([...events, res.data]);
      setNewEvent({ title: "", startTime: "", endTime: "" });
      const modal = document.getElementById("addEventModal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    } catch (err) {
      console.error(err);
    }
  };

  //Toggle between BUSY & SWAPPABLE
  const toggleSwappable = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "BUSY" ? "SWAPPABLE" : "BUSY";

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/events/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents(events.map((e) => (e._id === id ? res.data : e)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Welcome, {user?.name}</h3>
        <p className="text-center text-muted">Email: {user?.email}</p>

        <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
          <h5>Your Events</h5>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addEventModal"
          >
            + Add Event
          </button>
        </div>

        {events.length > 0 ? (
          <ul className="list-group">
            {events.map((e) => (
              <li
                key={e._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{e.title}</strong> <br />
                  <small>
                    {new Date(e.startTime).toLocaleString()} —{" "}
                    {new Date(e.endTime).toLocaleString()}
                  </small>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge ${
                      e.status === "SWAPPABLE" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {e.status}
                  </span>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => toggleSwappable(e._id, e.status)}
                  >
                    {e.status === "BUSY" ? "Make Swappable" : "Revert to Busy"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted mt-3">No events yet.</p>
        )}

        <Link to="/">
        <button onClick={logout} className="btn btn-danger mt-4">
          Logout
        </button>
        </Link>
      </div>

      {/* Add Event Modal */}
      <div
        className="modal fade"
        id="addEventModal"
        tabIndex="-1"
        aria-labelledby="addEventModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addEventModalLabel">
                Add New Event
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleAddEvent}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Start Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newEvent.startTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, startTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">End Time</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={newEvent.endTime}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, endTime: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
