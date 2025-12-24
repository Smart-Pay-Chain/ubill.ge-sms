/**
 * Delivery Tracking Example
 * 
 * This example demonstrates how to track SMS delivery status
 */

import { UBillSMSClient } from '../src';

async function deliveryTrackingExample() {
  const client = new UBillSMSClient({
    apiKey: process.env.UBILL_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('📬 SMS Delivery Tracking Example\n');

    // Send an SMS
    console.log('📤 Sending SMS...');
    const smsResponse = await client.sendSMS({
      brandID: 1, // Use your brand ID
      numbers: [995511194242, 995511194243],
      text: 'Test message for delivery tracking'
    });

    if (smsResponse.statusID === 0 && smsResponse.smsID) {
      console.log(`✅ SMS sent! ID: ${smsResponse.smsID}\n`);

      // Function to check delivery status
      const checkDeliveryStatus = async (smsID: number | string, attempt: number = 1) => {
        console.log(`📊 Checking delivery status (Attempt ${attempt})...`);
        
        const report = await client.getDeliveryReport(smsID);

        if (report.statusID === 0 && report.result) {
          console.log('\nDelivery Report:');
          console.log('═══════════════════════════════════');

          let allDelivered = true;
          const statusMap: Record<string, { icon: string; label: string; color: string }> = {
            '0': { icon: '📤', label: 'Sent', color: 'yellow' },
            '1': { icon: '✅', label: 'Delivered', color: 'green' },
            '2': { icon: '❌', label: 'Not delivered', color: 'red' },
            '3': { icon: '⏳', label: 'Awaiting status', color: 'blue' },
            '4': { icon: '⚠️ ', label: 'Error', color: 'red' }
          };

          report.result.forEach(status => {
            const statusInfo = statusMap[status.statusID] || { icon: '❓', label: 'Unknown', color: 'gray' };
            console.log(`${statusInfo.icon} ${status.number}: ${statusInfo.label}`);
            
            if (status.statusID === '3' || status.statusID === '0') {
              allDelivered = false;
            }
          });

          console.log('═══════════════════════════════════\n');

          // If not all messages are delivered and we haven't reached max attempts, check again
          if (!allDelivered && attempt < 5) {
            console.log('⏰ Some messages are still pending. Waiting 10 seconds before checking again...\n');
            await new Promise(resolve => setTimeout(resolve, 10000));
            await checkDeliveryStatus(smsID, attempt + 1);
          } else if (allDelivered) {
            console.log('✨ All messages have been processed!\n');
          } else {
            console.log('ℹ️  Max attempts reached. Some messages may still be processing.\n');
          }

          return report;
        } else {
          console.error('Failed to get delivery report');
          return null;
        }
      };

      // Start tracking
      console.log('⏰ Waiting 5 seconds before first check...\n');
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      await checkDeliveryStatus(smsResponse.smsID);
    } else {
      console.error(`❌ Failed to send SMS: ${smsResponse.message}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example
deliveryTrackingExample();

