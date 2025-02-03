using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace LearningAPI.Models
{
    public class BookmarkFolder
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public List<BookmarkRecipe> Recipes { get; set; }
    }

    public class BookmarkRecipe
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string Image { get; set; }
    }

    public class AddBookmarkRequest
    {
        public string FolderName { get; set; } = string.Empty;
        public int RecipeId { get; set; } = 0;
        public string Title { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
    }


    public class RemoveBookmarkRequest
    {
        public string FolderName { get; set; }
        public int RecipeId { get; set; }
    }

    public class DeleteFolderRequest
    {
        public string FolderName { get; set; }
    }

    public class EditFolderRequest
    {
        public string OldName { get; set; }
        public string NewName { get; set; }
    }

}
