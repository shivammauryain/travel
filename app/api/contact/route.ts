import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import nodemailer from 'nodemailer';

const ContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  eventType: z.string().optional(),
  message: z.string().min(5).optional(),
});

const SMTP_USER = process.env.EMAIL_USER;
const SMTP_PASS = process.env.EMAIL_PASS;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

function getTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('Missing email configuration in env variables (EMAIL_USER / EMAIL_PASS)');
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parse = ContactSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ success: false, error: parse.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, eventType, message } = parse.data;

    const transporter = getTransporter();
    const subject = `Contact Form: ${name} ${eventType ? `- ${eventType}` : ''}`;
    const html = `<p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Event interest:</strong> ${eventType || 'General'}</p>
      <hr/>
      <p>${message}</p>`;
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nEvent interest: ${eventType || 'General'}\n\n${message}`;

    const info = await transporter.sendMail({
      from: SMTP_USER,
      to: RECEIVER_EMAIL,
      subject,
      text,
      html,
      replyTo: email,
    });

    console.info('Email sent to receiver:', info.messageId);

    // Send confirmation email back to the user
    try {
      const confirmationSubject = `Thanks for contacting SportsTravel`;
      const confirmationHtml = `<p>Hi ${name},</p>
        <p>Thanks for reaching out — our team will connect with you soon to discuss your request.</p>
        <p><strong>Your submission:</strong></p>
        <p>${message}</p>
        <hr/>
        <p>If you need immediate assistance, reply to this email or call us at ${RECEIVER_EMAIL || SMTP_USER}.</p>`;
      const confirmationText = `Hi ${name},\n\nThanks for reaching out — our team will connect with you soon.\n\nYour submission:\n${message}\n\nIf you need immediate assistance, reply to this email or call us at ${RECEIVER_EMAIL || SMTP_USER}`;

      const userInfo = await transporter.sendMail({
        from: SMTP_USER,
        to: email,
        subject: confirmationSubject,
        text: confirmationText,
        html: confirmationHtml,
        replyTo: RECEIVER_EMAIL,
      });

      console.info('Confirmation email sent to user:', userInfo.messageId);
    } catch (err) {
      console.error('Failed to send confirmation email to user:', err);
      // Do not fail the whole request if the confirmation email fails
    }

    return NextResponse.json({ success: true, message: 'Thanks! We received your message and will contact you shortly.' });
  } catch (err) {
    console.error('Error in contact route:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
