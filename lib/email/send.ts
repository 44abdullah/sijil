import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'سِجل <onboarding@resend.dev>';

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing');
    return { error: 'Missing API key' };
  }

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    return result;
  } catch (error) {
    console.error('Failed to send email:', error);
    return { error };
  }
}
