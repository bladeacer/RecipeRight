using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using LearningAPI.Models;

namespace LearningAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BookmarksController : ControllerBase
    {
        private readonly MyDbContext _context;

        public BookmarksController(MyDbContext context)
        {
            _context = context;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddBookmark(AddBookmarkRequest request)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var folder = await _context.BookmarkFolders
                .Include(f => f.Recipes)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Name == request.FolderName);

            if (folder == null)
            {
                folder = new BookmarkFolder
                {
                    UserId = userId,
                    Name = request.FolderName,
                    Recipes = new List<BookmarkRecipe>()
                };
                _context.BookmarkFolders.Add(folder);
            }

            if (folder.Recipes.Any(r => r.RecipeId == request.RecipeId))
            {
                return BadRequest(new { message = "Recipe is already bookmarked in this folder." });
            }

            folder.Recipes.Add(new BookmarkRecipe
            {
                RecipeId = request.RecipeId,
                Title = request.Title,
                Image = request.Image
            });

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetBookmarks()
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
            var folders = await _context.BookmarkFolders
                .Where(f => f.UserId == userId)
                .Include(f => f.Recipes)
                .ToListAsync();

            return Ok(folders);
        }

        [HttpDelete("remove")]
        public async Task<IActionResult> RemoveBookmark([FromBody] RemoveBookmarkRequest request)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var folder = await _context.BookmarkFolders
                .Include(f => f.Recipes)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Name == request.FolderName);

            if (folder == null)
            {
                return NotFound(new { message = "Folder not found." });
            }

            var recipe = folder.Recipes.FirstOrDefault(r => r.RecipeId == request.RecipeId);
            if (recipe == null)
            {
                return NotFound(new { message = "Recipe not found in the folder." });
            }

            folder.Recipes.Remove(recipe);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("folder")]
        public async Task<IActionResult> DeleteFolder([FromBody] DeleteFolderRequest request)
        {
            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var folder = await _context.BookmarkFolders
                .Include(f => f.Recipes)
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Name == request.FolderName);

            if (folder == null)
            {
                return NotFound(new { message = "Folder not found." });
            }

            _context.BookmarkFolders.Remove(folder);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Folder deleted successfully." });
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditBookmarkFolderName([FromBody] EditFolderRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.OldName) || string.IsNullOrWhiteSpace(request.NewName))
            {
                return BadRequest(new { message = "Folder names cannot be empty." });
            }

            var userId = int.Parse(User.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);

            var folder = await _context.BookmarkFolders
                .FirstOrDefaultAsync(f => f.UserId == userId && f.Name == request.OldName);

            if (folder == null)
            {
                return NotFound(new { message = "Folder not found." });
            }

            folder.Name = request.NewName;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Folder name updated successfully." });
        }


    }


}
