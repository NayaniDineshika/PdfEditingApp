import React, { useState } from "react";
import api from "../services/api";
import PdfPreview from "./PdfPreview";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/api/pdf/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Upload successful!");
      setUploadedFileName(res.data.fileName); 
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div >
      <h2>Upload and Preview PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} /><br></br><br></br>
      <button className ="main-button" onClick={handleUpload}>Upload & Preview</button> <br></br><br></br>

      {uploadedFileName && (
        <PdfPreview fileName={uploadedFileName} /> 
      )}

    </div>
  );
}
