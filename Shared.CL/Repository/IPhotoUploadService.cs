using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.Repository
{
    public interface IPhotoUploadService
    {
        Task<string?> SavePhotoAsync(IFormFile file);
        bool DeletePhoto(string? photoUrl);
    }
}
