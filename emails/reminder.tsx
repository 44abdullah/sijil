type ReminderEmailProps = {
  subscriptionName: string;
  price: number;
  currency: string;
  renewalDate: string;
  daysLeft: number;
  cancelUrl: string;
  changeUrl: string;
  continueUrl: string;
  snoozeUrl: string;
};

export function ReminderEmail({
  subscriptionName,
  price,
  currency,
  renewalDate,
  daysLeft,
  cancelUrl,
  changeUrl,
  continueUrl,
  snoozeUrl,
}: ReminderEmailProps) {
  return `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>تذكير تجديد اشتراك</title>
</head>
<body style="font-family: system-ui, -apple-system, 'Segoe UI', Tahoma, sans-serif; background: #f9fafb; margin: 0; padding: 24px; direction: rtl;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
    
    <h1 style="color: #0d9488; margin: 0 0 8px 0; font-size: 24px;">سِجل</h1>
    
    <p style="font-size: 14px; color: #6b7280; margin: 0 0 24px 0;">
      تذكير باشتراكك
    </p>

    <h2 style="font-size: 20px; margin: 0 0 16px 0; color: #111827;">
      اشتراكك في <strong>${subscriptionName}</strong> بيتجدد قريب
    </h2>

    <div style="background: #f0fdf9; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 4px 0; color: #0f766e; font-size: 14px;">
        <strong>السعر:</strong> ${price.toFixed(2)} ${currency}
      </p>
      <p style="margin: 4px 0; color: #0f766e; font-size: 14px;">
        <strong>تاريخ التجديد:</strong> ${renewalDate}
      </p>
      <p style="margin: 4px 0; color: #0f766e; font-size: 14px;">
        <strong>باقي:</strong> ${daysLeft} يوم
      </p>
    </div>

    <p style="font-size: 14px; color: #374151; margin-bottom: 24px;">
      وش تبي تسوي؟
    </p>

    <div style="display: block; margin-bottom: 12px;">
      <a href="${continueUrl}" style="display: block; background: #0d9488; color: white; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        استمر على نفس الاشتراك
      </a>
    </div>

    <div style="display: block; margin-bottom: 12px;">
      <a href="${changeUrl}" style="display: block; background: #f3f4f6; color: #374151; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        غيّر مدة أو سعر الاشتراك
      </a>
    </div>

    <div style="display: block; margin-bottom: 12px;">
      <a href="${snoozeUrl}" style="display: block; background: #f3f4f6; color: #374151; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        ذكّرني بعد يوم
      </a>
    </div>

    <div style="display: block; margin-bottom: 24px;">
      <a href="${cancelUrl}" style="display: block; background: #fef2f2; color: #b91c1c; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        إلغاء الاشتراك
      </a>
    </div>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

    <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
      وصلتك هذي الرسالة من <strong>سِجل</strong> لأنك فعّلت التنبيهات.
    </p>
    
  </div>
</body>
</html>
  `;
}
