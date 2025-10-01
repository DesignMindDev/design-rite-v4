import fetch from 'node-fetch';

const ANTHROPIC_BASE = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

export interface AnthropicResult {
  content: string;
  raw?: any;
}

export async function callAnthropic(prompt: string, model?: string, timeoutMs = 25000, maxRetries = 3): Promise<AnthropicResult> {
  if (!API_KEY) throw new Error('Anthropic API key not configured');

  let lastErr: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(ANTHROPIC_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || DEFAULT_MODEL,
          max_tokens: 1500,
          messages: [{ role: 'user', content: prompt }]
        }),
        signal: controller.signal as any,
      });

      clearTimeout(timer);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Anthropic API error: ${res.status} - ${text}`);
      }

  const data: any = await res.json();
  const content = (data && (data.content?.[0]?.text || data.result)) || JSON.stringify(data);
      return { content, raw: data };

    } catch (err: any) {
      lastErr = err;
      // simple backoff
      if (attempt < maxRetries) {
        const backoff = 500 * Math.pow(2, attempt - 1);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  }

  throw lastErr || new Error('Anthropic call failed');
}
