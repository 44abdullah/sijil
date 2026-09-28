export type InlineKeyboardButton = {
  text: string;
  url?: string;
  callback_data?: string;
};

export async function sendTelegramMessage(
  chatId: string,
  html: string,
  replyMarkup?: {
    inline_keyboard: InlineKeyboardButton[][];
  }
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return { ok: false, error: 'missing token' };
  }

  try {
    const body: Record<string, any> = {
      chat_id: chatId,
      text: html,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    };

    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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