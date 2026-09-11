export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

export async function searchAkbankEmails(
  accessToken: string,
  query: string = 'Akbank'
): Promise<GmailMessageSummary[]> {
  const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}&maxResults=10`;
  const listRes = await fetch(listUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!listRes.ok) {
    const errorData = await listRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail API error (${listRes.status})`);
  }

  const listData = await listRes.json();
  if (!listData.messages || listData.messages.length === 0) {
    return [];
  }

  const summaries: GmailMessageSummary[] = [];

  for (const msg of listData.messages.slice(0, 10)) {
    try {
      const msgUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`;
      const msgRes = await fetch(msgUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (msgRes.ok) {
        const fullMsg = await msgRes.json();
        const headers: Array<{ name: string; value: string }> = fullMsg.payload?.headers || [];
        const subjectHeader = headers.find(h => h.name.toLowerCase() === 'subject')?.value || '(Konu Yok)';
        const fromHeader = headers.find(h => h.name.toLowerCase() === 'from')?.value || '';
        const dateHeader = headers.find(h => h.name.toLowerCase() === 'date')?.value || '';

        summaries.push({
          id: fullMsg.id,
          threadId: fullMsg.threadId,
          snippet: fullMsg.snippet,
          subject: subjectHeader,
          from: fromHeader,
          date: dateHeader
        });
      }
    } catch (e) {
      console.error('Failed to parse Gmail message', msg.id, e);
    }
  }

  return summaries;
}

export async function sendEmailReminder(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string }> {
  // Construct RFC 2822 message formatted in UTF-8
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageStr = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    `Content-Type: text/plain; charset=utf-8`,
    `MIME-Version: 1.0`,
    ``,
    bodyText
  ].join('\r\n');

  // Convert to Base64Url
  const rawBase64 = btoa(unescape(encodeURIComponent(messageStr)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const sendUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const response = await fetch(sendUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw: rawBase64 })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gmail E-posta gönderimi başarısız (${response.status})`);
  }

  return response.json();
}
