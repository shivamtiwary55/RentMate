import cron from 'node-cron';
import nodemailer from 'nodemailer';
import { User } from '../models/user.model.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // use Gmail App Password
  }
});

export const startRentReminder = () => {
  // Runs every month on the 25th at 9:00 AM
  cron.schedule('0 9 25 * *', async () => {
    console.log('Running rent reminder job...');
    try {
      const students = await User.find({ role: 'student' });

      for (const student of students) {
        await transporter.sendMail({
          from: `"RentMate" <${process.env.EMAIL_USER}>`,
          to: student.email,
          subject: '🏠 RentMate — Rent Due in 5 Days!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
              <div style="background: #6C63FF; padding: 20px; border-radius: 8px 8px 0 0;">
                <h2 style="color: white; margin: 0;">🏠 RentMate</h2>
              </div>
              <div style="padding: 24px; border: 1px solid #eee; border-radius: 0 0 8px 8px;">
                <h3>Hi ${student.name}! 👋</h3>
                <p>This is a friendly reminder that your <strong>rent is due in 5 days</strong> (on the 1st).</p>
                <p>Please make sure to pay on time to avoid any issues with your landlord.</p>
                <div style="background: #EEF0FF; padding: 16px; border-radius: 8px; margin: 16px 0;">
                  <p style="margin: 0; color: #6C63FF;"><strong>Action needed:</strong> Pay your rent before the 1st of next month.</p>
                </div>
                <p style="color: #888; font-size: 0.85rem;">— RentMate Team</p>
              </div>
            </div>
          `
        });
      }
      console.log(`Rent reminders sent to ${students.length} students`);
    } catch (error) {
      console.error('Rent reminder error:', error.message);
    }
  });

  console.log('Rent reminder cron job started');
};