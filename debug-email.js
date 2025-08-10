// Debug script to test email functionality
require('dotenv').config({ path: '.env.local' });

console.log('=== EMAIL DEBUG TEST ===');
console.log('Environment variables:');
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length || 0);
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

// Test email parameters
const testEmail = 'test@example.com';
const testOtp = '123456';
const testUsername = 'testuser';

console.log('\nTest parameters:');
console.log('Email:', testEmail);
console.log('OTP:', testOtp);
console.log('Username:', testUsername);

// Test if parameters are valid
if (!testEmail) {
  console.error('❌ Test email is null or undefined');
} else {
  console.log('✅ Test email is valid');
}

if (!testOtp) {
  console.error('❌ Test OTP is null or undefined');
} else {
  console.log('✅ Test OTP is valid');
}

if (!testUsername) {
  console.error('❌ Test username is null or undefined');
} else {
  console.log('✅ Test username is valid');
}

console.log('\n=== DEBUG TEST COMPLETE ===');
console.log('\nNext steps:');
console.log('1. Create a .env.local file with your RESEND_API_KEY');
console.log('2. Run: npm run dev');
console.log('3. Try signing up with a real email address');
console.log('4. Check the console logs for detailed debugging information'); 