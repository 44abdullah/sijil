export async function sendTelegramMessage(
  chatId: string,
  html: string
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return { ok: false, error: 'missing token' };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: html,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      return { ok: false, error: data.description ?? 'telegram error' };
    }

    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
