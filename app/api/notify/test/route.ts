import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendTelegramMessage } from '@/lib/telegram/send';
import { sendEmail } from '@/lib/email/send';
import { ReminderEmail } from '@/emails/reminder';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !sub) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewalDate = new Date(sub.renewal_date);
    renewalDate.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sijil-ivory.vercel.app';
    const cancelUrl = `${appUrl}/api/action/cancel?sub=${sub.id}`;
    const changeUrl = `${appUrl}/dashboard/${sub.id}/edit`;
    const continueUrl = `${appUrl}/api/action/continue?sub=${sub.id}`;
    const snoozeUrl = `${appUrl}/api/action/snooze?sub=${sub.id}`;

    let telegramSent = false;
    let emailSent = false;

    // 1) فحص التيليجرام
    const { data: telegramLink } = await supabase
      .from('telegram_links')
      .select('chat_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (telegramLink?.chat_id) {
      const telegramText = [
        `⏰ <b>تذكير تجريبي من سِجل</b>`,
        ``,
        `اشتراكك في <b>${sub.name}</b> بيتجدد خلال <b>${daysLeft}</b> يوم.`,
        ``,
        `💰 السعر: <b>${Number(sub.price).toFixed(2)} ${sub.currency}</b>`,
        `📅 تاريخ التجديد: <b>${sub.renewal_date}</b>`,
        ``,
        `اختر الإجراء المناسب للاشتراك:`,
      ].join('\n');

      const inlineKeyboard = [
        [
          { text: '✅ استمرار بالاشتراك', url: continueUrl },
          { text: '⏳ تأجيل التنبيه', url: snoozeUrl },
        ],
        [
          { text: '✏️ تعديل الاشتراك', url: changeUrl },
          { text: '❌ إلغاء الاشتراك', url: cancelUrl },
        ],
      ];

      const res = await sendTelegramMessage(telegramLink.chat_id, telegramText, {
        inline_keyboard: inlineKeyboard,
      });

      if (res.ok) {
        telegramSent = true;
      }
    }

    // 2) إرسال الإيميل إن وجد
    if (user.email && process.env.RESEND_API_KEY) {
      const html = ReminderEmail({
        subscriptionName: sub.name,
        price: Number(sub.price),
        currency: sub.currency,
        renewalDate: sub.renewal_date,
        daysLeft,
        cancelUrl,
        changeUrl,
        continueUrl,
        snoozeUrl,
      });

      const res = await sendEmail({
        to: user.email,
        subject: `[تنبيه تجريبي] اشتراكك في ${sub.name} بيتجدد خلال ${daysLeft} يوم`,
        html,
      });

      if (res && !('error' in res && res.error)) {
        emailSent = true;
      }
    }

    if (!telegramSent && !emailSent) {
      return NextResponse.json(
        {
          error:
            'لم يتم إرسال التنبيه. تأكد من ربط حساب التيليجرام من الإعدادات أو التحقق من مفاتيح الإرسال.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'تم إرسال التنبيه بنجاح!',
      telegramSent,
      emailSent,
    });
  } catch (error) {
    console.error('Manual notify error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء إرسال التنبيه' }, { status: 500 });
  }
}