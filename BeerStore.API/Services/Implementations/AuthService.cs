using BeerStore.API.Models.DTOs.Auth;
using BeerStore.API.Models.Entities;
using BeerStore.API.Repositories.Interfaces;
using BeerStore.API.Services.Interfaces;
using BeerStore.API.Utilities;
using System.Text.RegularExpressions;

namespace BeerStore.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtHelper _jwtHelper;
        private readonly IDeliveryService _deliveryService;

        public AuthService(
            IUserRepository userRepository,
            ICartRepository cartRepository,
            IPasswordHasher passwordHasher,
            IJwtHelper jwtHelper,
            IDeliveryService deliveryService)
        {
            _userRepository  = userRepository;
            _cartRepository  = cartRepository;
            _passwordHasher  = passwordHasher;
            _jwtHelper       = jwtHelper;
            _deliveryService = deliveryService;
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

            // Generate JWT token with extended expiration if RememberMe is checked
            var expirationMinutes = model.RememberMe ? 20160 : 1440; // 2 weeks or 24 hours
            var token = _jwtHelper.GenerateToken(user, expirationMinutes);
            var expiration = DateTime.UtcNow.AddMinutes(expirationMinutes);

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

            return MapToDto(user);
        }

        public async Task<UserDto> UpdateAddressAsync(int userId, UpdateAddressDto model)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new ArgumentException("User not found");

            // Validate delivery zone server-side so clients cannot bypass it
            if (model.Latitude.HasValue && model.Longitude.HasValue)
            {
                var quote = await _deliveryService.GetDeliveryQuoteAsync(
                    model.Latitude.Value, model.Longitude.Value);

                if (!quote.InZone)
                    throw new ArgumentException("The selected address is outside our delivery zone.");
            }

            user.AddressLine = model.AddressLine;
            user.Phone       = model.Phone;
            user.Latitude    = model.Latitude;
            user.Longitude   = model.Longitude;

            user = await _userRepository.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task<UserDto> UpdateProfileAsync(int userId, UpdateProfileDto model)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new ArgumentException("User not found");

            if (string.IsNullOrWhiteSpace(model.FirstName))
                throw new ArgumentException("First name is required.");
            if (string.IsNullOrWhiteSpace(model.LastName))
                throw new ArgumentException("Last name is required.");

            user.FirstName = model.FirstName.Trim();
            user.LastName  = model.LastName.Trim();

            user = await _userRepository.UpdateAsync(user);
            return MapToDto(user);
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordDto model)
        {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null) throw new ArgumentException("User not found");

            if (!_passwordHasher.VerifyPassword(model.CurrentPassword, user.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect.");

            // Enforce complexity rules server-side
            if (model.NewPassword.Length < 8)
                throw new ArgumentException("Password must be at least 8 characters.");
            if (!Regex.IsMatch(model.NewPassword, "[A-Z]"))
                throw new ArgumentException("Password must contain at least one uppercase letter.");
            if (!Regex.IsMatch(model.NewPassword, "[0-9]"))
                throw new ArgumentException("Password must contain at least one number.");

            user.PasswordHash = _passwordHasher.HashPassword(model.NewPassword);
            await _userRepository.UpdateAsync(user);
        }

        private static UserDto MapToDto(User user) => new()
        {
            Id = user.Id,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt,
            AddressLine = user.AddressLine,
            Phone = user.Phone,
            Latitude = user.Latitude,
            Longitude = user.Longitude
        };
    }
}
