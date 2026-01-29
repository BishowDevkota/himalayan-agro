import { NextResponse } from "next/server";

// Server-side proxy to Groq Vision — keeps the API key secret and returns parsed suggestions.
export async function POST(req: Request) {
  const { imageUrl } = await req.json();
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const GROQ_AI_API_URL = process.env.GROQ_AI_API_URL;
  if (!GROQ_API_KEY || !GROQ_AI_API_URL) {
    return NextResponse.json({ error: 'Groq API not configured' }, { status: 501 });
  }

  // Try primary provider (Groq) first, then fall back to OpenRouter if configured.
  async function callProvider(apiUrl: string, apiKey: string, providerName: string) {
    const body = {
      input: [
        {
          image: { url: imageUrl },
          instructions: `You are an assistant that inspects a single product image and returns a compact JSON object with keys: name, description, brand. If you cannot determine a value, return an empty string for that key. Respond ONLY with a JSON object.`,
        },
      ],
    };

    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data } as const;
  }

  // list of providers to try in order
  const providersToTry: Array<{ url?: string; key?: string; name: string }> = [];
  if (GROQ_API_KEY && GROQ_AI_API_URL) providersToTry.push({ url: GROQ_AI_API_URL, key: GROQ_API_KEY, name: 'groq' });
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const OPENROUTER_AI_URL = process.env.OPENROUTER_AI_URL;
  if (OPENROUTER_API_KEY && OPENROUTER_AI_URL) providersToTry.push({ url: OPENROUTER_AI_URL, key: OPENROUTER_API_KEY, name: 'openrouter' });

  if (providersToTry.length === 0) {
    return NextResponse.json({ error: 'no-ai-provider-configured' }, { status: 501 });
  }

  let lastErr: any = null;
  for (const p of providersToTry) {
    try {
      const { ok, status, data } = await callProvider(p.url as string, p.key as string, p.name);
      if (!ok) {
        lastErr = { provider: p.name, status, data };
        continue; // try next provider
      }

      // parse response (same logic as before) and return provider name with raw
      let name = '';
      let description = '';
      let brand = '';

      const candidates: any[] = [];
      if (Array.isArray(data?.output)) candidates.push(...data.output);
      if (Array.isArray(data?.outputs)) candidates.push(...data.outputs);
      if (Array.isArray(data?.responses)) candidates.push(...data.responses);
      if (data?.predictions) candidates.push(data.predictions);
      if (candidates.length === 0) candidates.push(data);

      const tryParseJson = (s: unknown) => {
        if (typeof s !== 'string') return null;
        const js = s.trim();
        const m = js.match(/\{[\s\S]*\}/);
        const src = m ? m[0] : js;
        try { return JSON.parse(src); } catch (err) { return null; }
      };

      for (const c of candidates) {
        const text = c?.output?.[0]?.content || c?.caption || c?.text || c?.content || c?.result || c?.message || c?.data?.text;
        if (typeof text === 'string') {
          const parsed = tryParseJson(text);
          if (parsed) {
            name = parsed.name || parsed.title || name;
            description = parsed.description || parsed.desc || description;
            brand = parsed.brand || parsed.manufacturer || brand;
            break;
          }
          const lines = text.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
          for (const L of lines) {
            const kv = L.match(/^(name|title)[:\-]\s*(.+)$/i);
            if (kv) name = name || kv[2];
            const bd = L.match(/^(brand|maker|manufacturer)[:\-]\s*(.+)$/i);
            if (bd) brand = brand || bd[2];
            const desc = L.match(/^(description|desc|about)[:\-]\s*(.+)$/i);
            if (desc) description = description || desc[2];
          }
        }

        if (c?.name || c?.title) name = name || c?.name || c?.title;
        if (c?.brand) brand = brand || c?.brand;
        if (c?.description) description = description || c?.description;

        for (const key of Object.keys(c || {})) {
          const parsed = tryParseJson(c[key]);
          if (parsed) {
            name = name || parsed.name || parsed.title || '';
            description = description || parsed.description || parsed.desc || '';
            brand = brand || parsed.brand || '';
          }
        }
      }

      return NextResponse.json({ provider: p.name, name: String(name || '').trim(), description: String(description || '').trim(), brand: String(brand || '').trim(), raw: data });
    } catch (err: any) {
      lastErr = err;
      continue; // try next provider
    }
  }

  // all providers failed
  return NextResponse.json({ error: 'all-providers-failed', detail: lastErr }, { status: 502 });
}
