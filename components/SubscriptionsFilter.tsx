'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SendNotificationButton } from '@/components/SendNotificationButton';
import { 
  Truck, 
  Dumbbell, 
  Film, 
  Smartphone, 
  Laptop, 
  Package, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  AlertCircle,
  CheckCircle2,
  Plus
} from 'lucide-react';

const CATEGORIES = [
  { value: 'all', label: 'الكل', icon: Package },
  { value: 'delivery', label: 'توصيل', icon: Truck },
  { value: 'fitness', label: 'لياقة', icon: Dumbbell },
  { value: 'entertainment', label: 'ترفيهية', icon: Film },
  { value: 'telecom', label: 'اتصالات', icon: Smartphone },
  { value: 'software', label: 'برامج', icon: Laptop },
  { value: 'other', label: 'أخرى', icon: Package },
];

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  active: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  awaiting_renewal: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15 border-amber-500/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  trial: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-500/20',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  expired: {
    bg: 'bg-slate-500/10 dark:bg-slate-500/15 border-slate-500/20',
    text: 'text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
  cancelled: {
    bg: 'bg-rose-500/10 dark:bg-rose-500/15 border-rose-500/20',
    text: 'text-rose-700 dark:text-rose-400',
    dot: 'bg-rose-500',
  },
};

const statusLabels: Record<string, string> = {
  active: 'فعّال',
  awaiting_renewal: 'بانتظار تجديد',
  trial: 'تجريبي',
  expired: 'منتهي',
  cancelled: 'ملغي',
};

const categoryIconMap: Record<string, any> = {
  delivery: Truck,
  fitness: Dumbbell,
  entertainment: Film,
  telecom: Smartphone,
  software: Laptop,
  other: Package,
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
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const count =
            cat.value === 'all'
              ? subs.length
              : subs.filter((s) => s.category === cat.value).length;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.value}
              onClick={() => setSelected(cat.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selected === cat.value
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                  : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50'
              }`}
            >
              <IconComp className={`w-4 h-4 ${selected === cat.value ? 'text-white' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  selected === cat.value
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Subscription Grid List */}
      {sorted.length === 0 ? (
        <div className="text-center py-20 bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
            {selected === 'all' ? 'لا توجد اشتراكات مضافة بعد' : 'لا توجد اشتراكات في هذا التصنيف'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            {selected === 'all'
              ? 'أضف اشتراكاتك الآن لتلقي التنبيهات التلقائية قبل أي عملية خصم.'
              : 'يمكنك اختيار تصنيف آخر أو إضافة اشتراك جديد.'}
          </p>
          {selected === 'all' && (
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول اشتراك</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
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

  const IconComponent = categoryIconMap[sub.category] || Package;
  const style = statusStyles[sub.status] || statusStyles.active;

  const isUrgent = daysLeft <= 3 && daysLeft >= 0 && sub.status === 'active';

  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      {isUrgent && (
        <div className="absolute top-0 right-0 left-0 h-1 bg-amber-500 animate-pulse" />
      )}

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
              {sub.image_url ? (
                <img
                  src={sub.image_url}
                  alt={`شعار ${sub.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <IconComponent className="w-6 h-6" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-1">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium capitalize">
                {sub.billing_cycle === 'monthly' ? 'شهري' : sub.billing_cycle === 'yearly' ? 'سنوي' : sub.billing_cycle}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${style.bg} ${style.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {statusLabels[sub.status] ?? sub.status}
          </span>
        </div>

        <div className="my-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">التكلفة</p>
            <p className="text-lg font-black text-slate-900 dark:text-white">
              {Number(sub.price).toFixed(2)}{' '}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{sub.currency || 'ر.س'}</span>
            </p>
          </div>

          <div className="text-left">
            <p className="text-[10px] text-slate-400 font-semibold uppercase">تاريخ التجديد</p>
            <p className={`text-xs font-bold flex items-center gap-1 ${daysLeft <= 3 ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-600 dark:text-slate-300'}`}>
              <Clock className="w-3.5 h-3.5" />
              {daysLeft > 0 ? `باقي ${daysLeft} يوم` : daysLeft === 0 ? 'اليوم' : `متأخر ${Math.abs(daysLeft)} يوم`}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <SendNotificationButton subscriptionId={sub.id} />
        <Link
          href={`/dashboard/${sub.id}`}
          className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <span>التفاصيل</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
