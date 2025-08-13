using AutoMapper;
using EmployeeApi.Contracts;
namespace EmployeeApi.Mapping;

public class ApiMappingProfile : Profile           
{
    public ApiMappingProfile()
    {
        CreateMap<Profile, ProfileResponse>(); 
    }
}
