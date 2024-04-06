import nodemailer from 'nodemailer';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ritukumarichoudhary4@gmail.com",
    pass: "sosoozorqnfpfpfu"
  }
});

export const sendOTPEmail = async (recipientEmail, otp) => {
    const mailOptions = {
      from: "ritukumarichoudhary4@gmail.com",
      to: recipientEmail,
      subject: 'Your OTP for Verification',
      text: `Your OTP for verification is: ${otp}. It will expire in 5 minutes.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('OTP email sent successfully.');
    } catch (error) {
      console.error('Error sending OTP email:', error.message);
      throw error; // Rethrow error for better error handling
    }
  };


  export default nodemailer;