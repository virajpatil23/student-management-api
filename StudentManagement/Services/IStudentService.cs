using StudentManagement.DTOs;

namespace StudentManagement.Services
{
    public interface IStudentService
    {
        Task<IEnumerable<StudentResponseDto>> GetAllStudentsAsync();
        Task<StudentResponseDto?> GetStudentByIdAsync(int id);
        Task<StudentResponseDto> AddStudentAsync(StudentCreateDto dto);
        Task<StudentResponseDto?> UpdateStudentAsync(int id, StudentUpdateDto dto);
        Task<bool> DeleteStudentAsync(int id);
    }
}
