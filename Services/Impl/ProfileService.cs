using AutoMapper;
using EmployeeApi.Contracts;
using EmployeeApi.Repositories;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeApi.Services;

public class ProfileService(IProfileRepository repo, AutoMapper.IMapper mapper) : IProfileService
{
    public async Task<ProfileResponse?> GetMeAsync(Guid userId, CancellationToken ct = default)
    {
        var p = await repo.GetByUserIdAsync(userId, ct);
        return p is null ? null : mapper.Map<ProfileResponse>(p);
    }

    public async Task UpdateMeAsync(Guid userId, UpdateProfileRequest req, CancellationToken ct = default)
    {
        var p = await repo.GetByUserIdAsync(userId, ct) ?? throw new KeyNotFoundException("Profile không tồn tại");
        if (req.DisplayName != null) p.DisplayName = req.DisplayName;
        if (req.Bio != null) p.Bio = req.Bio;
        if (req.AvatarUrl != null) p.AvatarUrl = req.AvatarUrl;
        if (req.IsPrivate.HasValue) p.IsPrivate = req.IsPrivate.Value;
        await repo.UpdateAsync(p, ct);
    }

    public async Task<ProfileResponse?> GetByHandleAsync(string handle, CancellationToken ct)
    {
        var p = await repo.GetByHandle(handle, ct);
        return p is null ? null : mapper.Map<ProfileResponse>(p);
    }
}
