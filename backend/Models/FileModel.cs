namespace backend.Models
{
    public class FileModel
    {
        public string FileName { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
    }

    public class PdfEditRequest
    {
        public string FileName { get; set; }
        public List<TextEdit> TextEdits { get; set; }
    }

    public class TextEdit
    {
        public int PageNumber { get; set; }
        public string OldText { get; set; }
        public string NewText { get; set; }
    }



    public class PdfMetadataEditRequest
    {
        public string FileName { get; set; }
        public string NewFileName { get; set; }
        public string Author { get; set; }
        public string Title { get; set; }
    }

}
