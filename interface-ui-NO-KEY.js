(async () => {
  document.getElementById('ai-assist-overlay')?.remove();
  document.getElementById('ai-assist-bubble')?.remove();

  // Load Puter.js - free AI with no API key
  if(!window.puter){
    const s = document.createElement('script');
    s.src = 'https://js.puter.com/v2/';
    document.head.appendChild(s);
    await new Promise(res => s.onload = res);
  }

  const style = document.createElement('style');
  style.textContent = `
    #ai-assist-overlay{position:fixed;bottom:22px;right:22px;width:380px;max-width:92vw;background:#0f0f12;color:#e5e7eb;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6);z-index:9999999;font-family:system-ui,sans-serif;overflow:hidden;border:1px solid #27272a}
    #ai-assist-bubble{position:fixed;bottom:22px;right:22px;width:56px;height:56px;background:#18181b;border:1px solid #27272a;border-radius:28px;z-index:9999999;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.5);font-size:22px;color:#fafafa}
    #ai-assist-header{padding:14px 16px;background:#18181b;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #27272a;cursor:move}
    #ai-assist-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px}
    #ai-assist-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 10px #22c55e;animation:pulse 2s infinite}
    @keyframes pulse{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}
    #ai-assist-actions{display:flex;gap:6px}
    #ai-assist-min,#ai-assist-close{width:28px;height:28px;border-radius:8px;border:1px solid #27272a;background:#27272a;color:#a1a1aa;display:flex;align-items:center;justify-content:center;cursor:pointer}
    #ai-assist-tabs{display:flex;background:#18181b;padding:6px;gap:6px}
    .ai-tab{flex:1;padding:8px 6px;border-radius:10px;border:0;background:transparent;color:#71717a;font-size:12px;font-weight:600;cursor:pointer}
    .ai-tab.active{background:#27272a;color:#fafafa}
    #ai-assist-body{padding:14px;background:#0f0f12;max-height:480px;overflow:auto}
    #ai-assist-log{background:#18181b;border:1px solid #27272a;padding:12px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-wrap;min-height:90px;max-height:240px;overflow:auto;margin-bottom:12px}
    #ai-assist-q{font-size:12px;color:#a1a1aa;margin-bottom:10px}
    .ai-chip{display:inline-flex;padding:4px 8px;background:#27272a;border-radius:999px;font-size:11px;margin:3px;cursor:pointer;border:1px solid #3f3f46;color:#e4e4e7}
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
      <div id="ai-assist-title"><div id="ai-assist-dot"></div> AI ASSIST · NO KEY</div>
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
      <div id="ai-assist-log">Ready - NO API KEY NEEDED

Using: Puter.js free AI
Model: meta-llama/llama-3.1-8b-instant
Cost: $0 · No key · No proxy

• Chat = normal AI
• Scan = summarize page
• Answers = find & answer questions

Just ask anything.</div>
      <div id="ai-assist-q"></div>
      <textarea id="ai-assist-input" rows="3" placeholder="Ask anything..."></textarea>
      <div id="ai-assist-row">
        <button id="ai-assist-scan" class="ai-btn">◉ Scan</button>
        <button id="ai-assist-send" class="ai-btn">Ask AI</button>
      </div>
      <div id="ai-assist-status">NO KEY MODE · Free Llama via Puter</div>
    </div>
  `;
  document.body.appendChild(wrap);

  const logEl = wrap.querySelector('#ai-assist-log');
  const inputEl = wrap.querySelector('#ai-assist-input');
  const sendEl = wrap.querySelector('#ai-assist-send');
  const scanEl = wrap.querySelector('#ai-assist-scan');
  const qList = wrap.querySelector('#ai-assist-q');
  const tabs = wrap.querySelectorAll('.ai-tab');
  let currentTab = 'chat';

  tabs.forEach(b=>{
    b.onclick=()=>{
      tabs.forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      currentTab = b.dataset.tab;
      if(currentTab==='answers') findQuestionsOnPage();
    }
  });

  function getPageContext(){
    try{
      const title = document.title || '';
      const url = location.href || '';
      const text = (document.body.innerText || '').replace(/\s+/g,' ').slice(0, 7000);
      return `URL: ${url}\nTITLE: ${title}\nPAGE TEXT: ${text}`;
    }catch(e){ return location.href; }
  }

  function findQuestionsOnPage(){
    const allText = document.body.innerText || '';
    const matches = [...allText.matchAll(/[^.\n]{10,180}\?/g)].slice(0,10).map(m=>m[0].trim());
    if(matches.length===0){ qList.innerHTML = '<b>No questions found</b>'; return; }
    qList.innerHTML = '<b>Detected:</b><br>' + matches.map(q=>`<span class="ai-chip">${q.slice(0,70)}</span>`).join('');
    qList.querySelectorAll('.ai-chip').forEach(chip=>{
      chip.onclick=()=>{ inputEl.value = chip.textContent; };
    });
  }

  async function callAI(userPrompt, mode){
    const pageContext = getPageContext();
    let systemPrompt = 'You are AI ASSIST overlay. Be concise and helpful.';
    let finalPrompt = userPrompt;

    if(mode==='scan'){
      systemPrompt = 'Summarize webpage content with key points. Be brief.';
      finalPrompt = userPrompt ? `Summarize for: ${userPrompt}\n\nPage: ${pageContext}` : `Summarize this page:\n${pageContext}`;
    } else if(mode==='answers'){
      systemPrompt = 'You are a quiz helper. Find questions and give correct answers with short explanation.';
      finalPrompt = userPrompt ? `Page: ${pageContext}\n\nAnswer: ${userPrompt}` : `Detect all questions on this page and answer them:\n${pageContext}`;
    } else {
      finalPrompt = `Page context: ${pageContext}\n\nUser question: ${userPrompt}`;
    }

    logEl.textContent = 'Thinking (free AI, no key)...';
    sendEl.disabled = true; scanEl.disabled = true;

    try{
      const fullMessage = `${systemPrompt}\n\n${finalPrompt}`;
      const response = await window.puter.ai.chat(fullMessage, { model: 'meta-llama/llama-3.1-8b-instant' });
      const text = typeof response === 'string' ? response : response.message?.content || response.text || JSON.stringify(response);
      logEl.textContent = text;
    }catch(e){
      logEl.textContent = 'Error: ' + e.message + '\n\nTry again. Puter free tier can be rate limited.';
    }finally{
      sendEl.disabled = false; scanEl.disabled = false;
    }
  }

  wrap.querySelector('#ai-assist-min').onclick = () => { wrap.style.display='none'; bubble.style.display='flex'; };
  bubble.onclick = () => { wrap.style.display='block'; bubble.style.display='none'; };
  wrap.querySelector('#ai-assist-close').onclick = () => { wrap.remove(); bubble.remove(); style.remove(); };

  sendEl.onclick = () => { const v=inputEl.value.trim(); if(!v) return; callAI(v, currentTab); };
  scanEl.onclick = () => { callAI(inputEl.value.trim(), currentTab); };
  inputEl.onkeydown = (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendEl.click(); } };

  let isDrag=false, sx, sy, sl, st;
  const header = wrap.querySelector('#ai-assist-header');
  header.onmousedown=(e)=>{ isDrag=true; sx=e.clientX; sy=e.clientY; const r=wrap.getBoundingClientRect(); sl=r.left; st=r.top; };
  window.onmousemove=(e)=>{ if(!isDrag) return; wrap.style.right='auto'; wrap.style.bottom='auto'; wrap.style.left=(sl + e.clientX - sx)+'px'; wrap.style.top=(st + e.clientY - sy)+'px'; };
  window.onmouseup=()=>isDrag=false;
})();
