import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/email/send';
import { ReminderEmail } from '@/emails/reminder';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // التحقق من أن الطلب من Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // نستخدم service_role لأننا نبي نتجاوز RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // نجيب كل الاشتراكات الفعالة
  const { data: subs, error } = await supabase
    .from('subscriptions')
    .select('*, profiles!inner(email)')
    .in('status', ['active', 'trial']);

  if (error) {
    console.error('Failed to fetch subscriptions:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = {
    processed: 0,
    sent: 0,
    errors: 0,
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sijil-ivory.vercel.app';

  for (const sub of subs ?? []) {
    results.processed++;

    const renewalDate = new Date(sub.renewal_date);
    renewalDate.setHours(0, 0, 0, 0);

    const daysLeft = Math.ceil(
      (renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    // هل حان وقت التنبيه؟
    if (daysLeft !== sub.reminder_days) {
      continue;
    }

    // هل أرسلنا تنبيه مسبقًا لهذا الاشتراك؟
    const { data: existing } = await supabase
      .from('reminders_log')
      .select('id')
      .eq('subscription_id', sub.id)
      .eq('type', 'before_renewal')
      .gte('sent_at', new Date(today.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString())
      .maybeSingle();

    if (existing) {
      continue;
    }

    // نرسل الإيميل
    const email = (sub.profiles as any).email;
    const userEmail = email ?? '';

    if (!userEmail) continue;

    const html = ReminderEmail({
      subscriptionName: sub.name,
      price: Number(sub.price),
      currency: sub.currency,
      renewalDate: sub.renewal_date,
      daysLeft,
      cancelUrl: `${appUrl}/api/action/cancel?sub=${sub.id}`,
      changeUrl: `${appUrl}/dashboard/${sub.id}/edit`,
      continueUrl: `${appUrl}/api/action/continue?sub=${sub.id}`,
      snoozeUrl: `${appUrl}/api/action/snooze?sub=${sub.id}`,
    });

    const result = await sendEmail({
      to: userEmail,
      subject: `تذكير: اشتراكك في ${sub.name} بيتجدد خلال ${daysLeft} يوم`,
      html,
    });

    if ('error' in result && result.error) {
      results.errors++;
      continue;
    }

    // نسجل التنبيه
    await supabase.from('reminders_log').insert({
      subscription_id: sub.id,
      type: 'before_renewal',
    });

    results.sent++;
  }

  return NextResponse.json({
    ok: true,
    ...results,
    date: today.toISOString(),
  });
}
