# PDF Editing App

A full-stack web application to upload, preview, edit, and export PDF files. Users can update text and metadata, and export PDFs as PDF, Word, or Images (ZIP).  

---

## Features

- Upload PDF files and preview them page by page.
- Edit text directly in the PDF.
- Update metadata including File Name, Author, and Title.
- Export PDF as:
  - PDF → save edited file as a new PDF.
  - Word → convert PDF into `.docx`.
  - Images → export each page as PNG/JPEG in a ZIP file.
- Basic user-friendly interface with React components.
- Responsive design and dropdown-based export options.

---

## Tech Stack

### Frontend
- **React.js** (v18+)
- **Axios** for API calls
- CSS for styling (no inline styles)

### Backend
- **ASP.NET Core Web API** (.NET 7)
- **Aspose.PDF** for PDF editing and export
- **C#** for business logic

### Database
- None required (file-based storage in `UploadedFiles` folder)

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- .NET 7 SDK
- Visual Studio 2022 / VS Code
- NuGet package: Aspose.PDF

### Backend
1. Clone the repository.
2. Navigate to `backend` folder.
3. Restore NuGet packages:  
   ```bash
   dotnet restore
