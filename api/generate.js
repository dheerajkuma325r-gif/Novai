export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { apiKey, mode, prompt, width, height, num_frames } = req.body;
  if (!apiKey || !prompt) return res.status(400).json({ error: 'Missing apiKey or prompt' });

  try {
    let response, data;
    if (mode === 'image') {
      response = await fetch('https://api.replicate.com/v1/models/stability-ai/sdxl/predictions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Prefer': 'wait=60' },
        body: JSON.stringify({ input: { prompt, width: width||1024, height: height||1024, num_outputs: 1, guidance_scale: 7.5, num_inference_steps: 30 } })
      });
    } else {
      response = await fetch('https://api.replicate.com/v1/models/wavespeedai/wan-2.1-t2v-480p/predictions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: { prompt, num_frames: num_frames||40 } })
      });
    }
    data = await response.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
