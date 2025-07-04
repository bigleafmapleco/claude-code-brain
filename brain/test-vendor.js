const VendorSpecManager = require('./vendor-sync');

async function testVendor() {
  console.log('Testing Vendor Sync System...\n');
  
  const vendor = new VendorSpecManager();
  
  // Initialize
  console.log('1. Initializing vendor specs...');
  await vendor.initialize();
  
  // Detect stack
  console.log('\n2. Detecting project stack...');
  await vendor.detectProjectStack();
  
  // Sync specs
  console.log('\n3. Syncing specifications...');
  await vendor.syncAll();
  
  // Check updates
  console.log('\n4. Checking for updates...');
  const needsUpdate = await vendor.checkForUpdates();
  console.log('Specs needing update:', needsUpdate);
  
  // Get a spec
  console.log('\n5. Reading Next.js spec...');
  const nextSpec = await vendor.getSpec('nextjs');
  if (nextSpec) {
    console.log('Next.js version:', nextSpec.version);
    console.log('Key patterns available:', Object.keys(nextSpec.keyPatterns));
  }
  
  console.log('\n✅ Vendor sync test complete!');
}

testVendor().catch(console.error);