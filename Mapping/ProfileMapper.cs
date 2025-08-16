using AutoMapper;
using EmployeeApi.Contracts;
using DomainProfile = EmployeeApi.Domain.Profile;
namespace EmployeeApi.Mapping
{
    public class ApiMappingProfile : Profile
    {
        public ApiMappingProfile()
        {
            CreateMap<DomainProfile, ProfileResponse>();
        }
    }
}
