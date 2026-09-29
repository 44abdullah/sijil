'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const CATEGORY_LABELS: Record<string, string> = {
  delivery: 'توصيل',
  fitness: 'لياقة',
  entertainment: 'ترفيهية',
  telecom: 'اتصالات',
  software: 'برامج',
  other: 'أخرى',
};

// Rich harmonious palette matching emerald/teal theme
const COLORS = ['#10b981', '#06b6d4', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];

type Props = {
  data: { category: string; total: number }[];
};

export function SpendingChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 text-sm font-medium">
        أضف اشتراكات لتسجيل وتوزيع الرسم البياني للمصاريف
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: CATEGORY_LABELS[d.category] ?? d.category,
    value: Number(d.total.toFixed(2)),
  }));

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                className="transition-all duration-200 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} ر.س`, 'التكلفة الشهريّة']}
            contentStyle={{
              borderRadius: '16px',
              backgroundColor: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: '600',
            }}
            itemStyle={{ color: '#34d399' }}
          />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            wrapperStyle={{ fontSize: 13, paddingTop: 16 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
