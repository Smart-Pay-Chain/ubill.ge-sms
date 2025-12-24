/**
 * Basic Example - Send SMS
 * 
 * This example demonstrates the basic usage of the uBill SMS client
 * to send a simple SMS message.
 */

import { UBillSMSClient } from '../src';

async function basicExample() {
  // Initialize the client with your API key
  const client = new UBillSMSClient({
    apiKey: process.env.UBILL_API_KEY || 'your-api-key-here'
  });

  try {
    // Send a simple SMS
    const response = await client.sendSMS({
      brandID: 1, // Use your brand ID
      numbers: [995511194242], // Phone number in international format
      text: 'Hello! This is a test message from uBill SMS client.'
    });

    if (response.statusID === 0) {
      console.log('✅ SMS sent successfully!');
      console.log(`📱 SMS ID: ${response.smsID}`);
      console.log(`💬 Message: ${response.message}`);
    } else {
      console.error('❌ Failed to send SMS');
      console.error(`Error: ${response.message}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example
basicExample();

