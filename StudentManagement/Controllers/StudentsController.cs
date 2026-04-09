using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentManagement.DTOs;
using StudentManagement.Services;

namespace StudentManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StudentsController : ControllerBase
    {
        private readonly IStudentService _service;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(IStudentService service, ILogger<StudentsController> logger)
        {
            _service = service;
            _logger = logger;
        }

        /// <summary>Get all students</summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _service.GetAllStudentsAsync();
            return Ok(ApiResponse<IEnumerable<StudentResponseDto>>.Ok(students));
        }

        /// <summary>Get a student by ID</summary>
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var student = await _service.GetStudentByIdAsync(id);
            if (student == null)
                return NotFound(ApiResponse<StudentResponseDto>.Fail($"Student with ID {id} not found."));

            return Ok(ApiResponse<StudentResponseDto>.Ok(student));
        }

        /// <summary>Add a new student</summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] StudentCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var created = await _service.AddStudentAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ApiResponse<StudentResponseDto>.Ok(created, "Student created successfully."));
        }

        /// <summary>Update an existing student</summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] StudentUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updated = await _service.UpdateStudentAsync(id, dto);
            if (updated == null)
                return NotFound(ApiResponse<StudentResponseDto>.Fail($"Student with ID {id} not found."));

            return Ok(ApiResponse<StudentResponseDto>.Ok(updated, "Student updated successfully."));
        }

        /// <summary>Delete a student</summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _service.DeleteStudentAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<object>.Fail($"Student with ID {id} not found."));

            return Ok(ApiResponse<object>.Ok(null!, "Student deleted successfully."));
        }
    }
}
