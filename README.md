# Resume Analyzer — Fixed Deployment

## File Structure (IMPORTANT)
```
resume-analyzer-v2/        ← root of your GitHub repo
├── index.html             ← frontend (must be in ROOT, not in /public)
├── api/
│   └── analyze.js         ← serverless function
├── vercel.json
├── package.json
└── .gitignore
```

## Deploy Steps

### 1. Get Free Gemini API Key
- Go to https://aistudio.google.com
- Sign in with Google → "Get API Key" → "Create API key"
- Copy it (starts with AIzaSy...)

### 2. Push to GitHub
- Create a new repo at github.com
- Upload ALL these files (keep the structure above)

### 3. Deploy on Vercel
- Go to vercel.com → New Project → Import your GitHub repo
- Click Deploy (no build settings needed)

### 4. Add Environment Variable
- Vercel Dashboard → Your Project → Settings → Environment Variables
- Name: GEMINI_API_KEY
- Value: AIzaSy... (your key)
- Click Save → Deployments → Redeploy

## That's it! Your app will be live at https://your-project.vercel.app
