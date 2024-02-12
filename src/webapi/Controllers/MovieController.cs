using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
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
    public class MovieController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<CustomUser> _userManager;

        public MovieController(AppDbContext context, UserManager<CustomUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET: api/Movie
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            //Using AsNoTracking() to avoid tracking the entity in the context.
            //This may improve performance, because the entity is not tracked in the context, because we are not going to update it.
            return Ok(await _context.Movies
                        .AsNoTracking()
                        .Include(m => m.Reviews)
                        .ToListAsync());
        }

        // GET: api/Movie/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            //Gets the movie with the id and includes the reviews for that movie
            //Using AsNoTracking() to avoid tracking the entity in the context.
            //This may improve performance, because the entity is not tracked in the context, because we are not going to update it.
            var movie = await _context.Movies
                        .AsNoTracking()
                        .Include(m => m.Reviews)
                        .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
                return NotFound($"The movie with id {id} was not found.");
            

            return Ok(movie);
        }

        //Using Dto to post just the information we need
        [HttpPut("{id}"), Authorize]
        public async Task<IActionResult> PutMovie(int id,[FromBody] AddMovieDto movieDto)
        {
            //Important to not use AsNoTracking() here, because we want to update the entity.
            var movieToUpdate = await _context.Movies.FindAsync(id);
            
            if (movieToUpdate is null)
                return NotFound($"The movie with id {id} was not found.");
            
            movieToUpdate.Title = movieDto.Title;
            movieToUpdate.ReleaseYear = movieDto.ReleaseYear;
            
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
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
        public async Task<ActionResult<Movie>> PostMovie([FromBody]AddMovieDto movieDto)
        {
            var movieToAdd = new Movie
            {
                Title = movieDto.Title,
                ReleaseYear = movieDto.ReleaseYear
            };
            
            _context.Movies.Add(movieToAdd);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovie", new { id = movieToAdd.Id }, movieToAdd);
        }

        
        [HttpDelete("{id}"), Authorize]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie is null)
                return NotFound();

            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        
        [HttpGet ("{id}/reviews")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviews(int id)
        {
            
            //Sees if the movie with the route id exists
            var movie = await _context.Movies.FindAsync(id);
            
            if(movie is null)
                return NotFound($"The movie with id {id} was not found.");
            
            var reviews = await _context.Reviews.Where(r => r.MovieId == id).ToListAsync();
             
             if(!reviews.Any())
                 return NotFound($"There are no reviews for the movie with id {id}.");

             return Ok(reviews);
        }

        private bool MovieExists(int id)
        {
            return _context.Movies.Any(e => e.Id == id);
        }
    }
}
