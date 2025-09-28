using backend.Models;

namespace backend.Services
{
    public interface IPdfService
    {
        Task<FileModel> SaveFileAsync(IFormFile file);
        List<string> GeneratePreview(string fileName);
        Task EditPdfAsync(string fileName, PdfEditRequest request);
        Task EditMetadataAsync(PdfMetadataEditRequest request);
        byte[] ExportPdf(string fileName, string format);
        object GetMetadata(string fileName);
    }
}
