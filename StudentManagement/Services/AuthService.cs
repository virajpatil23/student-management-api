using Microsoft.IdentityModel.Tokens;
using StudentManagement.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace StudentManagement.Services
{
    public interface IAuthService
    {
        LoginResponseDto? Login(LoginRequestDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;

        // Hardcoded demo credentials — replace with DB users in production
        private readonly Dictionary<string, string> _users = new()
        {
            { "admin", "Admin@123" },
            { "user", "User@123" }
        };

        public AuthService(IConfiguration config)
        {
            _config = config;
        }

        public LoginResponseDto? Login(LoginRequestDto dto)
        {
            if (!_users.TryGetValue(dto.Username, out var password) || password != dto.Password)
                return null;

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddMinutes(
                int.Parse(_config["Jwt:ExpiresInMinutes"] ?? "60"));

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, dto.Username),
                new Claim(ClaimTypes.Role, dto.Username == "admin" ? "Admin" : "User"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return new LoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = expires
            };
        }
    }
}
