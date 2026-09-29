import { createClient } from '@/lib/supabase/client';

// Adjust these values according to your Supabase setup
const supabase = createClient();

const mockSubscriptions = [
  {
    name: 'خدمة توصيل سريعة',
    category: 'delivery',
    billing_cycle: 'monthly',
    price: 9.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1589187151475-2e90e9c2a8c1?auto=format&fit=crop&w=80&q=80',
    status: 'active',
    renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'اشتراك لياقة بدنية',
    category: 'fitness',
    billing_cycle: 'monthly',
    price: 29.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=80&q=80',
    status: 'active',
    renewal_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'منصة ترفيهية عربية',
    category: 'entertainment',
    billing_cycle: 'yearly',
    price: 119.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=80&q=80',
    status: 'awaiting_renewal',
    renewal_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'باقة إنترنت للهواتف',
    category: 'telecom',
    billing_cycle: 'monthly',
    price: 15.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&q=80',
    status: 'active',
    renewal_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'برنامج تحرير فيديو احترافي',
    category: 'software',
    billing_cycle: 'yearly',
    price: 199.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=80&q=80',
    status: 'active',
    renewal_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    name: 'نموذج اشتراك عام',
    category: 'other',
    billing_cycle: 'monthly',
    price: 5.99,
    currency: 'ر.س',
    image_url: 'https://images.unsplash.com/photo-1581090700229-cf5c0ad8f6cd?auto=format&fit=crop&w=80&q=80',
    status: 'trial',
    renewal_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function seed() {
  console.log('Seeding mock subscriptions...');
  for (const sub of mockSubscriptions) {
    const { data, error } = await supabase.from('subscriptions').upsert(sub, { onConflict: 'name' });
    if (error) {
      console.error('Failed to insert', sub.name, error);
    } else {
      console.log('Inserted/updated', sub.name);
    }
  }
  console.log('Seeding complete.');
}

seed().catch((e) => console.error('Unexpected error', e));
