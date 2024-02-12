using Inlämning2REST.Data;
using Inlämning2REST.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inlämning2REST.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserManager<CustomUser> _userManager;
    private readonly AppDbContext _context;

    public UserController(AppDbContext context, UserManager<CustomUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("reviews"), Authorize]
    public async Task<ActionResult<IEnumerable<Review>>> GetUserReviews()
    {
        var user = await _userManager.GetUserAsync(User);
        
        if (user is null)
            return NotFound($"The user was not found.");
        
        var reviews = await _context.Reviews.Where(r => r.Username == user.Id).ToListAsync();
        
        if (!reviews.Any())
            return NotFound($"The user has not written any reviews.");
        
        return Ok(reviews);
    }
}