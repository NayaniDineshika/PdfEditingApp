import React, { useState, useEffect } from "react";
import api from "../services/api";
import PdfEditor from "./PdfEditor";
import PdfMetadata from "./PdfMetadata";
import PdfExport from "./PdfExport";

const PdfPreview = ({ fileName }) => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [reload, setReload] = useState(false);
  const [currentFileName, setCurrentFileName] = useState(fileName);

  useEffect(() => {
    if (currentFileName) {
      const encodedFileName = encodeURIComponent(currentFileName);
      api
        .get(`/api/pdf/preview/${encodedFileName}`)
        .then((res) => {
          setPages(res.data);
          setCurrentPage(0);
        })
        .catch((err) => console.error("Error loading PDF preview", err));
    }
  }, [currentFileName, reload]);

  if (pages.length === 0) return <p>Loading preview...</p>;

  return (
    <div>
      <div className="container">
        <div className="left">
          <PdfEditor
            fileName={currentFileName}
            onEdited={() => setReload(!reload)}
          />
          <PdfMetadata
        fileName={currentFileName}
        onUpdated={(updatedFileName) => setCurrentFileName(updatedFileName)}
      />
      <PdfExport fileName={currentFileName} />
        </div>
        <div className="right">
          <div className="pdf-preview-container">
            <img src={pages[currentPage]} alt={`Page ${currentPage + 1}`} />
            
          </div>
          <div style={{ marginTop: 10 }}>
              <button
                className="pdf-button"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <span style={{ margin: "0 15px" }}>
                Page {currentPage + 1} of {pages.length}
              </span>
              <button
                className="pdf-button"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage === pages.length - 1}
              >
                Next
              </button>
            </div>
        </div>
      </div>

      
    </div>
  );
};

export default PdfPreview;
