# 🚀 Deployment Guide

This guide covers deployment of India Legal Assistant on various platforms.

## Prerequisites

Before deploying, ensure you have:
- Node.js 18.0.0 or higher installed
- Git installed
- A GitHub account
- Tested the application locally

## Platform-Specific Deployment

### 1. Heroku (Recommended for Beginners)

**Free Tier**: Yes (with limitations)

#### Steps:

1. **Install Heroku CLI**
```bash
# macOS
brew tap heroku/brew && brew install heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
heroku create india-legal-assistant
```

4. **Add Procfile** (already included in repo)
```
web: node server.js
```

5. **Deploy**
```bash
git push heroku main
```

6. **Open App**
```bash
heroku open
```

#### Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set PORT=3000
```

---

### 2. Railway

**Free Tier**: Yes (500 hours/month)

#### Steps:

1. **Visit** [railway.app](https://railway.app)

2. **Click "Start a New Project"**

3. **Select "Deploy from GitHub repo"**

4. **Connect your repository**
   - Authorize Railway to access your GitHub
   - Select `india-legal-assistant` repository

5. **Configure**
   - Railway auto-detects Node.js
   - No additional configuration needed

6. **Deploy**
   - Click "Deploy Now"
   - Railway will build and deploy automatically

7. **Get URL**
   - Click on your deployment
   - Copy the generated URL

#### Environment Variables (Optional)
```
NODE_ENV=production
```

---

### 3. Render

**Free Tier**: Yes (with spin-down after inactivity)

#### Steps:

1. **Visit** [render.com](https://render.com)

2. **Click "New +"** → "Web Service"

3. **Connect Repository**
   - Authorize Render
   - Select your repository

4. **Configure Service**
   - Name: `india-legal-assistant`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

5. **Environment Variables**
```
NODE_ENV=production
```

6. **Click "Create Web Service"**

7. **Wait for Deployment**
   - First deploy takes 3-5 minutes
   - You'll get a `.onrender.com` URL

---

### 4. Vercel (Frontend + Serverless)

**Free Tier**: Yes (generous limits)

#### Steps:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Follow Prompts**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: india-legal-assistant
   - Directory: ./
   - Override settings: No

5. **Production Deploy**
```bash
vercel --prod
```

**Note**: You may need to create a `vercel.json` for proper routing:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

---

### 5. DigitalOcean App Platform

**Free Tier**: No (starts at $5/month)

#### Steps:

1. **Visit** [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)

2. **Click "Create App"**

3. **Choose Source**
   - GitHub
   - Select repository

4. **Configure App**
   - Name: india-legal-assistant
   - Region: Closest to India (Bangalore recommended)
   - Branch: main
   - Autodeploy: Yes

5. **Review Resources**
   - Type: Web Service
   - HTTP Port: 3000
   - Build Command: `npm install`
   - Run Command: `npm start`

6. **Environment Variables**
```
NODE_ENV=production
```

7. **Launch**
   - Click "Create Resources"
   - Wait 5-10 minutes for deployment

---

### 6. AWS EC2 (Full Control)

**Free Tier**: Yes (12 months, t2.micro)

#### Steps:

1. **Launch EC2 Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: t2.micro
   - Security Group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect to Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

3. **Install Node.js**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y git
```

4. **Clone Repository**
```bash
git clone https://github.com/yourusername/india-legal-assistant.git
cd india-legal-assistant
npm install
```

5. **Install PM2**
```bash
sudo npm install -g pm2
```

6. **Start Application**
```bash
pm2 start server.js --name india-legal-assistant
pm2 startup
pm2 save
```

7. **Install Nginx (Optional)**
```bash
sudo apt install nginx

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx config:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

### 7. Google Cloud Platform (Cloud Run)

**Free Tier**: Yes (2 million requests/month)

#### Steps:

1. **Install Google Cloud SDK**
```bash
# Download from cloud.google.com/sdk
```

2. **Login**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

3. **Create Dockerfile** (if not exists)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

4. **Build and Deploy**
```bash
gcloud run deploy india-legal-assistant \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

---

## Environment Variables

Create a `.env` file for production:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Analytics
# GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

## SSL/HTTPS Setup

### For Heroku, Railway, Render, Vercel
- SSL is automatically provided
- Custom domain SSL is free on most platforms

