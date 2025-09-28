using Aspose.Pdf;
using Aspose.Pdf.Devices;
using Aspose.Pdf.Text;
using backend.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.IO.Compression;

namespace backend.Services
{
    public class PdfService : IPdfService
    {
        private readonly string _uploadsFolder;
        private readonly IWebHostEnvironment _env;

        public PdfService(IWebHostEnvironment env)
        {
            _env = env;
            _uploadsFolder = Path.Combine(env.ContentRootPath, "uploads");
            if (!Directory.Exists(_uploadsFolder))
                Directory.CreateDirectory(_uploadsFolder);
        }

        public async Task<FileModel> SaveFileAsync(IFormFile file)
        {
            var safeFileName = Path.GetFileNameWithoutExtension(file.FileName)
                                    .Replace(" ", "_")
                                    .Replace("(", "")
                                    .Replace(")", "")
                               + Path.GetExtension(file.FileName);

            string filePath = Path.Combine(_uploadsFolder, safeFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
                await file.CopyToAsync(stream);

            return new FileModel
            {
                FileName = safeFileName,
                FileUrl = $"/uploads/{safeFileName}"
            };
        }

        public List<string> GeneratePreview(string fileName)
        {
            string filePath = Path.Combine(_uploadsFolder, fileName);
            if (!File.Exists(filePath))
                throw new FileNotFoundException("PDF file not found.", filePath);

            var pdfDocument = new Document(filePath);
            var images = new List<string>();

            for (int i = 1; i <= pdfDocument.Pages.Count; i++)
            {
                using var ms = new MemoryStream();
                var pngDevice = new PngDevice(new Resolution(150));
                pngDevice.Process(pdfDocument.Pages[i], ms);
                images.Add($"data:image/png;base64,{Convert.ToBase64String(ms.ToArray())}");
            }

            return images;
        }

        public async Task EditPdfAsync(string fileName, PdfEditRequest request)
        {
            string filePath = Path.Combine(_uploadsFolder, fileName);
            if (!File.Exists(filePath)) throw new FileNotFoundException("PDF not found.");

            var pdfDocument = new Document(filePath);

            if (request.TextEdits != null)
            {
                foreach (var edit in request.TextEdits)
                {
                    var absorber = new TextFragmentAbsorber(edit.OldText);
                    pdfDocument.Pages[edit.PageNumber].Accept(absorber);
                    foreach (TextFragment fragment in absorber.TextFragments)
                        fragment.Text = edit.NewText;
                }
            }

            pdfDocument.Save(filePath);
            await Task.CompletedTask;
        }

        public object GetMetadata(string fileName)
        {
            string filePath = Path.Combine(_uploadsFolder, fileName);
            if (!File.Exists(filePath)) throw new FileNotFoundException("PDF not found.");

            var pdf = new Document(filePath);
            return new
            {
                FileName = fileName,
                pdf.Info.CreationDate,
                ModifyDate = File.GetLastWriteTime(filePath),
                Author = pdf.Info.Author ?? "N/A",
                Title = pdf.Info.Title ?? "N/A"
            };
        }
        public async Task EditMetadataAsync(PdfMetadataEditRequest request)
        {
            string filePath = Path.Combine(_uploadsFolder, request.FileName);
            if (!File.Exists(filePath)) throw new FileNotFoundException("PDF not found.");

            var pdfDocument = new Document(filePath);

            if (!string.IsNullOrEmpty(request.Author))
                pdfDocument.Info.Author = request.Author;
            if (!string.IsNullOrEmpty(request.Title))
                pdfDocument.Info.Title = request.Title;

            pdfDocument.Info.ModDate = DateTime.Now;

            string finalPath = filePath;
            if (!string.IsNullOrEmpty(request.NewFileName) &&
                request.NewFileName != request.FileName)
            {
                finalPath = Path.Combine(_uploadsFolder, request.NewFileName);
                if (!finalPath.EndsWith(".pdf")) finalPath += ".pdf";
                File.Move(filePath, finalPath, true);
            }

            pdfDocument.Save(finalPath);
            await Task.CompletedTask;
        }

        public byte[] ExportPdf(string fileName, string format)
        {
            string filePath = Path.Combine(_uploadsFolder, fileName);
            if (!File.Exists(filePath)) throw new FileNotFoundException("PDF not found.");

            var doc = new Document(filePath);
            using var ms = new MemoryStream();

            switch (format.ToLower())
            {
                case "pdf":
                    doc.Save(ms, SaveFormat.Pdf);
                    break;

                case "word":
                    doc.Save(ms, SaveFormat.DocX);
                    break;

                case "images":
                    using (var zipStream = new MemoryStream())
                    {
                        using var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true);
                        for (int i = 1; i <= doc.Pages.Count; i++)
                        {
                            using var imageStream = new MemoryStream();
                            new JpegDevice(new Resolution(150), 100).Process(doc.Pages[i], imageStream);
                            var entry = archive.CreateEntry($"page_{i}.jpg");
                            using var entryStream = entry.Open();
                            imageStream.Position = 0;
                            imageStream.CopyTo(entryStream);
                        }
                        return zipStream.ToArray();
                    }

                default:
                    throw new ArgumentException("Invalid export format.");
            }

            return ms.ToArray();
        }
    }
}
