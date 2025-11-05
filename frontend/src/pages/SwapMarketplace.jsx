import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const SwapMarketplace = () => {
  const { user } = useAuth();
  const [swappableSlots, setSwappableSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState("");

  // Fetch available slots from other users
  const fetchSwappableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/swaproute/swappable`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSwappableSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  //Fetch user's own swappable slots
  const fetchMySwappableSlots = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMySwappable(res.data.filter((e) => e.status === "SWAPPABLE"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
    fetchMySwappableSlots();
  }, []);

  //Request swap
  const handleSwapRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/swaproute/request`,
        {
          mySlotId: selectedMySlot,
          theirSlotId: selectedSlot._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Swap request sent!");
      setSelectedSlot(null);
      setSelectedMySlot("");
    } catch (err) {
      console.error(err);
      alert("Swap request failed");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="text-center mb-4">Swap Marketplace</h3>

        {swappableSlots.length > 0 ? (
          <ul className="list-group">
            {swappableSlots.map((slot) => (
              <li
                key={slot._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{slot.title}</strong> <br />
                  <small>
                    {new Date(slot.startTime).toLocaleString()} —{" "}
                    {new Date(slot.endTime).toLocaleString()}
                  </small>
                </div>
                <button
                  className="btn btn-outline-primary btn-sm"
                  data-bs-toggle="modal"
                  data-bs-target="#swapModal"
                  onClick={() => setSelectedSlot(slot)}
                >
                  Request Swap
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center mt-3">
            No swappable slots from other users yet.
          </p>
        )}
      </div>

      {/*Swap model*/}
      <div
        className="modal fade"
        id="swapModal"
        tabIndex="-1"
        aria-labelledby="swapModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSwapRequest}>
              <div className="modal-header">
                <h5 className="modal-title" id="swapModalLabel">
                  Offer One of Your Slots
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                {selectedSlot && (
                  <div className="mb-3">
                    <strong>Requested Slot:</strong>
                    <p>
                      {selectedSlot.title} <br />
                      <small>
                        {new Date(selectedSlot.startTime).toLocaleString()} —{" "}
                        {new Date(selectedSlot.endTime).toLocaleString()}
                      </small>
                    </p>
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Choose Your Slot</label>
                  <select
                    className="form-select"
                    required
                    value={selectedMySlot}
                    onChange={(e) => setSelectedMySlot(e.target.value)}
                  >
                    <option value="">
                      -- Select one of your swappable slots --
                    </option>
                    {mySwappable.map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {slot.title} (
                        {new Date(slot.startTime).toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Send Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapMarketplace;
