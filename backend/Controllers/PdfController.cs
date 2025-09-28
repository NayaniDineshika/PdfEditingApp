using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class PdfController : ControllerBase
{
    private readonly IPdfService _pdfService;

    public PdfController(IPdfService pdfService)
    {
        _pdfService = pdfService;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
        => file == null ? BadRequest("No file selected") : Ok(await _pdfService.SaveFileAsync(file));

    [HttpGet("preview/{fileName}")]
    public IActionResult Preview(string fileName)
        => Ok(_pdfService.GeneratePreview(fileName));

    [HttpPost("edit")]
    public async Task<IActionResult> Edit([FromBody] PdfEditRequest request)
    {
        await _pdfService.EditPdfAsync(request.FileName, request);
        return Ok("PDF edited successfully");
    }

    [HttpGet("metadata/{fileName}")]
    public IActionResult GetMetadata(string fileName)
        => Ok(_pdfService.GetMetadata(fileName));

    [HttpPost("edit-metadata")]
    public async Task<IActionResult> EditMetadata([FromBody] PdfMetadataEditRequest request)
    {
        await _pdfService.EditMetadataAsync(request);
        return Ok(new { message = "Metadata updated successfully", fileName = request.NewFileName ?? request.FileName });
    }

    [HttpGet("export/{fileName}")]
    public IActionResult Export(string fileName, [FromQuery] string format)
    {
        try
        {
            var data = _pdfService.ExportPdf(fileName, format);
            string contentType = format.ToLower() switch
            {
                "pdf" => "application/pdf",
                "word" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "images" => "application/zip",
                _ => throw new ArgumentException("Invalid format")
            };

            string outputName = format.ToLower() == "images"
                ? Path.GetFileNameWithoutExtension(fileName) + ".zip"
                : Path.GetFileNameWithoutExtension(fileName) + (format.ToLower() == "pdf" ? "_edited.pdf" : ".docx");

            return File(data, contentType, outputName);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
