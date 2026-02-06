# 🚀 QUICK START - Run in 2 Minutes!

## For Windows Users

1. **Open Command Prompt or PowerShell**
   ```
   Press Windows + R
   Type: cmd
   Press Enter
   ```

2. **Navigate to project folder**
   ```
   cd path\to\india-legal-assistant
   ```

3. **Install dependencies**
   ```
   npm install
   ```

4. **Start the server**
   ```
   npm start
   ```

5. **Open browser**
   ```
   Visit: http://localhost:3000
   ```

---

## For Mac/Linux Users

1. **Open Terminal**
   ```
   Press Cmd + Space (Mac) or Ctrl + Alt + T (Linux)
   Type: terminal
   Press Enter
   ```

2. **Navigate to project folder**
   ```bash
   cd path/to/india-legal-assistant
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Open browser**
   ```
   Visit: http://localhost:3000
   ```

---

## Using Online IDE (Replit/CodeSandbox)

### Replit
1. Go to https://replit.com
2. Click "Create Repl"
3. Choose "Node.js"
4. Upload all project files
5. Click "Run" button

### CodeSandbox
1. Go to https://codesandbox.io
2. Click "Create Sandbox"
3. Choose "Node.js Server"
4. Upload all project files
5. Application starts automatically

---

## Test the Application

### Test Case 1: Simple Issue
```
Problem: "My landlord is not returning my security deposit"
State: Maharashtra
City: Mumbai
Language: English
Profession: Employee
```
Click "Get Legal Information" and wait 2 seconds.

---

## Troubleshooting

### "npm not found"
**Solution:** Install Node.js from https://nodejs.org

### "Port 3000 already in use"
**Solution:** 
```bash
# Change port in server.js line 3:
const PORT = process.env.PORT || 3001;
```

### "Cannot find module"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

---

## Project Files

You should have these 9 files:
- ✅ index.html (Frontend)
- ✅ server.js (Backend)
- ✅ package.json (Dependencies)
- ✅ README.md (Documentation)
- ✅ DEPLOYMENT.md (Deploy guide)
- ✅ FEATURES.md (Feature showcase)
- ✅ test.js (Testing script)
- ✅ .gitignore (Git ignore rules)
- ✅ .env.example (Environment template)

---

## Need Help?

- 📖 Read README.md for full documentation
- 🚀 Read DEPLOYMENT.md for deployment options
- 🎯 Read FEATURES.md for feature details
- 🧪 Run: `node test.js` to test API

---

## Success Checklist

After starting the server, you should see:
```
🇮🇳 India Legal Information Assistant running on http://localhost:3000
📋 Features enabled:
  ✓ Multi-language support
  ✓ Simplified legal explanations
  ✓ Action recommendations
  ✓ Jurisdiction detection
  ✓ Document checklist
  ✓ Urgency assessment
  ✓ Profession-based personalization
  ✓ Privacy-first (no data storage)
```

If you see this, **everything is working!** 🎉

---

**Ready to demo? Visit: http://localhost:3000**
