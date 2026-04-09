using Microsoft.AspNetCore.Mvc;
using StudentManagement.DTOs;
using StudentManagement.Services;

namespace StudentManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>Login and get JWT token</summary>
        /// <remarks>
        /// Demo credentials:
        /// - admin / Admin@123
        /// - user / User@123
        /// </remarks>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto dto)
        {
            var result = _authService.Login(dto);
            if (result == null)
                return Unauthorized(ApiResponse<LoginResponseDto>.Fail("Invalid username or password."));

            return Ok(ApiResponse<LoginResponseDto>.Ok(result, "Login successful."));
        }
    }
}
