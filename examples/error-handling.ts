/**
 * Error Handling Example
 * 
 * This example demonstrates proper error handling patterns
 */

import { UBillSMSClient, SendSMSResponse, UBillAPIError } from '../src';

async function errorHandlingExample() {
  const client = new UBillSMSClient({
    apiKey: process.env.UBILL_API_KEY || 'your-api-key-here'
  });

  console.log('🛡️  Error Handling Example\n');

  // Example 1: Handle API errors with status codes
  console.log('Example 1: Handling API error codes');
  console.log('─────────────────────────────────────');
  
  try {
    const response = await client.sendSMS({
      brandID: 999999, // Invalid brand ID
      numbers: [995511194242],
      text: 'Test message'
    });

    if (response.statusID !== 0) {
      console.log(`⚠️  API returned error code ${response.statusID}`);
      console.log(`Message: ${response.message}`);
      
      // Handle specific error codes
      handleSMSError(response);
    }
  } catch (error) {
    console.error('❌ Exception caught:', error instanceof Error ? error.message : error);
  }

  console.log('\n');

  // Example 2: Validate input before sending
  console.log('Example 2: Input validation');
  console.log('─────────────────────────────────────');
  
  try {
    const text = ''; // Empty text
    
    if (!text || text.trim().length === 0) {
      console.log('⚠️  Validation failed: Message text cannot be empty');
    } else {
      await client.sendSMS({
        brandID: 1,
        numbers: [995511194242],
        text: text
      });
    }
  } catch (error) {
    console.error('❌ Exception caught:', error instanceof Error ? error.message : error);
  }

  console.log('\n');

  // Example 3: Handle network errors
  console.log('Example 3: Network error handling');
  console.log('─────────────────────────────────────');
  
  try {
    const clientWithShortTimeout = new UBillSMSClient({
      apiKey: process.env.UBILL_API_KEY || 'your-api-key-here',
      timeout: 1 // Very short timeout to simulate network error
    });

    await clientWithShortTimeout.getBalance();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        console.log('⚠️  Request timeout: Please check your network connection');
      } else if (error.message.includes('Network Error')) {
        console.log('⚠️  Network error: Unable to reach uBill API');
      } else {
        console.log('❌ Error:', error.message);
      }
    }
  }

  console.log('\n');

  // Example 4: Retry logic
  console.log('Example 4: Implementing retry logic');
  console.log('─────────────────────────────────────');
  
  await sendSMSWithRetry(client, {
    brandID: 1,
    numbers: [995511194242],
    text: 'Message with retry logic'
  }, 3);
}

/**
 * Handle specific SMS error codes
 */
function handleSMSError(response: SendSMSResponse) {
  const errorHandlers: Record<number, string> = {
    10: '❌ Brand ID not found. Please check your brand ID or create a new brand name.',
    20: '❌ No phone numbers provided. Please specify at least one recipient.',
    30: '❌ Message text is empty. Please provide a message.',
    40: '💰 Insufficient SMS balance. Please top up your account.',
    50: '📞 No valid phone numbers found. Please check the number format.',
    90: '⚠️  JSON parsing error. Please check your request format.',
    99: '⚠️  General error occurred. Please contact support if this persists.'
  };

  const message = errorHandlers[response.statusID] || `⚠️  Unknown error (code: ${response.statusID})`;
  console.log(message);
}

/**
 * Send SMS with automatic retry logic
 */
async function sendSMSWithRetry(
  client: UBillSMSClient,
  options: { brandID: number; numbers: number[]; text: string },
  maxRetries: number = 3,
  delayMs: number = 2000
): Promise<SendSMSResponse | null> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);
      
      const response = await client.sendSMS(options);

      if (response.statusID === 0) {
        console.log(`✅ Success! SMS ID: ${response.smsID}`);
        return response;
      } else {
        console.log(`⚠️  API error: ${response.message}`);
        
        // Don't retry for certain errors
        if ([10, 20, 30].includes(response.statusID)) {
          console.log('🚫 Error is not retryable');
          return response;
        }
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`❌ Attempt ${attempt} failed: ${lastError.message}`);
      
      if (attempt < maxRetries) {
        console.log(`⏰ Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  console.log('❌ All retry attempts exhausted');
  if (lastError) {
    throw lastError;
  }
  
  return null;
}

// Run the example
errorHandlingExample();