### For Custom Servers (EC2, DigitalOcean)

**Using Let's Encrypt (Free)**:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
sudo certbot renew --dry-run
```

## Custom Domain Setup

### 1. Get a Domain
- Namecheap, GoDaddy, Google Domains
- `.in` domains available for India

### 2. Configure DNS
Point your domain to your deployment:

**For Heroku**:
```
CNAME: www → yourapp.herokuapp.com
A: @ → IP from Heroku
```

**For Render/Railway**:
```
CNAME: www → yourapp.onrender.com
```

**For AWS EC2**:
```
A: @ → Your EC2 IP
CNAME: www → Your EC2 IP or domain
```

### 3. Enable SSL
Most platforms provide free SSL for custom domains.

## Performance Optimization

### 1. Enable Compression
Already included in `server.js` via compression middleware.

### 2. Set up CDN
Use Cloudflare (free tier) for:
- DDoS protection
- Global CDN
- SSL
- Caching

**Steps**:
1. Add site to Cloudflare
2. Update nameservers
3. Enable "Always Use HTTPS"
4. Set cache level to "Standard"

### 3. Minify Assets
```bash
# Optional: Use build script
npm install -g minify
minify public/styles.css > public/styles.min.css
minify public/app.js > public/app.min.js
```

## Monitoring & Logging

### Application Monitoring

**Using PM2 (Node.js)**:
```bash
pm2 monit
pm2 logs india-legal-assistant
```

**Using Heroku**:
```bash
heroku logs --tail
heroku ps
```

### Uptime Monitoring

**Free Services**:
- UptimeRobot (50 monitors free)
- Pingdom (1 monitor free)
- StatusCake (10 monitors free)

Set up alerts for:
- Downtime
- Response time > 3s
- Error rate > 1%

## Backup & Recovery

### Code Backup
- Primary: GitHub repository
- Backup: GitLab/Bitbucket mirror

### Data Backup
Since we use in-memory storage:
- No persistent data to backup
- Stateless design allows instant recovery

### Disaster Recovery Plan
1. Keep repository updated
2. Document environment variables
3. Maintain deployment scripts
4. Test deployment on staging

## Scaling Strategies

### Horizontal Scaling

**For High Traffic**:
1. **Load Balancer**: Use platform's built-in load balancing
2. **Multiple Instances**: Deploy to multiple regions
3. **Auto-scaling**: Configure based on CPU/memory

**Example (Heroku)**:
```bash
heroku ps:scale web=3
```

### Vertical Scaling

**Upgrade Instance Size**:
- Heroku: Upgrade dyno type
- Railway: Upgrade plan
- AWS: Change instance type

### Caching

Add Redis for caching (future enhancement):
```javascript
// Example: Cache legal analysis results
const redis = require('redis');
const client = redis.createClient();

app.post('/api/analyze', async (req, res) => {
  const cacheKey = JSON.stringify(req.body);
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // ... analysis logic
  
  await client.setex(cacheKey, 3600, JSON.stringify(result));
  res.json(result);
});
```

## Cost Estimation

| Platform | Free Tier | Paid Tier | Recommended For |
|----------|-----------|-----------|-----------------|
| Heroku | 550 hrs/month | $7/month | Testing |
| Railway | 500 hrs/month | $5/month | Small projects |
| Render | Unlimited* | $7/month | Personal projects |
| Vercel | 100 GB-hrs | $20/month | Serverless |
| DigitalOcean | - | $5/month | Full control |
| AWS EC2 | 750 hrs/month (12mo) | $3.5/month | Production |

*Spins down after inactivity

## Security Checklist

- [x] HTTPS enabled
- [x] Helmet.js security headers
- [x] CORS configured
- [x] Environment variables secured
- [x] No sensitive data in logs
- [x] Rate limiting (ready to enable)
- [x] Input sanitization
- [x] CSP headers set

## Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**2. Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**3. Heroku H10 Error (App Crashed)**
```bash
heroku logs --tail
# Check for errors in logs
```

**4. Memory Issues**
```bash
# Increase Node.js memory
node --max-old-space-size=512 server.js
```

## Support

For deployment issues:
1. Check platform-specific documentation
2. Open GitHub issue
3. Contact platform support

---

**Need Help?** Open an issue on GitHub with:
- Platform you're deploying to
- Error messages
- Steps you've tried