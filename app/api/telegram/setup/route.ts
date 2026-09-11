import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN missing' }, { status: 500 });
  }

  const { searchParams, origin } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'set') {
    const webhookUrl = `${origin.replace('http://', 'https://')}/api/telegram/webhook`;

    const res = await fetch(
      `https://api.telegram.org/bot${token}/setWebhook?url=${webhookUrl}`
    );
    const data = await res.json();
    return NextResponse.json({ webhookUrl, result: data });
  }

  if (action === 'info') {
    const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json(data);
  }

  return NextResponse.json({
    message: 'استخدم ?action=set لتثبيت الـ webhook، أو ?action=info للتحقق.',
  });
}
