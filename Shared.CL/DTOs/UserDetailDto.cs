using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.CL.DTOs
{
    public record UserDetailCreateDto
    {
        public int UserId { get; init; }

        public string? Fullname { get; init; }

        public string? PhotoUrl { get; init; }

        public string? Address { get; init; }

        public string? Phone { get; init; }
    }

    public record UserDetailUpdateDto(int Id) : UserDetailCreateDto;

    public record UserDetailViewDto : UserDetailUpdateDto
    {
        public UserDetailViewDto(int Id) : base(Id)
        {
        }
    }

    public record UserPasswordChangeDto(int UserId, string NewPassword);
}
