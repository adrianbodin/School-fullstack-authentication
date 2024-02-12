using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.VisualBasic;

namespace Inlämning2REST.Models;

public class Movie
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100, ErrorMessage = "The title can not be more than 100 characters")]
    public string Title { get; set; }

    [Required]
    [Range(1900, 2024, ErrorMessage = "The release year has to be between 1900-2024")]
    public short ReleaseYear { get; set; }

    [ValidateNever] 
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}