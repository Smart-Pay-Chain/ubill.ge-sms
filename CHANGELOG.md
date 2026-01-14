# Changelog

All notable changes to this project will be documented in this file.

## [1.0.6] - 2026-01-14

### Added
- Added optional `status` field to `DeliveryStatus` interface for status text description
- Added optional `deliveredAt` field to `DeliveryStatus` interface for delivery timestamps
- Added `balance` as alternative field name in `BalanceResponse` (API may return either `sms` or `balance`)

### Changed
- Enhanced type definitions to match actual API responses
- Improved JSDoc documentation for `getDeliveryReport()` with better examples
- Improved JSDoc documentation for `getBalance()` with handling for both field names

### Fixed
- Type safety improvements for delivery reports and balance responses

## [1.0.5] - 2024-12-XX

### Initial Release
- SMS sending via POST and GET requests
- Brand name management (create and list)
- Delivery status tracking
- Account balance checking
- Georgian mobile number validation
- Comprehensive error handling
- Full TypeScript support
