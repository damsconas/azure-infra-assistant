# 🚀 Quick Start Guide

Get your Azure Infrastructure Query System up and running in minutes!

## Prerequisites

- ✅ Node.js 18+ installed ([Download](https://nodejs.org/))
- ✅ Azure subscription with resources
- ✅ Azure credentials configured (already in `backend/.env`)

## Option 1: One-Click Start (Recommended)

### For Windows Users:
```bash
# Double-click or run:
start.bat
```

### For Mac/Linux Users:
```bash
# Make scripts executable (first time only):
chmod +x start.sh stop.sh

# Run the start script:
./start.sh
```

That's it! The script will:
1. ✅ Check Node.js installation
2. ✅ Install all dependencies automatically
3. ✅ Start backend server (port 3000)
4. ✅ Start frontend dev server (port 5173)
5. ✅ Open in your browser automatically

## Option 2: Manual Start

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Test Connection (Optional but Recommended)

```bash
cd backend
npm test
```

This verifies your Azure credentials and OpenAI connection.

### Step 3: Start Backend

```bash
cd backend
npm start
```

Backend will run on `http://localhost:3000`

### Step 4: Start Frontend (New Terminal)

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🌐 Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## 💬 Try Your First Query

Once the app loads, try asking:

- "What is the status of dami-vm?"
- "What is the SKU of xyz database?"
- "How many subnets are in the abc vnet?"
- "List all resources in rg-prod"

## 🛑 Stopping the Application

### Using Scripts:

**Windows:**
```bash
stop.bat
```

**Mac/Linux:**
```bash
./stop.sh
```

### Manual Stop:
Press `Ctrl+C` in both terminal windows (backend and frontend)

## 🔧 Troubleshooting

### Port Already in Use

**Backend (Port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### Dependencies Installation Failed

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
cd backend && npm install
cd ../frontend && npm install
```

### Azure Connection Issues

1. Verify credentials in `backend/.env`
2. Check Service Principal has Reader permissions
3. Run connection test: `cd backend && npm test`

## 📚 Next Steps

- Read [SETUP.md](SETUP.md) for detailed configuration
- Check [README.md](README.md) for full documentation
- Explore example queries in the interface

## 🆘 Need Help?

- Check the terminal logs for error messages
- Verify all environment variables in `backend/.env`
- Ensure Azure resources exist and are accessible
- Review the troubleshooting section in SETUP.md

---

**Happy Querying! 🎉**