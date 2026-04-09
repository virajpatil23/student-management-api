using Microsoft.Extensions.Logging;
using Moq;
using StudentManagement.DTOs;
using StudentManagement.Models;
using StudentManagement.Repositories;
using StudentManagement.Services;
using Xunit;

namespace StudentManagement.Tests
{
    public class StudentServiceTests
    {
        private readonly Mock<IStudentRepository> _repoMock;
        private readonly Mock<ILogger<StudentService>> _loggerMock;
        private readonly StudentService _service;

        public StudentServiceTests()
        {
            _repoMock = new Mock<IStudentRepository>();
            _loggerMock = new Mock<ILogger<StudentService>>();
            _service = new StudentService(_repoMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task GetAllStudentsAsync_ReturnsAllStudents()
        {
            var students = new List<Student>
            {
                new() { Id = 1, Name = "Alice", Email = "alice@test.com", Age = 21, Course = "CS", CreatedDate = DateTime.UtcNow },
                new() { Id = 2, Name = "Bob",   Email = "bob@test.com",   Age = 22, Course = "IT", CreatedDate = DateTime.UtcNow }
            };
            _repoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(students);

            var result = (await _service.GetAllStudentsAsync()).ToList();

            Assert.Equal(2, result.Count);
            Assert.Equal("Alice", result[0].Name);
        }

        [Fact]
        public async Task GetStudentByIdAsync_ReturnsNull_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Student?)null);

            var result = await _service.GetStudentByIdAsync(99);

            Assert.Null(result);
        }

        [Fact]
        public async Task AddStudentAsync_ThrowsException_WhenEmailExists()
        {
            var existing = new Student { Id = 1, Email = "duplicate@test.com", Name = "X", Age = 20, Course = "CS" };
            _repoMock.Setup(r => r.GetByEmailAsync("duplicate@test.com")).ReturnsAsync(existing);

            var dto = new StudentCreateDto { Name = "New", Email = "duplicate@test.com", Age = 21, Course = "IT" };

            await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AddStudentAsync(dto));
        }

        [Fact]
        public async Task AddStudentAsync_ReturnsCreatedStudent_WhenValid()
        {
            _repoMock.Setup(r => r.GetByEmailAsync("new@test.com")).ReturnsAsync((Student?)null);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<Student>()))
                .ReturnsAsync((Student s) => { s.Id = 1; return s; });

            var dto = new StudentCreateDto { Name = "New Student", Email = "new@test.com", Age = 20, Course = "CS" };
            var result = await _service.AddStudentAsync(dto);

            Assert.Equal("New Student", result.Name);
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task DeleteStudentAsync_ReturnsFalse_WhenNotFound()
        {
            _repoMock.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Student?)null);

            var result = await _service.DeleteStudentAsync(999);

            Assert.False(result);
        }

        [Fact]
        public async Task DeleteStudentAsync_ReturnsTrue_WhenExists()
        {
            var student = new Student { Id = 1, Name = "Test", Email = "t@t.com", Age = 20, Course = "CS" };
            _repoMock.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(student);
            _repoMock.Setup(r => r.DeleteAsync(student)).Returns(Task.CompletedTask);

            var result = await _service.DeleteStudentAsync(1);

            Assert.True(result);
        }
    }
}
