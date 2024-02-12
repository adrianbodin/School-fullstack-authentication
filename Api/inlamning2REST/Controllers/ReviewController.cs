using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Inlämning2REST.Data;
using Inlämning2REST.Models;
using Inlämning2REST.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Inlämning2REST.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<CustomUser> _userManager;

        public ReviewController(AppDbContext context, UserManager<CustomUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews()
        {
            //Using AsNoTracking() to avoid tracking the entity in the context.
            //This may improve performance, because the entity is not tracked in the context.
            return Ok(await _context.Reviews
                        .AsNoTracking()
                        .ToListAsync());
        }
        
        [HttpGet("{id}")]
        public async Task<ActionResult<Review>> GetReview(int id)
        {
            //Using AsNoTracking() to avoid tracking the entity in the context.
            //This may improve performance, because the entity is not tracked in the context.
            var review = await _context.Reviews
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);
            
            if (review is null)
                return NotFound($"The review with id {id} was not found.");

            return Ok(review);
        }
        
        //Using Dto to post just the information we need
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutReview(int id, [FromBody] PutReviewDto review)
        {
            //Important to not use AsNoTracking() here, because we want to update the entity.
            var reviewToUpdate = await _context.Reviews.FindAsync(id);
            
            if (reviewToUpdate is null)
                return NotFound($"The review with id {id} was not found.");
            
            reviewToUpdate.Grade = review.Grade;
            reviewToUpdate.Comment = review.Comment;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReviewExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
        
        //Using Dto to post just the information we need
        [HttpPost, Authorize]
        public async Task<ActionResult<Review>> PostReview(AddReviewDto review)
        {
            var movie = await _context.Movies.FindAsync(review.MovieId);
            
            if(movie is null)
                return NotFound($"The movie with id {review.MovieId} was not found.");
            
            var user = _userManager.GetUserAsync(User);
            
            var reviewToAdd = new Review
            {
                Grade = review.Grade,
                Comment = review.Comment,
                MovieId = review.MovieId,
                Username = user.Result.UserName
            };
            
            
            _context.Reviews.Add(reviewToAdd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetReview", new { id = reviewToAdd.Id }, reviewToAdd);
        }
        
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            var user = await _userManager.GetUserAsync(User);
            var review = await _context.Reviews.FindAsync(id);
            
            if (review == null)
            {
                return NotFound($"The review with id {id} was not found.");
            }
            
            if (review.Username != user.UserName)
            {
                return Unauthorized();
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ReviewExists(int id)
        {
            return _context.Reviews.Any(e => e.Id == id);
        }
    }
}
