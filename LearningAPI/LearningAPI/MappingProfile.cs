using AutoMapper;
using LearningAPI.Models;

namespace LearningAPI
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Tutorial, TutorialDTO>();
            CreateMap<User, UserDTO>();
            CreateMap<User, UserBasicDTO>();
            CreateMap<SustainabilityGoal, SustainabilityGoalDTO>();
            CreateMap<SustainabilityBadge, SustainabilityBadgeDTO>();
            CreateMap<FoodWasteEntry, FoodWasteEntryDTO>();
        }
    }
}
