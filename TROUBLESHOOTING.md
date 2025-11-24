# 🔧 Troubleshooting Guide

## npm install Taking Too Long

### Why It's Slow
The Azure SDK packages are quite large (100+ MB combined). First-time installation typically takes 5-10 minutes depending on your internet connection.

### Solutions

#### 1. Check if it's actually running
```bash
# Windows
tasklist | findstr node

# Mac/Linux
ps aux | grep npm
```

#### 2. Use npm with verbose output to see progress
```bash
cd backend
npm install --verbose
```

#### 3. Try with legacy peer deps (if stuck)
```bash
cd backend
npm install --legacy-peer-deps
```

#### 4. Clear cache and retry
```bash
npm cache clean --force
cd backend
npm install
```

#### 5. Install packages individually (faster feedback)
```bash
cd backend

# Core packages first
npm install express cors dotenv

# Azure packages
npm install @azure/identity @azure/openai
npm install @azure/arm-resources @azure/arm-compute
npm install @azure/arm-network @azure/arm-sql @azure/arm-storage

# Dev dependencies
npm install --save-dev nodemon
```

#### 6. Use yarn instead (often faster)
```bash
# Install yarn globally
npm install -g yarn

# Use yarn
cd backend
yarn install
```

#### 7. Check your internet connection
```bash
# Test npm registry connection
npm ping
```

### Expected Installation Times

| Connection Speed | Backend | Frontend | Total |
|-----------------|---------|----------|-------|
| Fast (100+ Mbps) | 3-5 min | 2-3 min | 5-8 min |
| Medium (10-50 Mbps) | 5-8 min | 3-5 min | 8-13 min |
| Slow (<10 Mbps) | 10-15 min | 5-8 min | 15-23 min |

### What's Being Downloaded

**Backend (~150 MB):**
- @azure/arm-compute (~30 MB)
- @azure/arm-network (~35 MB)
- @azure/arm-resources (~20 MB)
- @azure/arm-sql (~25 MB)
- @azure/arm-storage (~20 MB)
- @azure/identity (~10 MB)
- @azure/openai (~5 MB)
- Other dependencies (~5 MB)

**Frontend (~100 MB):**
- react + react-dom (~5 MB)
- vite (~10 MB)
- tailwindcss (~15 MB)
- Other dependencies (~70 MB)

## Other Common Issues

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### Azure Authentication Failed

**Error:** `Authentication failed` or `Invalid credentials`

**Solutions:**
1. Verify credentials in `backend/.env`
2. Check Service Principal hasn't expired
3. Ensure Service Principal has Reader role
4. Test with: `cd backend && npm test`

### OpenAI Connection Failed

**Error:** `Failed to connect to Azure OpenAI`

**Solutions:**
1. Verify `AZURE_OPENAI_ENDPOINT` is correct
2. Check `AZURE_OPENAI_API_KEY` is valid
3. Ensure `AZURE_OPENAI_DEPLOYMENT_NAME` matches your deployment
4. Verify API version is supported

### Module Not Found

**Error:** `Cannot find module '@azure/...'`

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start

**Error:** Various Vite errors

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Errors

**Error:** `Access-Control-Allow-Origin` errors

**Solution:**
1. Ensure backend is running on port 3000
2. Check `vite.config.js` proxy configuration
3. Verify CORS is enabled in `backend/server.js`

## Performance Tips

### Speed Up Development

1. **Use nodemon for backend auto-reload:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Keep both terminals open:**
   - Terminal 1: Backend
   - Terminal 2: Frontend

3. **Use browser dev tools:**
   - F12 to open console
   - Check Network tab for API calls
   - Monitor Console for errors

### Reduce Package Size

If you don't need certain Azure resources, you can remove them from `backend/package.json`:

```json
{
  "dependencies": {
    // Keep only what you need
    "@azure/arm-compute": "^21.0.0",  // For VMs
    "@azure/arm-sql": "^10.0.0",      // For databases
    // Remove others if not needed
  }
}
```

## Getting Help

### Check Logs

**Backend logs:**
```bash
# If using start.sh/start.bat
tail -f backend/backend.log  # Mac/Linux
type backend\backend.log     # Windows

# If running manually
# Check the terminal where backend is running
```

**Frontend logs:**
```bash
# Check the terminal where frontend is running
# Or check browser console (F12)
```

### Verify Setup

Run the connection test:
```bash
cd backend
npm test
```

This will verify:
- ✓ Environment variables are set
- ✓ Azure authentication works
- ✓ Can access resource groups
- ✓ Azure OpenAI connection is successful

### Still Having Issues?

1. Check all environment variables in `backend/.env`
2. Verify Node.js version: `node --version` (should be 18+)
3. Check npm version: `npm --version`
4. Review error messages carefully
5. Check Azure service status
6. Ensure firewall isn't blocking connections

## Quick Fixes Checklist

- [ ] Node.js 18+ installed
- [ ] All dependencies installed (`npm install` in both folders)
- [ ] Environment variables set in `backend/.env`
- [ ] Azure credentials are valid
- [ ] Ports 3000 and 5173 are available
- [ ] Internet connection is stable
- [ ] Firewall allows Node.js connections
- [ ] Azure resources exist and are accessible

---

**Need more help?** Check the main [README.md](README.md) or [SETUP.md](SETUP.md)