import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const subId = searchParams.get('sub');

  if (!subId) {
    return NextResponse.redirect(`${origin}/?error=missing_sub`);
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', subId)
    .single();

  if (!sub) {
    return NextResponse.redirect(`${origin}/?error=not_found`);
  }

  // نقلل reminder_days بمقدار يوم (نتجاهل لو صار 0)
  const newReminderDays = Math.max(1, sub.reminder_days - 1);

  await supabase
    .from('subscriptions')
    .update({ reminder_days: newReminderDays })
    .eq('id', subId);

  await supabase.from('reminders_log').insert({
    subscription_id: subId,
    type: 'snooze',
    acknowledged: true,
  });

  return NextResponse.redirect(`${origin}/acknowledged?action=snooze`);
}
