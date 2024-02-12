using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Inlämning2REST.Models;

public class CustomUser : IdentityUser
{
    [ValidateNever]
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}