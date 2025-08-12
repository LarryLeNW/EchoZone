using AutoMapper;
using EmployeeApi.Data;
using EmployeeApi.DTOs;

namespace EmployeeApi.Profiles;

public class EmployeeProfile : Profile
{
    public EmployeeProfile()
    {
        CreateMap<Employee, EmployeeDto>();
        CreateMap<CreateEmployeeDto, Employee>()
            .ForMember(d => d.HiredAt, opt => opt.MapFrom(_ => DateTime.UtcNow));
        CreateMap<UpdateEmployeeDto, Employee>();
    }
}
