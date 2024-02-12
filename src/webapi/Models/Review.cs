using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Inlämning2REST.Models;
public class Review
{
    [Key]
    public int Id { get; set; }
    
    [Required]
    [Range(1,5,ErrorMessage = "The grade has to be between 1-5.")]
    public byte Grade { get; set; }
    
    [Required]
    [MaxLength(500, ErrorMessage = "The max length for a comment is 500 characters.")]
    public string? Comment { get; set; }

    [Required]
    [ForeignKey("Movie")]
    public int MovieId { get; set; }

    [ValidateNever] 
    [JsonIgnore]
    public Movie Movie { get; set; }
    
    [Required]
    [ForeignKey("CustomUser")]
    public string Username { get; set; }
    
    [ValidateNever]
    [JsonIgnore]
    public CustomUser User { get; set; }
}