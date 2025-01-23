using AutoMapper;
using LearningAPI.Models;
using System.Security.Cryptography;
//using LearningAPI.Reference;

namespace LearningAPI
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Tutorial, TutorialDTO>();
            CreateMap<User, UserDTO>();
            CreateMap<Resource, ResourceDTO>();
            CreateMap<ResourceType, ResourceTypeDTO>();
            CreateMap<Policies, PoliciesDTO>();
            CreateMap<Attributes, AttributesDTO>();
            CreateMap<UserAttributes, UserAttributesDTO>();
            CreateMap<SustainabilityGoal, SustainabilityGoalDTO>();
        }
    }
}
