using StudentManagement.DTOs;
using StudentManagement.Models;
using StudentManagement.Repositories;

namespace StudentManagement.Services
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _repo;
        private readonly ILogger<StudentService> _logger;

        public StudentService(IStudentRepository repo, ILogger<StudentService> logger)
        {
            _repo = repo;
            _logger = logger;
        }

        public async Task<IEnumerable<StudentResponseDto>> GetAllStudentsAsync()
        {
            var students = await _repo.GetAllAsync();
            return students.Select(MapToDto);
        }

        public async Task<StudentResponseDto?> GetStudentByIdAsync(int id)
        {
            var student = await _repo.GetByIdAsync(id);
            return student == null ? null : MapToDto(student);
        }

        public async Task<StudentResponseDto> AddStudentAsync(StudentCreateDto dto)
        {
            var existing = await _repo.GetByEmailAsync(dto.Email);
            if (existing != null)
                throw new InvalidOperationException($"A student with email '{dto.Email}' already exists.");

            var student = new Student
            {
                Name = dto.Name,
                Email = dto.Email,
                Age = dto.Age,
                Course = dto.Course,
                CreatedDate = DateTime.UtcNow
            };

            var created = await _repo.AddAsync(student);
            _logger.LogInformation("Student created: {Id} - {Name}", created.Id, created.Name);
            return MapToDto(created);
        }

        public async Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto dto)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null) return null;

            // Check email conflict with another student
            var emailOwner = await _repo.GetByEmailAsync(dto.Email);
            if (emailOwner != null && emailOwner.Id != id)
                throw new InvalidOperationException($"Email '{dto.Email}' is already used by another student.");

            student.Name = dto.Name;
            student.Email = dto.Email;
            student.Age = dto.Age;
            student.Course = dto.Course;

            var updated = await _repo.UpdateAsync(student);
            _logger.LogInformation("Student updated: {Id}", updated.Id);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteStudentAsync(int id)
        {
            var student = await _repo.GetByIdAsync(id);
            if (student == null) return false;

            await _repo.DeleteAsync(student);
            _logger.LogInformation("Student deleted: {Id}", id);
            return true;
        }

        private static StudentResponseDto MapToDto(Student s) => new()
        {
            Id = s.Id,
            Name = s.Name,
            Email = s.Email,
            Age = s.Age,
            Course = s.Course,
            CreatedDate = s.CreatedDate
        };
    }
}
