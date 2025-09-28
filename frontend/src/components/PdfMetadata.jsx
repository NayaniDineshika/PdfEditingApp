import React, { useEffect, useState } from "react";
import api from "../services/api";

const PdfMetadata = ({ fileName, onUpdated }) => {
  const [metadata, setMetadata] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (fileName) {
      const encodedFileName = encodeURIComponent(fileName);
      api
        .get(`/api/pdf/metadata/${encodedFileName}`)
        .then((res) => setMetadata(res.data))
        .catch((err) => console.error("Error fetching metadata", err));
    }
  }, [fileName]);

  if (!metadata) return <p>Loading metadata...</p>;

  const handleSave = async () => {
    try {
      await api.post("/api/pdf/edit-metadata", {
        fileName,
        newFileName: metadata.fileName, 
        author: metadata.author,
        title: metadata.title,
      });
      alert("Metadata saved successfully!");
      setIsEditing(false);
      if (onUpdated) onUpdated(metadata.fileName);
    } catch (err) {
      console.error("Error saving metadata", err);
      alert("Failed to save metadata");
    }
  };

  return (
    <div style={{ marginTop: "20px", textAlign: "left" }}>
      <h3>PDF Metadata</h3>

      <div>
        <strong>File Name:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={metadata.fileName || ""}
            onChange={(e) => setMetadata({ ...metadata, fileName: e.target.value })}
          />
        ) : (
          metadata.fileName
        )}
      </div>

      <div>
        <strong>Author:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={metadata.author}
            onChange={(e) => setMetadata({ ...metadata, author: e.target.value })}
          />
        ) : (
          metadata.author
        )}
      </div>

      <div>
        <strong>Title:</strong>{" "}
        {isEditing ? (
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
          />
        ) : (
          metadata.title
        )}
      </div>

      <div>
        <strong>Creation Date:</strong> {new Date(metadata.creationDate).toLocaleString()}
      </div>

      <div>
        <strong>Modify Date:</strong> {new Date(metadata.modifyDate).toLocaleString()}
      </div>

      <div style={{ marginTop: "10px" }}>
        {!isEditing ? (
          <button className="sub-button"  onClick={() => setIsEditing(true)}>Update Metadata</button>
        ) : (
          <>
            <button className="sub-button" onClick={handleSave}>Save Metadata</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfMetadata;

