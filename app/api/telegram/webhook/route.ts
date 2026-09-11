import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const update = await request.json();

    const message = update.message;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const username = message.from?.username ?? null;
    const firstName = message.from?.first_name ?? null;

    // /start user_id
    if (!text.startsWith('/start')) {
      await sendTelegramMessage(
        chatId,
        'أرسل /start عشان تربط حسابك.'
      );
      return NextResponse.json({ ok: true });
    }

    const parts = text.split(' ');
    const userId = parts[1];

    if (!userId) {
      await sendTelegramMessage(
        chatId,
        'مرحبًا! عشان تربط حسابك، افتح الرابط من صفحة الإعدادات في سِجل.'
      );
      return NextResponse.json({ ok: true });
    }

    // نحفظ الربط
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // نتأكد إن المستخدم موجود
    const { data: userData } = await supabase.auth.admin.getUserById(userId);

    if (!userData?.user) {
      await sendTelegramMessage(chatId, 'ما لقينا حسابك في سِجل.');
      return NextResponse.json({ ok: true });
    }

    // نحذف أي ربط قديم لنفس chat_id
    await supabase
      .from('telegram_links')
      .delete()
      .eq('chat_id', chatId);

    // نضيف الربط الجديد
    const { error } = await supabase.from('telegram_links').upsert(
      {
        user_id: userId,
        chat_id: chatId,
        username,
        first_name: firstName,
      },
      { onConflict: 'user_id' }
    );

    if (error) {
      console.error('Telegram link error:', error);
      await sendTelegramMessage(chatId, 'صار خطأ. جرب مرة ثانية.');
      return NextResponse.json({ ok: true });
    }

    await sendTelegramMessage(
      chatId,
      '✅ تم ربط حسابك في سِجل! بنرسل لك تنبيهات الاشتراكات هنا.'
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
