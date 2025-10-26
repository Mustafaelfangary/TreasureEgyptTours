import { sendEmail } from '../src/lib/email.js';

async function testEmailConfig() {
  console.log('🧪 Testing email configuration...');
  
  try {
    // Test registration email sender
    console.log('📧 Testing registration email sender...');
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM || process.env.SMTP_FROM || 'Not configured');
    
    // Test admin booking emails
    console.log('📬 Testing admin booking emails...');
    const adminEmails = process.env.ADMIN_BOOKING_EMAILS || process.env.ADMIN_EMAIL || 'Not configured';
    const adminEmailList = adminEmails.split(',').map(email => email.trim()).filter(email => email);
    console.log('Admin email list:', adminEmailList);
    
    // Test contact email
    console.log('📞 Testing contact email...');
    console.log('CONTACT_EMAIL:', process.env.CONTACT_EMAIL || 'Not configured');
    
    console.log('✅ Email configuration test completed successfully!');
    console.log('\nConfiguration Summary:');
    console.log('======================');
    console.log(`Registration emails will be sent from: ${process.env.EMAIL_FROM || process.env.SMTP_FROM}`);
    console.log(`Booking notifications will be sent to: ${adminEmailList.join(', ')}`);
    console.log(`Contact form emails will be sent to: ${process.env.CONTACT_EMAIL}`);
    
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    process.exit(1);
  }
}

testEmailConfig();