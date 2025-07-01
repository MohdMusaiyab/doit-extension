# 📝  DO-IT Chrome Extension

A modern, clean, themeable to-do list extension built with HTML, CSS, and JavaScript.  
Supports filters, task search, drag & drop, theme toggle, and more.

## 🧠 Why I Built This

I found myself constantly switching to Notion just to manage a quick list of tasks.  
Surprisingly, I couldn’t find a simple and elegant to-do Chrome extension — most available ones were either bloated, overly complex, or filled with unnecessary features.

So I decided to build my own extension that stays out of the way but works exactly as needed.  
This is for people like me who just want something fast, functional, and minimal without compromise.

## 🚀 Features

- ✅ Add, delete, and edit tasks  
- ☑️ Mark tasks as completed  
- 🎯 Filter tasks: All / Uncompleted / Completed  
- 🔍 Search tasks  
- 🌗 Light & Dark theme toggle  
- 🔄 Drag & Drop task reordering  
- 🚮 Remove all completed tasks  
- ⚡ Keyboard shortcut: Press `Enter` to add task  
- 📱 Responsive design  

## 📷 Preview
![image](https://github.com/user-attachments/assets/e4b7199c-d1cc-4e7e-9178-b8c5cdbb405d)

![image](https://github.com/user-attachments/assets/da2b7014-236a-4fa7-953a-31a95acc8137)



## 🧩 Installation (Local)

1. Clone this repository  
2. Open `chrome://extensions/` in your Chrome browser  
3. Enable **Developer mode** (top right corner)  
4. Click **Load unpacked**  
5. Select the folder containing this extension  

## 📁 Folder Structure
```
doit-extension/
├── manifest.json
├── newtab.html
├── newtab.css
├── newtab.js
└── README.md
```
## 🔧 Tech Stack

- HTML5  
- Vanilla JavaScript (ES6+)  
- CSS3 with custom properties  
- Chrome Extension APIs (`chrome.storage`)  

## ☁️ Enable Chrome Sync (Optional)

To sync tasks across devices:  
Replace `chrome.storage.local` with `chrome.storage.sync` in `newtab.js`.

## 📦 Publishing to Chrome Web Store

1. Create a `.zip` of the extension folder  
2. Go to [Chrome Web Store Developer Dashboard](https://chromewebstore.google.com/)  
3. Pay one-time $5 developer registration fee  
4. Submit your extension for review  

## 🛠️ Contributing

Contributions are welcome!  
If you'd like to add features or report bugs, feel free to open an issue or pull request.

## 📄 License

MIT

## 🙌 Author

Made with ❤️ and Curosity by Musaiyab.
