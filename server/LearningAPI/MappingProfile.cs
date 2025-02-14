using AutoMapper;
using LearningAPI.Models;

namespace LearningAPI
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>();
            CreateMap<User, UserBasicDTO>();
            CreateMap<SustainabilityGoal, SustainabilityGoalDTO>();
            CreateMap<SustainabilityBadge, SustainabilityBadgeDTO>();
            CreateMap<FoodWasteEntry, FoodWasteEntryDTO>();
            CreateMap<Resource, ResourceDTO>();
            CreateMap<ResourceType, ResourceTypeDTO>();
            CreateMap<Attributes, AttributesDTO>();
            CreateMap<UserAttributes, UserAttributesDTO>();
        }
    }
}
