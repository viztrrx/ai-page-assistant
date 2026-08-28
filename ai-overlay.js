// ai-overlay.js - Dark Blue AI Page Assistant - GPT-4o / GPT-5
// Load with: fetch('https://raw.githubusercontent.com/YOUR_USERNAME/ai-page-assistant/main/ai-overlay.js').then(r=>r.text()).then(eval)
(() => {
  if (document.getElementById('ai-blue-root')) {
    document.getElementById('ai-blue-root').remove();
    return;
  }
  const css = `
    #ai-blue-root{position:fixed;top:20px;right:20px;width:400px;height:560px;z-index:2147483647;font-family:ui-sans-serif,system-ui,sans-serif;display:flex;flex-direction:column;background:#070f26;border:1px solid #1e3a8a;border-radius:18px;box-shadow:0 25px 80px rgba(0,0,0,.6),0 0 0 1px rgba(59,130,246,.2);overflow:hidden;animation:aiFade .2s ease}
    @keyframes aiFade{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
    #ai-blue-head{padding:14px 16px;background:linear-gradient(180deg,#0f2043,#0a1931);display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e3a8a;cursor:move;user-select:none}
    #ai-blue-head b{color:#93c5fd;font-size:13px;letter-spacing:1px;font-weight:800}
    #ai-blue-head span{color:#3b82f6;font-size:11px}
    #ai-blue-head button{background:#132a5c;color:#93c5fd;border:1px solid #1e3a8a;border-radius:8px;padding:5px 10px;cursor:pointer;font-size:12px}
    #ai-blue-head button:hover{background:#1e3a8a;color:#fff}
    #ai-blue-chat{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;background:#070f26}
    .ai-b-msg{padding:11px 13px;border-radius:14px;font-size:13.5px;line-height:1.6;max-width:90%;white-space:pre-wrap;word-wrap:break-word}
    .ai-b-user{align-self:flex-end;background:#2563eb;color:#fff;border-bottom-right-radius:4px}
    .ai-b-bot{align-self:flex-start;background:#0f2043;color:#cbd5e1;border:1px solid #1e3a8a;border-bottom-left-radius:4px}
    #ai-blue-foot{padding:12px;background:#0a1931;border-top:1px solid #1e3a8a;display:flex;flex-direction:column;gap:10px}
    #ai-blue-actions{display:flex;gap:8px}
    .ai-b-action{flex:1;background:#0f2043;color:#60a5fa;border:1px solid #1e3a8a;border-radius:10px;padding:8px;font-size:11px;font-weight:700;cursor:pointer}
    .ai-b-action:hover{background:#1e3a8a;color:#fff}
    #ai-blue-input-row{display:flex;gap:8px}
    #ai-blue-input{flex:1;background:#070f26;color:#e2e8f0;border:1px solid #1e3a8a;border-radius:12px;padding:11px 12px;font-size:13px;outline:none;resize:none}
    #ai-blue-input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.2)}
    #ai-blue-send{background:#2563eb;color:#fff;border:0;border-radius:12px;padding:0 18px;font-weight:800;cursor:pointer;min-width:44px}
    #ai-blue-settings{display:flex;gap:6px}
    #ai-blue-settings input{flex:1;background:#070f26;color:#94a3b8;border:1px solid #1e3a8a;border-radius:8px;padding:6px 8px;font-size:10.5px;outline:none}
  `;
  const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  const root = document.createElement('div'); root.id = 'ai-blue-root';
  root.innerHTML = `<div id="ai-blue-head"><div><b>AI ASSIST</b> <span>• GPT-4o / GPT-5</span></div><div style="display:flex;gap:6px"><button id="ai-b-clear">clear</button><button id="ai-b-close">✕</button></div></div><div id="ai-blue-chat"><div class="ai-b-msg ai-b-bot">👋 Ready. I can see this page.

• Click "Analyze Page" to understand this site
• "Summarize" for 5 bullet points
• Or just ask: "what's the price?" / "summarize this article"

Add your OpenAI key below once — saved locally, never sent anywhere except OpenAI.</div></div><div id="ai-blue-foot"><div id="ai-blue-actions"><button class="ai-b-action" id="ai-b-analyze">↗ Analyze Page</button><button class="ai-b-action" id="ai-b-summarize">◫ Summarize</button><button class="ai-b-action" id="ai-b-extract">⧉ Extract</button></div><div id="ai-blue-settings"><input id="ai-b-key" type="password" placeholder="sk-... OpenAI Key" /><input id="ai-b-model" value="gpt-4o" style="max-width:110px" /></div><div id="ai-blue-input-row"><textarea id="ai-blue-input" rows="2" placeholder="Ask about this page..."></textarea><button id="ai-blue-send">↑</button></div></div>`;
  document.body.appendChild(root);
  const $=id=>document.getElementById(id);
  const chat=$('ai-blue-chat'),input=$('ai-blue-input'),send=$('ai-blue-send'),keyIn=$('ai-b-key'),modelIn=$('ai-b-model');
  keyIn.value=localStorage.getItem('ai_blue_key')||''; modelIn.value=localStorage.getItem('ai_blue_model')||'gpt-4o';
  keyIn.onchange=()=>localStorage.setItem('ai_blue_key',keyIn.value); modelIn.onchange=()=>localStorage.setItem('ai_blue_model',modelIn.value);
  function getPageContext(){const title=document.title;const url=location.href;let text=document.body.innerText||'';text=text.replace(/\s+/g,' ').trim().slice(0,15000);return{title,url,text};}
  function addMsg(t,who){const d=document.createElement('div');d.className='ai-b-msg ai-b-'+who;d.textContent=t;chat.appendChild(d);chat.scrollTop=chat.scrollHeight;return d;}
  let history=[{role:'system',content:`You are an AI assistant embedded on a webpage. You have access to current page content. Be concise, accurate, helpful. Date: ${new Date().toDateString()}`}];
  async function askAI(userPrompt,includePage=true){
    if(!keyIn.value) return addMsg('Add your OpenAI API key first. Get one at platform.openai.com -> API Keys','bot');
    if(includePage){const ctx=getPageContext();userPrompt=`PAGE TITLE: ${ctx.title}\nPAGE URL: ${ctx.url}\nPAGE CONTENT:\n${ctx.text}\n\nUSER REQUEST: ${userPrompt}`;}
    addMsg(userPrompt.includes('USER REQUEST:')?userPrompt.split('USER REQUEST: ')[1]:userPrompt,'user');
    history.push({role:'user',content:userPrompt});
    const botEl=addMsg('Thinking...','bot'); send.disabled=true;
    try{
      const res=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+keyIn.value},body:JSON.stringify({model:modelIn.value||'gpt-4o',messages:history,temperature:0.3})});
      const data=await res.json(); if(!res.ok) throw new Error(data.error?.message||'API Error');
      const reply=data.choices[0].message.content; botEl.textContent=reply; history.push({role:'assistant',content:reply});
    }catch(e){botEl.textContent='Error: '+e.message+'\n\nTip: For GPT-5 use gpt-5 if you have access, else use gpt-4o.';}
    send.disabled=false; chat.scrollTop=chat.scrollHeight;
  }
  $('ai-b-analyze').onclick=()=>askAI('Analyze this page in detail. What is it about, key points, and what should I know?');
  $('ai-b-summarize').onclick=()=>askAI('Summarize this page in 5 concise bullet points.');
  $('ai-b-extract').onclick=()=>{const ctx=getPageContext(); addMsg(`Page: ${ctx.title}\nURL: ${ctx.url}\n\nExtracted ${ctx.text.length} chars:\n${ctx.text.slice(0,3000)}...`,'bot');};
  send.onclick=()=>{const v=input.value.trim(); if(v){input.value=''; askAI(v);}};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send.click();}});
  $('ai-b-close').onclick=()=>root.remove();
  $('ai-b-clear').onclick=()=>{chat.innerHTML='';history=[history[0]];addMsg('Cleared. Ask me about this page.','bot');};
  let drag=false,sx,sy,ix,iy; const head=$('ai-blue-head');
  head.addEventListener('mousedown',e=>{drag=true;sx=e.clientX;sy=e.clientY;const r=root.getBoundingClientRect();ix=r.left;iy=r.top;});
  window.addEventListener('mousemove',e=>{if(!drag)return;root.style.left=ix+e.clientX-sx+'px';root.style.top=iy+e.clientY-sy+'px';root.style.right='auto';});
  window.addEventListener('mouseup',()=>drag=false);
})();
