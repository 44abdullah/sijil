'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { value: 'all', label: 'الكل' },
  { value: 'delivery', label: 'توصيل' },
  { value: 'fitness', label: 'لياقة' },
  { value: 'entertainment', label: 'ترفيهية' },
  { value: 'telecom', label: 'اتصالات' },
  { value: 'software', label: 'برامج' },
  { value: 'other', label: 'أخرى' },
];

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  awaiting_renewal: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  trial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  expired: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<string, string> = {
  active: 'فعّال',
  awaiting_renewal: 'بانتظار تجديد',
  trial: 'تجريبي',
  expired: 'منتهي',
  cancelled: 'ملغي',
};
const categoryIcons: Record<string, string> = {
  delivery: '🚚',
  fitness: '💪',
  entertainment: '🎬',
  telecom: '📱',
  software: '💻',
  other: '📦',
};
const statusOrder: Record<string, number> = {
  active: 1,
  awaiting_renewal: 2,
  trial: 3,
  expired: 4,
  cancelled: 5,
};

export function SubscriptionsFilter({ subs }: { subs: any[] }) {
  const [selected, setSelected] = useState('all');

  const filtered =
    selected === 'all' ? subs : subs.filter((s) => s.category === selected);

  const sorted = [...filtered].sort((a, b) => {
    const orderA = statusOrder[a.status] ?? 99;
    const orderB = statusOrder[b.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return new Date(a.renewal_date).getTime() - new Date(b.renewal_date).getTime();
  });

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map((cat) => {
          const count =
            cat.value === 'all'
              ? subs.length
              : subs.filter((s) => s.category === cat.value).length;

          return (
            <button
              key={cat.value}
              onClick={() => setSelected(cat.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selected === cat.value
                  ? 'bg-brand-600 text-white'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-brand-300'
              }`}
            >
              {cat.label}
              <span
                className={`mr-2 text-xs ${
                  selected === cat.value ? 'opacity-90' : 'text-gray-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 mb-4">
            {selected === 'all'
              ? 'ما عندك أي اشتراك بعد.'
              : 'ما فيه اشتراكات في هذا التصنيف.'}
          </p>
          {selected === 'all' && (
            <Link
              href="/dashboard/new"
              className="inline-block px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
            >
              أضف أول اشتراك
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </>
  );
}

function SubscriptionCard({ sub }: { sub: any }) {
  const daysLeft = Math.ceil(
    (new Date(sub.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Link
      href={`/dashboard/${sub.id}`}
      className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-500 transition block"
    >
           <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">
            {categoryIcons[sub.category] ?? '📦'}
          </span>
          <h3 className="font-bold text-lg">{sub.name}</h3>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            statusColors[sub.status] ?? statusColors.active
          }`}
        >
          {statusLabels[sub.status] ?? sub.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        {Number(sub.price).toFixed(2)} {sub.currency}
      </p>
      <p className="text-xs text-gray-400">
        {daysLeft > 0 ? `باقي ${daysLeft} يوم` : `متأخر ${Math.abs(daysLeft)} يوم`}
      </p>
    </Link>
  );
}
