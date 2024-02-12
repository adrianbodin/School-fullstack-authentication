using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inlämning2REST.Models.Dtos;

public class AddReviewDto
{
    [Required]
    [Range(1,5,ErrorMessage = "The grade has to be between 1-5.")]
    public byte Grade { get; set; }
    
    [Required]
    [MaxLength(500, ErrorMessage = "The max length for a comment is 500 characters.")]
    public string? Comment { get; set; }

    [Required]
    public int MovieId { get; set; }
}