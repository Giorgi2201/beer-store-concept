using BeerStore.API.Models.DTOs.Auth;
using BeerStore.API.Models.Entities;
using BeerStore.API.Repositories.Interfaces;
using BeerStore.API.Services.Interfaces;
using BeerStore.API.Utilities;

namespace BeerStore.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtHelper _jwtHelper;

        public AuthService(
            IUserRepository userRepository,
            ICartRepository cartRepository,
            IPasswordHasher passwordHasher,
            IJwtHelper jwtHelper)
        {
            _userRepository = userRepository;
            _cartRepository = cartRepository;
            _passwordHasher = passwordHasher;
            _jwtHelper = jwtHelper;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto model)
        {
            // Check if user already exists
            if (await _userRepository.ExistsAsync(model.Email))
            {
                throw new ArgumentException("User with this email already exists");
            }

            // Validate age
            var age = DateTime.UtcNow.Year - model.DateOfBirth.Year;
            if (age < 18 || !model.IsOver18)
            {
                throw new ArgumentException("You must be over 18 to register");
            }

            // Create user
            var user = new User
            {
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
                PasswordHash = _passwordHasher.HashPassword(model.Password),
                DateOfBirth = model.DateOfBirth,
                IsOver18 = model.IsOver18,
                CreatedAt = DateTime.UtcNow
            };

            user = await _userRepository.CreateAsync(user);

            // Create empty cart for user
            var cart = new Cart
            {
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            await _cartRepository.CreateAsync(cart);

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user);
            var expiration = DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = token,
                TokenExpiration = expiration
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto model)
        {
            // Find user
            var user = await _userRepository.GetByEmailAsync(model.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Verify password
            if (!_passwordHasher.VerifyPassword(model.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user);
            var expiration = model.RememberMe 
                ? DateTime.UtcNow.AddDays(30) 
                : DateTime.UtcNow.AddHours(24);

            return new AuthResponseDto
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Token = token,
                TokenExpiration = expiration
            };
        }

        public async Task<UserDto?> GetCurrentUserAsync(int userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt
            };
        }
    }
}
