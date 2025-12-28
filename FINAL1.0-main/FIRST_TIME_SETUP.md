# 🎯 First Time Project Setup Guide

## 📋 Do You Need to Install Packages?

### **Option 1: Automatic (Recommended) ⭐**
Just run `start-all.sh` - it will automatically check and install dependencies!

```bash
cd /workspaces/FINAL1.0
./start-all.sh
```

If packages are missing, it will install them automatically.

---

### **Option 2: Manual Installation**
If you want to install packages separately first:

```bash
cd /workspaces/FINAL1.0
./install-dependencies.sh
./start-all.sh
```

---

## 🔍 When Do You Need to Install Packages?

### **First Time Opening Project:**
✅ YES - Install packages

### **Already Installed Before:**
❌ NO - Just run `./start-all.sh`

### **After git clone:**
✅ YES - Install packages

### **After git pull:**
⚠️ MAYBE - Only if dependencies changed

---

## 📦 What Packages Are Installed?

### Backend (Python):
```bash
cd /workspaces/FINAL1.0/backend
pip install -r requirements.txt
```

**Packages:**
- fastapi
- uvicorn
- python-multipart
- PyPDF2
- spacy
- python-dotenv
- mysql-connector-python

### Frontend (Node.js):
```bash
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
npm install
```

**Packages:**
- next
- react
- react-dom
- typescript
- tailwindcss
- And ~290 other dependencies

---

## 🚀 Complete Workflow

### **First Time:**
```bash
# Navigate to project
cd /workspaces/FINAL1.0

# Option A: Automatic (Recommended)
./start-all.sh
# Will auto-install dependencies if needed!

# Option B: Manual
./install-dependencies.sh  # Install first
./start-all.sh             # Then start
```

### **Every Time After:**
```bash
cd /workspaces/FINAL1.0
./start-all.sh
# No installation needed! Dependencies already there.
```

---

## ⚡ Quick Answer

### Q: "Project open karte hi kya command du?"

**A:** Pehli baar ho toh:
```bash
./start-all.sh
```
Ye automatically packages install kar dega agar missing hain!

**Ya agar manually install karna ho:**
```bash
./install-dependencies.sh  # Pehle packages install karo
./start-all.sh             # Fir start karo
```

**Agli baar se:**
```bash
./start-all.sh  # Bas ye ek command!
```

---

## 🔄 Dependencies Already Installed Check

`start-all.sh` automatically checks:

- ✅ `node_modules/` folder exists → Frontend installed
- ✅ Python packages imported successfully → Backend installed
- ❌ If missing → Auto-installs them!

---

## 💾 Installation Size

- **Backend:** ~50-100 MB
- **Frontend:** ~200-300 MB
- **Total:** ~300-400 MB

---

## ⏱️ Installation Time

- **Backend:** ~30-60 seconds
- **Frontend:** ~1-2 minutes (first time)
- **Total:** ~2-3 minutes

---

## 🎯 Summary

| Scenario | Command |
|----------|---------|
| **First time opening** | `./start-all.sh` (auto-installs) |
| **Manual install** | `./install-dependencies.sh` |
| **Regular use** | `./start-all.sh` |
| **After git clone** | `./start-all.sh` (auto-installs) |

---

## ✅ Recommended Approach

### **SIMPLEST WAY:**

Just always run:
```bash
./start-all.sh
```

It's smart enough to:
- ✅ Check if packages are installed
- ✅ Install them if missing
- ✅ Skip installation if already done
- ✅ Start services

---

## 🎊 You're Ready!

**First time or every time, just run:**
```bash
cd /workspaces/FINAL1.0
./start-all.sh
```

Then open: **http://localhost:3000/analyzer**

---

**Bottom Line:** `./start-all.sh` is smart - it handles everything! 🚀
