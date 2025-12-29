# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-12-29

### Added
- **Client-side brand name validation** with comprehensive rules:
  - Length validation (2-11 characters)
  - Character validation (a-z, A-Z, 0-9, period, hyphen, space)
  - Clear error messages for invalid input
  - Prevents unnecessary API calls with invalid data

### Fixed
- **CRITICAL**: Fixed `createBrandName` HTTP method from PUT to POST to match uBill API specification
- **CRITICAL**: Fixed `getBalance()` response field from `balance` to `sms` to match uBill API specification
- Updated tests, documentation, and examples to reflect the correct field names

### Documentation
- Added detailed brand name validation rules with examples
- Added valid and invalid brand name examples
- Enhanced API error code documentation

### Tests
- Added 8 new tests for brand name validation
- All 56 tests passing

### Verified
- All SMS API endpoints verified against official [uBill API documentation](https://documenter.getpostman.com/view/13830965/TVmV6ZWT)

## [1.0.0] - 2025-12-25

### Added
- Initial release of uBill SMS Client
- Full TypeScript support with comprehensive type definitions
- SMS API coverage:
  - Brand name management (create, list)
  - SMS sending (POST JSON - recommended, GET methods)
  - Delivery tracking
  - Balance checking
- **Georgian mobile number validation** - Automatic validation before sending
  - Supports both formats: 995XXXXXXXXX and XXXXXXXXX
  - Clear validation errors with helpful messages
- Comprehensive error handling
- 48 comprehensive unit tests with Jest
- Detailed documentation and examples
- Five example scripts demonstrating various use cases
- Support for both single and bulk SMS sending
- Tests run automatically before build

### Documentation
- Complete README with installation and usage instructions
- API reference documentation
- Phone number format guide with validation rules
- TypeScript usage examples
- Error handling guide
- Best practices section
- Examples directory with 5 detailed examples

### Developer Experience
- Full TypeScript type definitions
- Jest test suite with 48 tests
- Tests run before builds
- Client-side phone number validation
- NPM package ready for publishing
- .gitignore and .npmignore configurations
- MIT License

### Design Decisions
- Removed XML method in favor of modern JSON API
- Simplified codebase for better maintainability
- Focus on JSON as the standard for modern integrations
- Added Georgian mobile number validation for data quality

[1.0.0]: https://github.com/Smart-Pay-Chain/ubill.ge-sms/releases/tag/v1.0.0

