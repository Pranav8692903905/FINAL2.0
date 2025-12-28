# 🚀 Quick Commands Guide

## One-Command Startup

### Start Everything (Backend + Frontend):
```bash
cd /workspaces/FINAL1.0
./start-all.sh
```

### Stop Everything:
```bash
./stop-all.sh
```

---

## What `start-all.sh` Does:

1. ✅ Stops any existing services
2. ✅ Starts FastAPI Backend (port 8000)
3. ✅ Starts Next.js Frontend (port 3000)
4. ✅ Verifies both are running
5. ✅ Shows access URLs
6. ✅ Monitors services continuously

---

## Access Points After Starting:

| Service | URL | Description |
|---------|-----|-------------|
| **Main App** | http://localhost:3000/analyzer | 👈 START HERE |
| Frontend | http://localhost:3000 | Home page |
| Backend | http://localhost:8000 | API health |
| Admin | http://localhost:8000/admin/stats | Statistics |

---

## Usage Examples:

### First Time Setup:
```bash
cd /workspaces/FINAL1.0
./SETUP_INSTRUCTIONS.sh  # Install dependencies (one time)
./start-all.sh           # Start services
```

### Daily Use:
```bash
cd /workspaces/FINAL1.0
./start-all.sh
```

### Stop Services:
```bash
./stop-all.sh
```

---

## Monitoring & Logs:

### View Backend Logs:
```bash
tail -f /tmp/backend.log
```

### View Frontend Logs:
```bash
tail -f /tmp/frontend.log
```

### Check Status:
```bash
curl http://localhost:8000/    # Backend
curl http://localhost:3000     # Frontend
```

---

## Troubleshooting:

### Services won't start?
```bash
# Stop everything first
./stop-all.sh

# Wait 5 seconds
sleep 5

# Start again
./start-all.sh
```

### Port already in use?
```bash
# Kill all processes on ports
lsof -ti:8000 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Start again
./start-all.sh
```

### Check running processes:
```bash
ps aux | grep -E "python3 main|next dev"
```

---

## Advanced Options:

### Start in Background (Detached):
```bash
nohup ./start-all.sh > /tmp/startup.log 2>&1 &
```

### Start Backend Only:
```bash
cd /workspaces/FINAL1.0/backend
python3 main.py
```

### Start Frontend Only:
```bash
cd /workspaces/FINAL1.0/RESUME-BUILDER2-main
npm run dev
```

---

## Keyboard Shortcuts:

- **Ctrl+C** - Stop the monitoring (services keep running)
- **Ctrl+Z** - Pause script
- **./stop-all.sh** - Stop all services

---

## Quick Reference:

| Task | Command |
|------|---------|
| Start All | `./start-all.sh` |
| Stop All | `./stop-all.sh` |
| Verify | `./VERIFY.sh` |
| Setup | `./SETUP_INSTRUCTIONS.sh` |
| View Logs | `tail -f /tmp/backend.log` |

---

## That's It! 🎉

Just run:
```bash
./start-all.sh
```

Then open: **http://localhost:3000/analyzer**
