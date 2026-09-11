import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewSubscriptionTabs } from '@/components/NewSubscriptionTabs';

export const dynamic = 'force-dynamic';

export default async function NewSubscriptionPage() {
  const supabase = await createClient();

  const { data: alternatives } = await supabase
    .from('alternatives')
    .select('*')
    .order('category');

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block"
        >
          ← رجوع للوحة التحكم
        </Link>

        <h1 className="text-2xl font-bold mb-6">إضافة اشتراك جديد</h1>

        <NewSubscriptionTabs alternatives={alternatives ?? []} />
      </div>
    </main>
  );
}
