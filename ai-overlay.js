// ai-overlay.js - BUILT-IN KEY VERSION
// WARNING: If this file is public on GitHub, anyone can see your key.
// For Groq free keys this is less risky, but for OpenAI don't make repo public.

(() => {
  // ===== PUT YOUR KEY HERE =====
  // This is the only line you edit
  const BUILT_IN_KEY = "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"; 
  const BUILT_IN_MODEL = "llama-3.3-70b-versatile"; // or gpt-4o if using OpenAI
  const BUILT_IN_API_URL = "https://api.groq.com/openai/v1/chat/completions"; 
  // For OpenAI use: "https://api.openai.com/v1/chat/completions" and model "gpt-4o" or "gpt-5"
  // =============================

  // --- Obfuscated version (optional, harder to scrape) ---
  // If you want to hide it a little, use this instead of plain text:
  // const BUILT_IN_KEY = atob("Z3NrX1lPVVJfR1JPUV9LRVlfSEVSRQ=="); // base64 encoded

  if (document.getElementById('ai-blue-root')) {
    document.getElementById('ai-blue-root').remove();
    return;
  }
  const css = `#ai-blue-root{position:fixed;top:20px;right:20px;width:400px;height:560px;z-index:2147483647;font-family:system-ui,sans-serif;display:flex;flex-direction:column;background:#070f26;border:1px solid #1e3a8a;border-radius:18px;box-shadow:0 25px 80px rgba(0,0,0,.6);overflow:hidden}#ai-blue-head{padding:14px 16px;background:linear-gradient(180deg,#0f2043,#0a1931);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e3a8a;cursor:move}#ai-blue-head b{color:#93c5fd;font-size:13px;font-weight:800}#ai-blue-head span{color:#22c55e;font-size:11px}#ai-blue-head button{background:#132a5c;color:#93c5fd;border:1px solid #1e3a8a;border-radius:8px;padding:5px 10px;cursor:pointer}#ai-blue-chat{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#070f26}.ai-b-msg{padding:11px 13px;border-radius:14px;font-size:13.5px;line-height:1.6;max-width:90%;white-space:pre-wrap;word-wrap:break-word}.ai-b-user{align-self:flex-end;background:#2563eb;color:#fff;border-bottom-right-radius:4px}.ai-b-bot{align-self:flex-start;background:#0f2043;color:#cbd5e1;border:1px solid #1e3a8a}#ai-blue-foot{padding:12px;background:#0a1931;border-top:1px solid #1e3a8a;display:flex;flex-direction:column;gap:10px}#ai-blue-actions{display:flex;gap:8px}.ai-b-action{flex:1;background:#0f2043;color:#60a5fa;border:1px solid #1e3a8a;border-radius:10px;padding:8px;font-size:11px;font-weight:700;cursor:pointer}#ai-blue-input-row{display:flex;gap:8px}#ai-blue-input{flex:1;background:#070f26;color:#e2e8f0;border:1px solid #1e3a8a;border-radius:12px;padding:11px 12px;font-size:13px;outline:none;resize:none}#ai-blue-settings{display:flex;gap:6px}#ai-blue-settings input{flex:1;background:#070f26;color:#94a3b8;border:1px solid #1e3a8a;border-radius:8px;padding:6px 8px;font-size:10.5px}#ai-blue-send{background:#2563eb;color:#fff;border:0;border-radius:12px;padding:0 18px;font-weight:800;cursor:pointer;min-width:44px}`;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  const root = document.createElement('div'); root.id = 'ai-blue-root';
  root.innerHTML = `<div id="ai-blue-head"><div><b>AI ASSIST</b> <span>• BUILT-IN KEY • READY</span></div><div style="display:flex;gap:6px"><button id="ai-b-clear">clear</button><button id="ai-b-close">✕</button></div></div><div id="ai-blue-chat"><div class="ai-b-msg ai-b-bot">✅ Built-in key active. No need to type key.

Just click Analyze Page.</div></div><div id="ai-blue-foot"><div id="ai-blue-actions"><button class="ai-b-action" id="ai-b-analyze">↗ Analyze Page</button><button class="ai-b-action" id="ai-b-summarize">◫ Summarize</button><button class="ai-b-action" id="ai-b-extract">⧉ Extract</button></div><div id="ai-blue-settings" style="display:none"><input id="ai-b-key" type="password" /><input id="ai-b-model" value="${BUILT_IN_MODEL}" /><input id="ai-b-url" value="${BUILT_IN_API_URL}" /></div><div id="ai-blue-input-row"><textarea id="ai-blue-input" rows="2" placeholder="Ask about this page..."></textarea><button id="ai-blue-send">↑</button></div></div>`;
  document.body.appendChild(root);
  const $=id=>document.getElementById(id);
  const chat=$('ai-blue-chat'),input=$('ai-blue-input'),send=$('ai-blue-send');
  const keyIn=$('ai-b-key'), modelIn=$('ai-b-model'), urlIn=$('ai-b-url');
  // Auto-fill from built-in
  keyIn.value = BUILT_IN_KEY;
  modelIn.value = BUILT_IN_MODEL;
  urlIn.value = BUILT_IN_API_URL;
  // Also save to localStorage so it persists
  localStorage.setItem('ai_blue_groq_key', BUILT_IN_KEY);

  function getPageContext(){const t=document.title;const u=location.href;let x=document.body.innerText||'';x=x.replace(/\s+/g,' ').trim().slice(0,12000);return{title:t,url:u,text:x};}
  function addMsg(t,w){const d=document.createElement('div');d.className='ai-b-msg ai-b-'+w;d.textContent=t;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
  let history=[{role:'system',content:`You are an AI assistant on a webpage. Helpful and concise. Date: ${new Date().toDateString()}`}];
  async function askAI(p,inc=true){
    if(inc){const c=getPageContext();p=`PAGE TITLE: ${c.title}\nURL: ${c.url}\nCONTENT:\n${c.text}\n\nUSER: ${p}`;}
    addMsg(p.includes('USER:')?p.split('USER: ')[1]:p,'user'); history.push({role:'user',content:p});
    const b=addMsg('Thinking...','bot'); send.disabled=true;
    try{
      const r=await fetch(urlIn.value,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+keyIn.value},body:JSON.stringify({model:modelIn.value,messages:history,temperature:0.3})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error?.message||'Error');
      const reply=d.choices[0].message.content; b.textContent=reply; history.push({role:'assistant',content:reply});
    }catch(e){b.textContent='Error: '+e.message;}
    send.disabled=false;
  }
  $('ai-b-analyze').onclick=()=>askAI('Analyze this page in detail. What is it about, key points, and what should I know?');
  $('ai-b-summarize').onclick=()=>askAI('Summarize this page in 5 concise bullet points.');
  $('ai-b-extract').onclick=()=>{const c=getPageContext(); addMsg(`Page: ${c.title}\n${c.text.slice(0,3000)}...`,'bot');};
  send.onclick=()=>{const v=input.value.trim(); if(v){input.value=''; askAI(v);}};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send.click();}});
  $('ai-b-close').onclick=()=>root.remove();
  $('ai-b-clear').onclick=()=>{chat.innerHTML='';history=[history[0]];addMsg('Cleared.','bot');};
  let drag=false,sx,sy,ix,iy; const h=$('ai-blue-head');
  h.addEventListener('mousedown',e=>{drag=true;sx=e.clientX;sy=e.clientY;const r=root.getBoundingClientRect();ix=r.left;iy=r.top;});
  window.addEventListener('mousemove',e=>{if(!drag)return;root.style.left=ix+e.clientX-sx+'px';root.style.top=iy+e.clientY-sy+'px';root.style.right='auto';});
  window.addEventListener('mouseup',()=>drag=false);
})();
