(async () => {
  const PROXY_URL = "https://ai-page-assistant-proxy.ivanlopez200059.workers.dev";

  // Remove old overlay if exists
  document.getElementById('ai-assist-overlay')?.remove();

  const style = document.createElement('style');
  style.textContent = `
    #ai-assist-overlay{position:fixed;bottom:20px;right:20px;width:360px;background:#0f172a;color:#e2e8f0;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.4);z-index:999999;font-family:system-ui;overflow:hidden;border:1px solid #1e293b}
    #ai-assist-header{padding:12px 16px;background:#1e293b;display:flex;justify-content:space-between;align-items:center;cursor:move}
    #ai-assist-header b{font-size:14px;letter-spacing:.5px}
    #ai-assist-close{background:#334155;border:0;color:#fff;width:24px;height:24px;border-radius:8px;cursor:pointer}
    #ai-assist-body{padding:12px;max-height:420px;overflow:auto}
    #ai-assist-log{background:#020617;padding:10px;border-radius:10px;font-size:12px;white-space:pre-wrap;min-height:80px;margin-bottom:10px;border:1px solid #1e293b}
    #ai-assist-input{width:100%;background:#020617;color:#e2e8f0;border:1px solid #334155;border-radius:10px;padding:10px;font-size:13px;box-sizing:border-box;resize:none}
    #ai-assist-send{width:100%;margin-top:8px;background:#38bdf8;color:#020617;border:0;padding:10px;border-radius:10px;font-weight:700;cursor:pointer}
    #ai-assist-status{font-size:11px;opacity:.7;margin-top:6px;text-align:center}
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'ai-assist-overlay';
  wrap.innerHTML = `
    <div id="ai-assist-header"><b>AI ASSIST</b><button id="ai-assist-close">X</button></div>
    <div id="ai-assist-body">
      <div id="ai-assist-log">SECURE PROXY · READY\nConnected to: ${PROXY_URL}\n\nYour key is safe in Cloudflare, not in GitHub.</div>
      <textarea id="ai-assist-input" rows="3" placeholder="Ask something about this page..."></textarea>
      <button id="ai-assist-send">Ask AI</button>
      <div id="ai-assist-status">Model: llama-3.1-8b-instant via secure proxy</div>
    </div>
  `;
  document.body.appendChild(wrap);

  document.getElementById('ai-assist-close').onclick = () => wrap.remove();

  const logEl = document.getElementById('ai-assist-log');
  const inputEl = document.getElementById('ai-assist-input');
  const sendEl = document.getElementById('ai-assist-send');

  async function ask() {
    const prompt = inputEl.value.trim();
    if (!prompt) return;
    const pageContext = document.title + "\n" + document.body.innerText.slice(0, 4000);
    logEl.textContent = "Thinking...\n";
    sendEl.disabled = true;
    try {
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, pageContext })
      });
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || JSON.stringify(data, null, 2);
      logEl.textContent = answer;
    } catch (e) {
      logEl.textContent = "Error: " + e.message + "\n\nCheck that GROQ_API_KEY secret is set in Cloudflare Worker settings.";
    } finally {
      sendEl.disabled = false;
    }
  }

  sendEl.onclick = ask;
  inputEl.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } };
})();
