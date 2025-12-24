# ubill-sms-client

Node.js client for [uBill.ge](https://ubill.ge) SMS API. Send SMS messages, manage brand names, check delivery status, and monitor your account balance with ease.

[![npm version](https://img.shields.io/npm/v/ubill-sms-client.svg)](https://www.npmjs.com/package/ubill-sms-client)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Full API Coverage** - Complete implementation of all uBill SMS API endpoints  
🔒 **Type-Safe** - Written in TypeScript with full type definitions  
⚡ **Modern** - Promise-based API with async/await support  
📦 **Lightweight** - Minimal dependencies  
🛡️ **Error Handling** - Comprehensive error handling and validation  
📖 **Well Documented** - Extensive documentation and examples

## Installation

```bash
npm install ubill-sms-client
```

Or using yarn:

```bash
yarn add ubill-sms-client
```

## Quick Start

```typescript
import { UBillSMSClient } from "ubill-sms-client";

// Initialize the client
const client = new UBillSMSClient({
  apiKey: "your-api-key-here",
});

// Send an SMS
async function sendMessage() {
  try {
    const response = await client.sendSMS({
      brandID: 1,
      numbers: [995511194242],
      text: "Hello from uBill!",
    });

    console.log(`SMS sent successfully! ID: ${response.smsID}`);
  } catch (error) {
    console.error("Failed to send SMS:", error);
  }
}

sendMessage();
```

## Configuration

### Creating a Client Instance

```typescript
const client = new UBillSMSClient({
  apiKey: "your-api-key-here", // Required: Your uBill API key
  baseURL: "https://api.ubill.dev/v1", // Optional: Custom API base URL
  timeout: 30000, // Optional: Request timeout in ms (default: 30000)
});
```

## API Reference

### Brand Name Management

#### Create a Brand Name

Create a new brand name (sender ID) for your SMS messages. Brand names must be 2-11 characters and require approval before use.

```typescript
const response = await client.createBrandName("MyBrand");

if (response.statusID === 0) {
  console.log(`Brand created with ID: ${response.brandID}`);
} else {
  console.error(`Error: ${response.message}`);
}
```

**Error Codes:**

- `0` - Brand name created successfully
- `10` - Brand name field is empty
- `20` - Brand name must be 2-11 characters
- `30` - Unauthorized characters used
- `40` - Brand name already exists
- `50` - Wait for previous brand name authentication
- `90` - JSON error
- `99` - General error

#### Get All Brand Names

Retrieve all brand names associated with your account.

```typescript
const response = await client.getBrandNames();

if (response.statusID === 0 && response.data) {
  response.data.forEach((brand) => {
    console.log(
      `${brand.name} (ID: ${brand.id}) - Authorized: ${
        brand.authorized === "1" ? "Yes" : "No"
      }`
    );
  });
}
```

**Response Fields:**

- `id` - Brand ID
- `name` - Brand name
- `authorized` - Authorization status ('1' = authorized, '2' = pending)
- `createdAt` - Creation timestamp

### Sending SMS

#### Send SMS (Recommended Method)

Send SMS messages using POST request (most reliable method).

```typescript
// Send to a single number
const response = await client.sendSMS({
  brandID: 1,
  numbers: [995511194242],
  text: "Your verification code is: 123456",
});

// Send to multiple numbers
const response = await client.sendSMS({
  brandID: 1,
  numbers: [995511194242, 995511194243, 995511194244],
  text: "Bulk SMS message",
  stopList: false, // Optional: check against stop list (default: false)
});

console.log(`SMS ID: ${response.smsID}`);
```

**Parameters:**

- `brandID` (required) - Your brand ID
- `numbers` (required) - Array of phone numbers or comma-separated string
- `text` (required) - SMS message text
- `stopList` (optional) - Enable/disable stop list checking (default: false)

**Error Codes:**

- `0` - SMS sent successfully
- `10` - Brand ID not found
- `20` - Numbers not found
- `30` - Empty message text
- `40` - Insufficient SMS balance
- `50` - No valid numbers found
- `90` - JSON error
- `99` - General error

#### Send SMS via GET

Alternative method using GET request with URL parameters.

```typescript
const response = await client.sendSMSGet({
  brandID: 1,
  numbers: "995511194242,995511194243",
  text: "Hello via GET",
  stopList: false,
});
```

### Delivery Reports

#### Check SMS Delivery Status

Get the delivery status of a sent SMS message.

```typescript
const report = await client.getDeliveryReport(117345);

if (report.statusID === 0 && report.result) {
  report.result.forEach((status) => {
    console.log(
      `Number: ${status.number}, Status: ${getStatusText(status.statusID)}`
    );
  });
}

function getStatusText(statusID: string): string {
  const statuses: Record<string, string> = {
    "0": "Sent",
    "1": "Received",
    "2": "Not delivered",
    "3": "Awaiting status",
    "4": "Error",
  };
  return statuses[statusID] || "Unknown";
}
```

**Status Codes:**

- `0` - Sent
- `1` - Received (delivered successfully)
- `2` - Not delivered
- `3` - Awaiting status
- `4` - Error

### Account Balance

#### Check SMS Balance

Get your current SMS balance.

```typescript
const balance = await client.getBalance();

if (balance.statusID === 0) {
  console.log(`Remaining SMS: ${balance.balance}`);
}
```

## Complete Example

Here's a complete example demonstrating all features:

```typescript
import { UBillSMSClient } from "ubill-sms-client";

async function main() {
  // Initialize client
  const client = new UBillSMSClient({
    apiKey: "your-api-key-here",
  });

  try {
    // 1. Check balance
    const balance = await client.getBalance();
    console.log(`Current balance: ${balance.balance} SMS`);

    // 2. Get brand names
    const brands = await client.getBrandNames();
    if (brands.data && brands.data.length > 0) {
      const authorizedBrand = brands.data.find((b) => b.authorized === "1");

      if (authorizedBrand) {
        // 3. Send SMS
        const smsResponse = await client.sendSMS({
          brandID: parseInt(authorizedBrand.id),
          numbers: [995511194242],
          text: "Test message from uBill SMS Client",
        });

        console.log(`SMS sent! ID: ${smsResponse.smsID}`);

        // 4. Wait a bit, then check delivery status
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const report = await client.getDeliveryReport(smsResponse.smsID!);
        console.log("Delivery report:", report);
      } else {
        console.log("No authorized brands found. Creating a new brand...");

        const newBrand = await client.createBrandName("MyApp");
        console.log(
          `Brand created: ${newBrand.brandID}. Waiting for approval...`
        );
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
```

## Error Handling

The client throws descriptive errors that you can catch and handle:

```typescript
import { UBillSMSClient } from "ubill-sms-client";

const client = new UBillSMSClient({
  apiKey: "your-api-key",
});

try {
  const response = await client.sendSMS({
    brandID: 1,
    numbers: [995511194242],
    text: "Test message",
  });

  if (response.statusID !== 0) {
    console.error(`API Error: ${response.message}`);
  }
} catch (error) {
  if (error instanceof Error) {
    console.error("Failed to send SMS:", error.message);
  }
}
```

## TypeScript Support

This package is written in TypeScript and includes full type definitions:

```typescript
import {
  UBillSMSClient,
  SendSMSOptions,
  SendSMSResponse,
  DeliveryReportResponse,
  BrandName,
} from "ubill-sms-client";

const client: UBillSMSClient = new UBillSMSClient({
  apiKey: "your-api-key",
});

const options: SendSMSOptions = {
  brandID: 1,
  numbers: [995511194242],
  text: "Typed message",
};

const response: SendSMSResponse = await client.sendSMS(options);
```

## Phone Number Format

uBill works exclusively with **Georgian mobile numbers**. The client automatically validates phone numbers before sending.

### Accepted Formats

✅ **With country code**: `995XXXXXXXXX` (12 digits)

```typescript
995511194242; // Valid
995555123456; // Valid
995591234567; // Valid
```

✅ **Without country code**: `XXXXXXXXX` (9 digits starting with 5)

```typescript
511194242; // Valid
555123456; // Valid
591234567; // Valid
```

### Requirements

- Must start with **5** (Georgian mobile prefix)
- With country code: exactly **12 digits** (995 + 9 digits)
- Without country code: exactly **9 digits**
- Valid mobile prefixes: 5XX (like 511, 555, 558, 568, 571, 574, 577, 591-599)

### Invalid Examples

❌ Wrong country code:

```typescript
994511194242; // Not Georgia
996511194242; // Not Georgia
```

❌ Doesn't start with 5:

```typescript
995411194242; // Must start with 5
995611194242; // Must start with 5
```

❌ Wrong length:

```typescript
99551119424; // Too short
9955111942422; // Too long
51119424; // Too short
5111942422; // Too long
```

### Validation Error

If you provide an invalid number, you'll get a clear error:

```typescript
try {
  await client.sendSMS({
    brandID: 1,
    numbers: [995411194242], // Invalid: doesn't start with 5
    text: "Test",
  });
} catch (error) {
  // Error: Invalid Georgian mobile number(s): 995411194242.
  // Expected format: 995XXXXXXXXX (with country code) or XXXXXXXXX (without), starting with 5.
}
```

## Best Practices

1. **Store your API key securely** - Use environment variables, never commit keys to version control
2. **Handle errors gracefully** - Always wrap API calls in try-catch blocks
3. **Check status codes** - Verify `statusID === 0` for successful responses
4. **Use POST method** - Prefer `sendSMS()` over `sendSMSGet()` for better security
5. **Monitor your balance** - Regularly check your SMS balance to avoid failed sends
6. **Brand name approval** - Wait for brand name approval before sending SMS
7. **Rate limiting** - Implement appropriate rate limiting in your application

## Environment Variables

Store your API key in environment variables:

```bash
# .env file
UBILL_API_KEY=your-api-key-here
```

```typescript
import { UBillSMSClient } from "ubill-sms-client";

const client = new UBillSMSClient({
  apiKey: process.env.UBILL_API_KEY!,
});
```

## Requirements

- Node.js 14.0.0 or higher
- A uBill.ge account with API access
- Valid API key from your uBill dashboard

## API Documentation

For more information about the uBill SMS API, visit:

- [Official API Documentation](https://documenter.getpostman.com/view/13830965/TVmV6ZWT)
- [uBill.ge Website](https://ubill.ge)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or contributions:

- GitHub Issues: [https://github.com/Smart-Pay-Chain/ubill.ge-sms/issues](https://github.com/Smart-Pay-Chain/ubill.ge-sms/issues)
- Email: support@ubill.ge

## Changelog

### 1.0.0 (2025-12-25)

- Initial release
- Full API coverage for uBill SMS API
- TypeScript support
- Comprehensive documentation

---

Made with ❤️ by [Smart Pay Chain](https://github.com/Smart-Pay-Chain)
