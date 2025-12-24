/**
 * Brand Management Example
 * 
 * This example shows how to manage brand names (sender IDs)
 */

import { UBillSMSClient } from '../src';

async function brandManagementExample() {
  const client = new UBillSMSClient({
    apiKey: process.env.UBILL_API_KEY || 'your-api-key-here'
  });

  try {
    console.log('🏷️  Brand Name Management Example\n');

    // Get all existing brand names
    console.log('📋 Fetching all brand names...');
    const brands = await client.getBrandNames();

    if (brands.statusID === 0 && brands.data) {
      if (brands.data.length === 0) {
        console.log('No brand names found.\n');
      } else {
        console.log(`Found ${brands.data.length} brand name(s):\n`);
        
        brands.data.forEach(brand => {
          console.log(`Brand Name: ${brand.name}`);
          console.log(`  ID: ${brand.id}`);
          console.log(`  Status: ${brand.authorized === '1' ? '✅ Authorized' : '⏳ Pending approval'}`);
          console.log(`  Created: ${brand.createdAt}`);
          console.log('');
        });
      }

      // Create a new brand name
      console.log('➕ Creating a new brand name...');
      const newBrandName = 'MyCompany'; // 2-11 characters, alphanumeric

      const createResponse = await client.createBrandName(newBrandName);

      if (createResponse.statusID === 0) {
        console.log('✅ Brand name created successfully!');
        console.log(`Brand ID: ${createResponse.brandID}`);
        console.log(`Name: ${newBrandName}`);
        console.log('\n💡 Note: Your brand name must be approved before you can use it for sending SMS.');
      } else {
        console.log(`ℹ️  ${createResponse.message}`);
        
        // Handle specific error cases
        switch (createResponse.statusID) {
          case 10:
            console.log('Please provide a brand name.');
            break;
          case 20:
            console.log('Brand name must be between 2 and 11 characters.');
            break;
          case 30:
            console.log('Brand name contains unauthorized characters. Use only alphanumeric characters.');
            break;
          case 40:
            console.log('This brand name already exists in your account.');
            break;
          case 50:
            console.log('Please wait for your previous brand name to be authenticated.');
            break;
        }
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the example
brandManagementExample();

