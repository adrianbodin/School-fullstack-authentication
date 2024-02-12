using System.ComponentModel.DataAnnotations;

namespace Inlämning2REST.Models.Dtos;

public class AddMovieDto
{
    [Required]
    [MaxLength(100, ErrorMessage = "The title can not be more than 100 characters")]
    public string Title { get; set; }
    
    [Required]
    [Range(1900, 2024, ErrorMessage = "The release year has to be between 1900-2024")]
    public short ReleaseYear { get; set; }
}