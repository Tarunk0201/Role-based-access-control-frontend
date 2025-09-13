import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../api";

const Admin = () => {
  const { token } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [agentsLoading, setAgentsLoading] = useState(false);

  const fetchLeads = async () => {
    if (!token) {
      setError("No token available");
      setLoading(false);
      return;
    }
    console.log("Fetching leads with token:", token);
    try {
      const response = await fetch(getApiUrl("/leads"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLeads(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    setAgentsLoading(true);
    try {
      const response = await fetch(getApiUrl("/leads/agents"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      console.error("Error fetching agents:", err);
    } finally {
      setAgentsLoading(false);
    }
  };

  const handleAssignClick = (leadId) => {
    setSelectedLeadId(leadId);
    setShowModal(true);
    fetchAgents();
  };

  const handleAssignSubmit = async () => {
    if (!selectedAgentId) {
      alert("Please select an agent");
      return;
    }
    try {
      const response = await fetch(getApiUrl("/leads/assign"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId: selectedAgentId,
          leadId: selectedLeadId,
        }),
      });
      if (response.ok) {
        alert("Lead assigned successfully!");
        setShowModal(false);
        setSelectedAgentId(null);
        fetchLeads();
      } else {
        alert("Failed to assign lead");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [token]);

  if (loading) {
    return <div className="text-center mt-10">Loading leads...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Admin Dashboard
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Leads List
        </h2>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {lead.id}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {lead.name}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {lead.address}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                          lead.status === "new"
                            ? "text-blue-900"
                            : lead.status === "assigned"
                            ? "text-green-900"
                            : "text-red-900"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 opacity-50 rounded-full ${
                            lead.status === "new"
                              ? "bg-blue-200"
                              : lead.status === "assigned"
                              ? "bg-green-200"
                              : "bg-red-200"
                          }`}
                        ></span>
                        <span className="relative">{lead.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {lead.status === "assigned" ? (
                        ""
                      ) : (
                        <button
                          onClick={() => handleAssignClick(lead.id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Assign
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-5 text-center text-gray-500 bg-white text-sm"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold mb-4">Select Agent</h3>
            {agentsLoading ? (
              <div>Loading agents...</div>
            ) : (
              <div>
                {agents.map((agent) => (
                  <div key={agent.id} className="mb-2">
                    <input
                      type="radio"
                      id={`agent-${agent.id}`}
                      name="agent"
                      value={agent.id}
                      onChange={(e) =>
                        setSelectedAgentId(parseInt(e.target.value))
                      }
                    />
                    <label htmlFor={`agent-${agent.id}`} className="ml-2">
                      {agent.name} ({agent.email})
                    </label>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
