(async () => {
  const PROXY_URL = "https://ai-page-assistant-proxy.ivanlopez200059.workers.dev";
  document.getElementById('ai-assist-overlay')?.remove();
  document.getElementById('ai-assist-bubble')?.remove();

  const style = document.createElement('style');
  style.textContent = `
    #ai-assist-overlay{position:fixed;bottom:22px;right:22px;width:380px;max-width:92vw;background:#0f0f12;color:#e5e7eb;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08);z-index:9999999;font-family:system-ui,sans-serif;overflow:hidden;border:1px solid #27272a}
    #ai-assist-bubble{position:fixed;bottom:22px;right:22px;width:56px;height:56px;background:#18181b;border:1px solid #27272a;border-radius:28px;z-index:9999999;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.5);font-size:22px;color:#fafafa}
    #ai-assist-header{padding:14px 16px;background:#18181b;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #27272a}
    #ai-assist-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px}
    #ai-assist-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 10px #22c55e}
    #ai-assist-actions{display:flex;gap:6px}
    #ai-assist-min,#ai-assist-close{width:28px;height:28px;border-radius:8px;border:1px solid #27272a;background:#27272a;color:#a1a1aa;display:flex;align-items:center;justify-content:center;cursor:pointer}
    #ai-assist-tabs{display:flex;background:#18181b;padding:6px;gap:6px}
    .ai-tab{flex:1;padding:8px 6px;border-radius:10px;border:0;background:transparent;color:#71717a;font-size:12px;font-weight:600;cursor:pointer}
    .ai-tab.active{background:#27272a;color:#fafafa}
    #ai-assist-body{padding:14px;background:#0f0f12;max-height:480px;overflow:auto}
    #ai-assist-log{background:#18181b;border:1px solid #27272a;padding:12px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-wrap;min-height:90px;max-height:220px;overflow:auto;margin-bottom:12px}
    #ai-assist-input{width:100%;background:#18181b;color:#fafafa;border:1px solid #27272a;border-radius:12px;padding:11px 12px;font-size:13px;box-sizing:border-box;resize:none;outline:none}
    #ai-assist-row{display:flex;gap:8px;margin-top:10px}
    .ai-btn{flex:1;padding:10px;border-radius:12px;border:0;font-weight:700;font-size:12px;cursor:pointer}
    #ai-assist-send{background:#fafafa;color:#09090b}
    #ai-assist-scan{background:#27272a;color:#fafafa;border:1px solid #3f3f46}
    #ai-assist-status{font-size:10px;color:#52525b;text-align:center;margin-top:10px}
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.id = 'ai-assist-bubble';
  bubble.innerHTML = '✦';
  document.body.appendChild(bubble);

  const wrap = document.createElement('div');
  wrap.id = 'ai-assist-overlay';
  wrap.innerHTML = `
    <div id="ai-assist-header">
      <div id="ai-assist-title"><div id="ai-assist-dot"></div> AI ASSIST</div>
      <div id="ai-assist-actions">
        <button id="ai-assist-min">—</button>
        <button id="ai-assist-close">✕</button>
      </div>
    </div>
    <div id="ai-assist-tabs">
      <button class="ai-tab active" data-tab="chat">Chat</button>
      <button class="ai-tab" data-tab="scan">Scan</button>
      <button class="ai-tab" data-tab="answers">Answers</button>
    </div>
    <div id="ai-assist-body">
      <div id="ai-assist-log">Ready - Fixed pageContext bug

Proxy: ${PROXY_URL}
Model: llama-3.1-8b-instant

Chat = normal AI
Scan = summarize page
Answers = answer questions on page</div>
      <textarea id="ai-assist-input" rows="3" placeholder="Ask anything..."></textarea>
      <div id="ai-assist-row">
        <button id="ai-assist-scan" class="ai-btn">◉ Scan</button>
        <button id="ai-assist-send" class="ai-btn">Ask AI</button>
      </div>
      <div id="ai-assist-status">Secure proxy ready</div>
    </div>
  `;
  document.body.appendChild(wrap);

  const logEl = wrap.querySelector('#ai-assist-log');
  const inputEl = wrap.querySelector('#ai-assist-input');
  const sendEl = wrap.querySelector('#ai-assist-send');
  const scanEl = wrap.querySelector('#ai-assist-scan');
  const tabs = wrap.querySelectorAll('.ai-tab');
  let currentTab = 'chat';

  tabs.forEach(b=>{
    b.onclick=()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      currentTab = b.dataset.tab;
    }
  });

  function getPageContext(){
    try{
      const title = document.title || '';
      const url = location.href || '';
      const text = (document.body.innerText || '').replace(/\s+/g,' ').slice(0, 8000);
      return `URL: ${url}\nTITLE: ${title}\nPAGE TEXT: ${text}`;
    }catch(e){
      return `URL: ${location.href} TITLE: ${document.title}`;
    }
  }

  async function callAI(userInput, mode){
    const pageContext = getPageContext();
    const systemPrompt = mode==='scan' ? 'You are a page scanner. Summarize the webpage clearly with key points.' : mode==='answers' ? 'You are a quiz helper. Find questions on page and give correct answers with explanation.' : 'You are AI ASSIST overlay. Be concise and helpful.';
    const finalPrompt = mode==='scan' && !userInput ? `Summarize this page:\n${pageContext}` : mode==='answers' && !userInput ? `Detect all questions on this page and answer them:\n${pageContext}` : `${pageContext}\n\nUser request: ${userInput}`;

    logEl.textContent = 'Thinking...';
    sendEl.disabled = true;
    scanEl.disabled = true;
    try{
      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt, pageContext: systemPrompt })
      });
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || data.error || JSON.stringify(data,null,2);
      logEl.textContent = answer;
    }catch(e){
      logEl.textContent = 'Error: '+e.message;
    }finally{
      sendEl.disabled = false;
      scanEl.disabled = false;
    }
  }

  wrap.querySelector('#ai-assist-min').onclick = () => { wrap.style.display='none'; bubble.style.display='flex'; };
  bubble.onclick = () => { wrap.style.display='block'; bubble.style.display='none'; };
  wrap.querySelector('#ai-assist-close').onclick = () => { wrap.remove(); bubble.remove(); style.remove(); };

  sendEl.onclick = () => { const v=inputEl.value.trim(); if(!v) return; callAI(v, currentTab); };
  scanEl.onclick = () => { callAI(inputEl.value.trim(), currentTab==='chat'?'scan':currentTab); };
  inputEl.onkeydown = (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendEl.click(); } };
})();
