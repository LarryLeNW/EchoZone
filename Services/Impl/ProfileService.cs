using AutoMapper;
using EmployeeApi.Contracts;
using EmployeeApi.Repositories;

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
        p.DisplayName = req.DisplayName;
        p.Bio = req.Bio;
        p.AvatarUrl = req.AvatarUrl;
        if (req.IsPrivate.HasValue) p.IsPrivate = req.IsPrivate.Value;
        repo.Update(p);
        await Task.CompletedTask;
    }
}
