(async () => {
  const PROXY_URL = "https://ai-page-assistant-proxy.ivanlopez200059.workers.dev";
  document.getElementById('ai-assist-overlay')?.remove();
  document.getElementById('ai-assist-bubble')?.remove();

  const style = document.createElement('style');
  style.textContent = `
    #ai-assist-overlay{position:fixed;bottom:22px;right:22px;width:380px;max-width:92vw;background:#0f0f12;color:#e5e7eb;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08);z-index:9999999;font-family:ui-sans-system,system-ui,-apple-system,sans-serif;overflow:hidden;border:1px solid #27272a;transition:all .25s ease}
    #ai-assist-bubble{position:fixed;bottom:22px;right:22px;width:56px;height:56px;background:#18181b;border:1px solid #27272a;border-radius:28px;z-index:9999999;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 30px rgba(0,0,0,.5);font-size:22px;color:#fafafa}
    #ai-assist-header{padding:14px 16px;background:#18181b;display:flex;justify-content:space-between;align-items:center;user-select:none;border-bottom:1px solid #27272a}
    #ai-assist-title{display:flex;align-items:center;gap:8px;font-weight:700;font-size:13px;letter-spacing:.6px}
    #ai-assist-dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 10px #22c55e;animation:pulse 2s infinite}
    @keyframes pulse{0%{opacity:1}50%{opacity:.5}100%{opacity:1}}
    #ai-assist-actions{display:flex;gap:6px}
    #ai-assist-min,#ai-assist-close{width:28px;height:28px;border-radius:8px;border:1px solid #27272a;background:#27272a;color:#a1a1aa;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px}
    #ai-assist-min:hover,#ai-assist-close:hover{background:#3f3f46;color:#fff}
    #ai-assist-tabs{display:flex;background:#18181b;padding:6px;gap:6px}
    .ai-tab{flex:1;padding:8px 6px;border-radius:10px;border:0;background:transparent;color:#71717a;font-size:12px;font-weight:600;cursor:pointer;transition:.15s}
    .ai-tab.active{background:#27272a;color:#fafafa}
    #ai-assist-body{padding:14px;background:#0f0f12;max-height:480px;overflow:auto}
    #ai-assist-log{background:#18181b;border:1px solid #27272a;padding:12px;border-radius:12px;font-size:13px;line-height:1.5;white-space:pre-wrap;min-height:90px;max-height:220px;overflow:auto;margin-bottom:12px}
    #ai-assist-question-list{font-size:12px;color:#a1a1aa;margin-bottom:10px}
    #ai-assist-question-list b{color:#fafafa}
    .ai-chip{display:inline-flex;padding:4px 8px;background:#27272a;border-radius:999px;font-size:11px;margin:3px;cursor:pointer;border:1px solid #3f3f46;color:#e4e4e7}
    .ai-chip:hover{background:#3f3f46}
    #ai-assist-input{width:100%;background:#18181b;color:#fafafa;border:1px solid #27272a;border-radius:12px;padding:11px 12px;font-size:13px;box-sizing:border-box;resize:none;outline:none}
    #ai-assist-input:focus{border-color:#3f3f46}
    #ai-assist-row{display:flex;gap:8px;margin-top:10px}
    .ai-btn{flex:1;padding:10px;border-radius:12px;border:0;font-weight:700;font-size:12px;cursor:pointer;transition:.15s}
    #ai-assist-send{background:#fafafa;color:#09090b}
    #ai-assist-send:disabled{opacity:.5}
    #ai-assist-scan{background:#27272a;color:#fafafa;border:1px solid #3f3f46}
    #ai-assist-status{font-size:10px;color:#52525b;text-align:center;margin-top:10px;letter-spacing:.3px}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#27272a;border-radius:10px}
  `;
  document.head.appendChild(style);

  const bubble = document.createElement('div');
  bubble.id = 'ai-assist-bubble';
  bubble.innerHTML = '✦';
  bubble.title = 'Open AI Assist';
  document.body.appendChild(bubble);

  const wrap = document.createElement('div');
  wrap.id = 'ai-assist-overlay';
  wrap.innerHTML = `
    <div id="ai-assist-header">
      <div id="ai-assist-title"><div id="ai-assist-dot"></div> AI ASSIST · LLAMA 3.1</div>
      <div id="ai-assist-actions">
        <button id="ai-assist-min" title="Minimize">—</button>
        <button id="ai-assist-close" title="Close">✕</button>
      </div>
    </div>
    <div id="ai-assist-tabs">
      <button class="ai-tab active" data-tab="chat">Chat</button>
      <button class="ai-tab" data-tab="scan">Scan</button>
      <button class="ai-tab" data-tab="answers">Answers</button>
    </div>
    <div id="ai-assist-body">
      <div id="ai-assist-log">Dark • Ready

Connected to secure proxy:
https://ai-page-assistant-proxy.ivanlopez200059.workers.dev

Model: llama-3.1-8b-instant

• Chat = normal AI
• Scan = summarize what's on this page  
• Answers = find questions on page and answer them

Click Scan or type a question.</div>
      <div id="ai-assist-question-list"></div>
      <textarea id="ai-assist-input" rows="3" placeholder="Ask anything... or click Scan"></textarea>
      <div id="ai-assist-row">
        <button id="ai-assist-scan" class="ai-btn">◉ Scan Page</button>
        <button id="ai-assist-send" class="ai-btn">Ask AI</button>
      </div>
      <div id="ai-assist-status">Proxy: SECURE · Key hidden in Cloudflare</div>
    </div>
  `;
  document.body.appendChild(wrap);

  const logEl = wrap.querySelector('#ai-assist-log');
  const inputEl = wrap.querySelector('#ai-assist-input');
  const sendEl = wrap.querySelector('#ai-assist-send');
  const scanEl = wrap.querySelector('#ai-assist-scan');
  const qList = wrap.querySelector('#ai-assist-question-list');
  const tabs = wrap.querySelectorAll('.ai-tab');
  let currentTab = 'chat';

  function setTab(t){
    currentTab=t;
    tabs.forEach(b=>b.classList.toggle('active', b.dataset.tab===t));
    if(t==='chat'){ inputEl.placeholder='Ask anything...'; scanEl.textContent='◉ Scan Page'; }
    if(t==='scan'){ inputEl.placeholder='What to summarize? (leave empty to summarize whole page)'; scanEl.textContent='◎ Summarize Page'; }
    if(t==='answers'){ inputEl.placeholder='Paste a question or click Detect Questions'; scanEl.textContent='◍ Detect Questions'; findQuestionsOnPage(); }
  }
  tabs.forEach(b=>b.onclick=()=>setTab(b.dataset.tab));

  function getPageContext(){
    const title = document.title;
    const url = location.href;
    const text = document.body.innerText.replace(/\s+/g,' ').slice(0, 8000);
    const questionCandidates = [...document.querySelectorAll('h1,h2,h3,h4,label,p,div')].map(e=>e.innerText).join('\n').slice(0,8000);
    return `URL: ${url}\nTITLE: ${title}\nPAGE TEXT: ${text}\nVISIBLE QUESTIONS CANDIDATES: ${questionCandidates}`;
  }

  function findQuestionsOnPage(){
    const allText = document.body.innerText;
    const matches = [...allText.matchAll(/[^.\n]{10,200}\?/g)].slice(0,12).map(m=>m[0].trim());
    const inputs = [...document.querySelectorAll('input, textarea')].slice(0,8).map(i=> i.placeholder || i.name || i.id).filter(Boolean);
    const combined = [...new Set([...matches, ...inputs])].slice(0,10);
    if(combined.length===0){
      qList.innerHTML = '<b>No questions detected.</b> Try Scan tab.';
      return;
    }
    qList.innerHTML = '<b>Detected on page:</b><br>' + combined.map(q=>`<span class="ai-chip">${q.slice(0,80)}</span>`).join('');
    qList.querySelectorAll('.ai-chip').forEach(chip=>{
      chip.onclick=()=>{ inputEl.value = chip.textContent; inputEl.focus(); };
    });
  }

  async function callAI(prompt, mode){
    const pageContext = getPageContext();
    logEl.textContent = mode==='scan' ? 'Scanning page...\n' : mode==='answers' ? 'Finding answers on page...\n' : 'Thinking...\n';
    sendEl.disabled = true; scanEl.disabled = true;
    try{
      let systemPrompt = 'You are AI ASSIST overlay. Be concise, helpful.';
      let userPrompt = prompt;
      if(mode==='scan'){
        systemPrompt = 'You are a page scanner. Summarize the webpage content clearly. Give key points, purpose, and any important info. Keep it short and useful.';
        userPrompt = prompt ? `User wants: ${prompt}\n\nPage context:\n${pageContext}` : `Summarize this webpage:\n${pageContext}`;
      } else if(mode==='answers'){
        systemPrompt = 'You are a quiz/test helper. Find questions on the page and give correct answers. If you see multiple choice, give the correct option and brief explanation.';
        userPrompt = `Page context:\n${pageContext}\n\nUser request: ${prompt || 'Detect all questions on this page and answer them'}`;
      } else {
        userPrompt = `${pageContext}\n\nUser question: ${prompt}`;
      }

      const res = await fetch(PROXY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt, pageContext: systemPrompt })
      });
      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || data.error || JSON.stringify(data,null,2);
      logEl.textContent = answer;
      logEl.scrollTop = 0;
    }catch(e){
      logEl.textContent = 'Error: '+e.message+'\n\nMake sure Cloudflare Worker has GROQ_API_KEY secret set.';
    }finally{
      sendEl.disabled=false; scanEl.disabled=false;
    }
  }

  wrap.querySelector('#ai-assist-min').onclick = () => {
    wrap.style.display='none';
    bubble.style.display='flex';
  };
  bubble.onclick = () => {
    wrap.style.display='block';
    bubble.style.display='none';
  };
  wrap.querySelector('#ai-assist-close').onclick = () => {
    wrap.remove(); bubble.remove(); style.remove();
  };

  sendEl.onclick = () => {
    const p = inputEl.value.trim();
    if(!p) return;
    callAI(p, currentTab==='scan'?'scan': currentTab==='answers'?'answers':'chat');
  };
  scanEl.onclick = () => {
    if(currentTab==='chat'){
      setTab('scan');
      callAI(inputEl.value.trim(), 'scan');
    } else if(currentTab==='scan'){
      callAI(inputEl.value.trim(), 'scan');
    } else {
      callAI(inputEl.value.trim(), 'answers');
    }
  };
  inputEl.onkeydown = (e)=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendEl.click(); } };

  let isDrag=false, sx, sy, sl, st;
  const header = wrap.querySelector('#ai-assist-header');
  header.style.cursor='move';
  header.onmousedown=(e)=>{ isDrag=true; sx=e.clientX; sy=e.clientY; const r=wrap.getBoundingClientRect(); sl=r.left; st=r.top; e.preventDefault(); };
  window.onmousemove=(e)=>{ if(!isDrag) return; wrap.style.right='auto'; wrap.style.bottom='auto'; wrap.style.left=(sl + e.clientX - sx)+'px'; wrap.style.top=(st + e.clientY - sy)+'px'; };
  window.onmouseup=()=>isDrag=false;

  setTab('chat');
})();
