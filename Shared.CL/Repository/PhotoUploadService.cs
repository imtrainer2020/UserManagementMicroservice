using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.Repository
{
    public class FileUploadSettings
    {
        public string UploadPath { get; set; } = "wwwroot/uploads/photos";
        public int MaxFileSizeMB { get; set; } = 5;
        public List<string> AllowedExtensions { get; set; } = new List<string>() { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    }

    public class PhotoUploadService : IPhotoUploadService
    {
        private readonly FileUploadSettings _settings;
        private readonly IWebHostEnvironment _env;

        public PhotoUploadService(IOptions<FileUploadSettings> settings, IWebHostEnvironment env)
        {
            _settings = settings.Value;
            _env = env;
        }

        public async Task<string?> SavePhotoAsync(IFormFile file)
        {
            // Validate size
            long maxBytes = _settings.MaxFileSizeMB * 1024 * 1024;
            if (file.Length > maxBytes)
                throw new Exception($"File size exceeds {_settings.MaxFileSizeMB}MB limit.");

            // Validate extension
            string ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!_settings.AllowedExtensions.Contains(ext))
                throw new Exception($"File type '{ext}' is not allowed.");

            // Build physical path
            string physicalFolder = Path.Combine(_env.ContentRootPath, _settings.UploadPath);
            Directory.CreateDirectory(physicalFolder); // ensure folder exists

            // Unique filename: user_{userId}_{guid}{ext}
            string fileName = $"{Guid.NewGuid():N}{ext}";
            string fullPath = Path.Combine(physicalFolder, fileName);

            // Save file
            using var stream = new FileStream(fullPath, FileMode.Create);
            await file.CopyToAsync(stream);

            // Return relative URL (for serving via static files)
            return $"/uploads/photos/{fileName}";
        }

        public bool DeletePhoto(string? photoUrl)
        {
            if (string.IsNullOrWhiteSpace(photoUrl)) return false;

            // Convert URL path → physical path
            string relativePath = photoUrl.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            string fullPath = Path.Combine(_env.ContentRootPath, "wwwroot", relativePath);

            if (File.Exists(fullPath))
            {
                File.Delete(fullPath);
                return true;
            }
            return false;
        }
    }
}
