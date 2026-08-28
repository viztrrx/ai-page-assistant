# AI Page Assistant - Dark Blue Edition

A tiny, beautiful AI overlay you can inject into ANY website via Chrome DevTools console using a single `fetch()` command.

It reads what's on your current page and lets you summarize, analyze, and ask questions using **GPT-4o / GPT-5**.

### ✨ Features
- **One-line loader:** `fetch().then(eval)` - no extension needed
- **Sees your page:** Analyzes title, URL, and visible text
- **Dark blue, minimal UI:** Draggable, clean, simple
- **GPT-4o & GPT-5 ready:** Switch models in the UI
- **Local-only key:** API key saved in localStorage, never sent anywhere except OpenAI

---

### 🚀 How to Install

1. Create a public GitHub repo named `ai-page-assistant`
2. Upload `ai-overlay.js` from this package
3. Get the **Raw** URL: `https://raw.githubusercontent.com/YOUR_USERNAME/ai-page-assistant/main/ai-overlay.js`

### 💻 How to Use

Go to any website, press **F12 > Console**, paste this:

```js
fetch('https://raw.githubusercontent.com/YOUR_USERNAME/ai-page-assistant/main/ai-overlay.js')
  .then(res => res.text())
  .then(code => eval(code));
```

Replace `YOUR_USERNAME`.

Then:
1. Add your OpenAI API key (from https://platform.openai.com/api-keys)
2. Click **Analyze Page** or **Summarize** or just ask a question
3. Model defaults to `gpt-4o` - change to `gpt-5`, `gpt-5-mini`, `gpt-4-turbo` if you have access

### 🎨 Bookmarklet (even faster)

Create a new Bookmark and paste this as the URL:

```
javascript:fetch('https://raw.githubusercontent.com/YOUR_USERNAME/ai-page-assistant/main/ai-overlay.js').then(r=>r.text()).then(eval)
```

Click it on any page.

### 🔒 Privacy

- No backend
- No tracking
- Your OpenAI key is stored only in your browser `localStorage` as `ai_blue_key`
- Direct call from your browser to OpenAI

### 📁 Files

- `ai-overlay.js` - The main UI + logic (the one you fetch)
- `index.html` - Landing page for your GitHub Pages
- `bookmarklet.html` - Drag-and-drop bookmarklet installer

MIT License.
