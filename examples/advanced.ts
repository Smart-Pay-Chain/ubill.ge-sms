/**
 * Advanced Example - Complete Workflow
 * 
 * This example demonstrates a complete workflow including:
 * - Checking balance
 * - Managing brand names
 * - Sending SMS to multiple recipients
 * - Checking delivery status
 */

import { UBillSMSClient } from '../src';

async function advancedExample() {
  const client = new UBillSMSClient({
    apiKey: process.env.UBILL_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('🚀 Starting advanced SMS workflow...\n');

    // Step 1: Check SMS balance
    console.log('📊 Step 1: Checking SMS balance...');
    const balance = await client.getBalance();
    
    if (balance.statusID === 0) {
      console.log(`✅ Current balance: ${balance.balance} SMS\n`);
      
      if ((balance.balance || 0) < 10) {
        console.warn('⚠️  Low balance warning! Please top up your account.\n');
      }
    }

    // Step 2: Get all brand names
    console.log('🏷️  Step 2: Fetching brand names...');
    const brands = await client.getBrandNames();
    
    if (brands.statusID === 0 && brands.data) {
      console.log(`✅ Found ${brands.data.length} brand name(s):`);
      
      brands.data.forEach(brand => {
        const status = brand.authorized === '1' ? '✓ Authorized' : '⏳ Pending';
        console.log(`   - ${brand.name} (ID: ${brand.id}) - ${status}`);
      });
      console.log('');

      // Find an authorized brand
      const authorizedBrand = brands.data.find(b => b.authorized === '1');
      
      if (authorizedBrand) {
        // Step 3: Send SMS to multiple recipients
        console.log('📤 Step 3: Sending SMS to multiple recipients...');
        
        const recipients = [
          995511194242,
          995511194243,
          995511194244
        ];

        const smsResponse = await client.sendSMS({
          brandID: parseInt(authorizedBrand.id),
          numbers: recipients,
          text: 'This is a bulk SMS message sent via uBill API client. Visit https://ubill.ge',
          stopList: false
        });

        if (smsResponse.statusID === 0) {
          console.log('✅ SMS sent successfully!');
          console.log(`📱 SMS ID: ${smsResponse.smsID}`);
          console.log(`📋 Recipients: ${recipients.length}`);
          console.log(`💬 Message: ${smsResponse.message}\n`);

          // Step 4: Wait and check delivery status
          console.log('⏰ Step 4: Waiting 5 seconds before checking delivery status...');
          await new Promise(resolve => setTimeout(resolve, 5000));

          console.log('📬 Fetching delivery report...');
          const report = await client.getDeliveryReport(smsResponse.smsID!);

          if (report.statusID === 0 && report.result) {
            console.log('✅ Delivery Report:');
            
            const statusLabels: Record<string, string> = {
              '0': '📤 Sent',
              '1': '✅ Delivered',
              '2': '❌ Not delivered',
              '3': '⏳ Awaiting status',
              '4': '⚠️  Error'
            };

            report.result.forEach(status => {
              const label = statusLabels[status.statusID] || '❓ Unknown';
              console.log(`   ${status.number}: ${label}`);
            });
          }
        } else {
          console.error(`❌ Failed to send SMS: ${smsResponse.message}`);
        }
      } else {
        console.log('⚠️  No authorized brand names found.');
        console.log('💡 Creating a new brand name...\n');

        // Create a new brand name
        const newBrand = await client.createBrandName('MyApp');
        
        if (newBrand.statusID === 0) {
          console.log(`✅ Brand name created successfully!`);
          console.log(`🆔 Brand ID: ${newBrand.brandID}`);
          console.log(`⏳ Status: Waiting for approval`);
          console.log(`💡 You'll be able to send SMS once the brand name is approved.\n`);
        } else {
          console.error(`❌ Failed to create brand: ${newBrand.message}`);
        }
      }
    }

    console.log('\n✨ Workflow completed!');

  } catch (error) {
    console.error('\n❌ Error occurred:', error);
  }
}

// Run the example
advancedExample();

