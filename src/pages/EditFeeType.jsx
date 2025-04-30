import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFeeTypeById, updateFeeType } from "../services/Feeapi";

export default function EditFeeType() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeeType = async () => {
      try {
        const { data } = await getFeeTypeById(id);
        setName(data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeType();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateFeeType(id, name);
      navigate.push("/");
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    }
  };

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error)
    return <div className="container mt-4 alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h1>Edit Fee Type</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "500px" }}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary">
          Update
        </button>
      </form>
    </div>
  );
}
