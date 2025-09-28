import React from "react";
import api from "../services/api";

const PdfExport = ({ fileName }) => {  
  const handleDownload = async (format) => {
    try {
      const encodedFileName = encodeURIComponent(fileName);
      const response = await api.get(
        `/api/pdf/export/${encodedFileName}?format=${format}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data]);
      let suggestedName = fileName;
      let accept = {};

      if (format === "pdf") {
        suggestedName = `${fileName}.pdf`;
        accept = { "application/pdf": [".pdf"] };
      } else if (format === "word") {
        suggestedName = `${fileName}.docx`;
        accept = { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] };
      } else if (format === "images") {
        suggestedName = `${fileName}.zip`;
        accept = { "application/zip": [".zip"] };
      }

      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName,
          types: [{ description: `${format.toUpperCase()} file`, accept }],
        });

        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        alert("File saved successfully!");
      } else {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", suggestedName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Failed to download file.");
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Export & Download</h3>
      <select className="sub-button"
        onChange={(e) => {
          if (e.target.value) {
            handleDownload(e.target.value);
            e.target.value = "";
          }
        }}
        defaultValue=""
      >
        <option className="sub-button" value="" disabled>Select format</option>
        <option className="sub-button" value="pdf">PDF</option>
        <option className="sub-button" value="word">Word (.docx)</option>
        <option className="sub-button" value="images">Images (ZIP)</option>
      </select>
    </div>
  );
};

export default PdfExport; 
