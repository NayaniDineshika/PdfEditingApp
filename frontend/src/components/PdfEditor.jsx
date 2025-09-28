import React, { useState } from "react";
import api from "../services/api";

const PdfEditor = ({ fileName, onEdited }) => {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = {
      fileName,
      textEdits: [
        {
          oldText,
          newText,
          pageNumber: parseInt(pageNumber),
        },
      ],
    };

    try {
      await api.post("/api/pdf/edit", request);
      alert("PDF updated successfully!");
      onEdited();
    } catch (error) {
      console.error(error);
      alert("Failed to edit PDF");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Edit PDF</h3>
      <div>
        <label>Old Text: </label>
        <input
          type="text"
          value={oldText}
          onChange={(e) => setOldText(e.target.value)}
          required
        />
      </div>
      <div>
        <label>New Text: </label>
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Page Number: </label>
        <input
          type="number"
          value={pageNumber}
          onChange={(e) => setPageNumber(e.target.value)}
          min="1"
          required
        />
      </div>
      <button className="sub-button" type="submit">Apply Edit</button>
    </form>
  );
};

export default PdfEditor;
