import React, { useState } from "react";
import "./App.css";

function App() {
  const [leaves, setLeaves] = useState(() => {
  const savedLeaves = localStorage.getItem("leaves");
  return savedLeaves ? JSON.parse(savedLeaves) : [];
});
  const [type, setType] = useState("Casual Leave");
  const [reason, setReason] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [casual, setCasual] = useState(12);
  const [medical, setMedical] = useState(10);

  const applyLeave = (e) => {
    e.preventDefault();

    if (!reason || !from || !to) {
      alert("Please fill all the fields");
      return;
    }

    if (to < from) {
      alert("End date cannot be before start date");
      return;
    }

    const newLeave = {
      id: Date.now(),
      type,
      reason,
      from,
      to,
      status: "Pending"
    };

    const updatedLeaves = [...leaves, newLeave];

setLeaves(updatedLeaves);

localStorage.setItem("leaves", JSON.stringify(updatedLeaves));

    if (type === "Casual Leave") {
      setCasual(Math.max(0, casual - 1));
    } else {
      setMedical(Math.max(0, medical - 1));
    }

    setReason("");
    setFrom("");
    setTo("");

    alert("Leave application submitted successfully!");
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>LeaveEase</h2>
        <p>Employee Portal</p>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#apply">Apply Leave</a>
          <a href="#history">Leave History</a>
        </nav>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>Employee Dashboard</h1>
            <p>Welcome back! Manage your leaves here.</p>
          </div>
          <button onClick={() => window.location.reload()}>
            Refresh
          </button>
        </header>

        <section className="cards" id="dashboard">
          <div className="card">
            <h3>Casual Leave</h3>
            <h1>{casual}</h1>
            <p>Available days</p>
          </div>

          <div className="card">
            <h3>Medical Leave</h3>
            <h1>{medical}</h1>
            <p>Available days</p>
          </div>

          <div className="card">
            <h3>Total Applications</h3>
            <h1>{leaves.length}</h1>
            <p>Submitted requests</p>
          </div>
        </section>

        <section className="form-section" id="apply">
          <h2>Apply for Leave</h2>

          <form onSubmit={applyLeave}>
            <label>Leave Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Casual Leave</option>
              <option>Medical Leave</option>
            </select>

            <label>From Date</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />

            <label>To Date</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              min={from || undefined}
              required
            />

            <label>Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter your reason for leave"
              required
            />

            <button type="submit">Submit Application</button>
          </form>
        </section>

        <section className="history" id="history">
          <h2>Leave History</h2>

          {leaves.length === 0 ? (
            <p>No leave applications yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.type}</td>
                    <td>{leave.from}</td>
                    <td>{leave.to}</td>
                    <td>{leave.reason}</td>
                    <td>{leave.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;