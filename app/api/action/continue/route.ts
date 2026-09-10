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

  const today = new Date();
  const newRenewal = new Date(today);
  newRenewal.setDate(newRenewal.getDate() + sub.cycle_days);

  await supabase
    .from('subscriptions')
    .update({
      renewal_date: newRenewal.toISOString().split('T')[0],
      status: 'active',
    })
    .eq('id', subId);

  await supabase.from('reminders_log').insert({
    subscription_id: subId,
    type: 'continue',
    acknowledged: true,
  });

  return NextResponse.redirect(`${origin}/acknowledged?action=continue`);
}
