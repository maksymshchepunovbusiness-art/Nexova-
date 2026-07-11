import { rateLimitResponse } from '@/lib/rate-limit';
import { validateBody, ContactSchema } from '@/lib/validate';

export async function POST(req: Request) {
  // Rate limit
  const limited = await rateLimitResponse(req);
  if (limited) return limited;

  // Validate
  const { data, response: validationError } = await validateBody(req, ContactSchema);
  if (validationError) return validationError;

  // Send to Telegram
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return new Response(
      JSON.stringify({ error: 'Konfiguracja serwera niekompletna.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const text = [
    '📬 <b>Nowe zapytanie — Nexova</b>',
    '',
    `<b>Imię:</b> ${esc(data.name)}`,
    `<b>Email:</b> ${esc(data.email)}`,
    data.phone ? `<b>Tel:</b> ${esc(data.phone)}` : null,
    data.locale ? `<b>Język:</b> ${esc(data.locale)}` : null,
    '',
    `<b>Wiadomość:</b>\n${esc(data.message)}`,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!tgRes.ok) {
      const err = await tgRes.text();
      console.error('Telegram API error:', err);
      return new Response(
        JSON.stringify({ error: 'Nie udało się wysłać wiadomości.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (err) {
    console.error('Telegram fetch error:', err);
    return new Response(
      JSON.stringify({ error: 'Błąd sieci.' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
