import { NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';
import nodemailer from 'nodemailer';

const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  eventInterest: z.string().optional(),
  message: z.string().min(5).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const parse = LeadSchema.safeParse(data);

    if (!parse.success) {
      return NextResponse.json({ success: false, error: parse.error.flatten() }, { status: 400 });
    }

    const { name, email, phone, eventInterest, message } = parse.data;

    const SMTP_USER = process.env.EMAIL_USER;
    const SMTP_PASS = process.env.EMAIL_PASS;
    const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    if (!SMTP_USER || !SMTP_PASS) {
      console.error('Missing EMAIL_USER or EMAIL_PASS in env');
      return NextResponse.json({ success: false, message: 'Email service not configured.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const subject = `New Lead: ${name}${eventInterest ? ` (${eventInterest})` : ''}`;
    const html = `<p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Interested In:</strong> ${eventInterest || 'General'}</p>
      <hr/>
      <p>${message}</p>`;
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterested In: ${eventInterest || 'General'}\n\n${message}`;

    try {
      const info = await transporter.sendMail({ from: SMTP_USER, to: RECEIVER_EMAIL, subject, text, html, replyTo: email });
      console.info('Lead email sent to receiver:', info.messageId);

      // Also send confirmation email back to the lead
      try {
        const confirmationSubject = `Thanks for contacting SportsTravel`;
        const confirmationHtml = `<p>Hi ${name},</p>
          <p>Thanks for your interest — our team will get in touch shortly to discuss your request.</p>
          <p><strong>Your submission:</strong></p>
          <p>${message}</p>
          <hr/>
          <p>If you need immediate assistance, reply to this email or call us at ${RECEIVER_EMAIL || SMTP_USER}.</p>`;
        const confirmationText = `Hi ${name},\n\nThanks for your interest — our team will get in touch shortly.\n\nYour submission:\n${message}\n\nIf you need immediate assistance, reply to this email or call us at ${RECEIVER_EMAIL || SMTP_USER}`;

        const userInfo = await transporter.sendMail({ from: SMTP_USER, to: email, subject: confirmationSubject, text: confirmationText, html: confirmationHtml, replyTo: RECEIVER_EMAIL });
        console.info('Confirmation email sent to lead:', userInfo.messageId);
      } catch (err) {
        console.error('Failed to send confirmation email to lead:', err);
        // Do not fail the whole request if confirmation fails
      }

      return NextResponse.json({ success: true, message: 'Lead received — we will contact you shortly.' });
    } catch (err) {
      console.error('Error sending lead email:', err);
      return NextResponse.json({ success: false, message: 'Failed to send lead email' }, { status: 500 });
    }
  } catch (err) {
    console.error('Error in leads route:', err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
