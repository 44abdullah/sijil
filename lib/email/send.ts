import { Resend } from 'resend';

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
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is missing');
    return { error: 'Missing API key' };
  }

  try {
    const resend = new Resend(apiKey);
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
