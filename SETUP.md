# BrandOS — Setup Guide

Work through this in order. Each section has a ★ where you need to take a manual action.

---

## Step 1 ★ — Create your accounts

You need four accounts. Create each one if you don't have it already.

| Service | URL | What for |
|---|---|---|
| GitHub | https://github.com/signup | Stores all the code |
| Vercel | https://vercel.com/signup | Deploys the app (sign up with GitHub) |
| Supabase | https://supabase.com | Database and login |
| Anthropic Console | https://console.anthropic.com | Claude API key |

---

## Step 2 ★ — Create the GitHub repository

1. Go to https://github.com/new
2. Repository name: **brandos**
3. Set to **Private**
4. Click **Create repository**
5. GitHub will show you the repo URL — copy it (looks like `https://github.com/yourusername/brandos`)

**To invite Zach as a collaborator:**
1. In the repo, go to **Settings → Collaborators → Add people**
2. Enter `zach@improvbroadway.com` (or his GitHub username)

---

## Step 3 ★ — Turn on branch protection (the seatbelt)

1. In your repo, go to **Settings → Branches**
2. Under "Branch protection rules", click **Add rule**
3. Branch name pattern: `main`
4. Check **Require a pull request before merging**
5. Click **Create** (or **Save changes**)

Done. Nobody — including you — can now push directly to `main` by accident.

---

## Step 4 — Push the code

You need Node.js installed. If you don't have it: https://nodejs.org (install the LTS version).

Open Terminal (Mac: press Cmd+Space, type "Terminal") and run these commands one at a time:

```bash
# Navigate to your Downloads folder (or wherever you unzipped the project)
cd ~/Downloads/brandos

# Install dependencies
npm install

# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial BrandOS scaffold"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/brandos.git
git push -u origin main
```

Replace `YOURUSERNAME` with your actual GitHub username.

---

## Step 5 ★ — Connect to Vercel

1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Find your **brandos** repo and click **Import**
4. Leave all settings at default
5. Click **Deploy**

Vercel will build and deploy the app. You'll get a live URL like `brandos-yourusername.vercel.app`.

**Verify branch previews are on:** In the Vercel project, go to Settings → Git. "Preview Deployments" should say "All" or be enabled — this is on by default. Every branch you push will get its own preview URL automatically.

---

## Step 6 ★ — Create your Supabase project

1. Go to https://supabase.com/dashboard/new/_ and create a new project
2. Name it **brandos**
3. Set a strong database password (save it somewhere)
4. Choose the region closest to you
5. Wait ~2 minutes for it to set up

**Get your keys:**
1. Go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

---

## Step 7 — Run the database schema

1. In your Supabase project, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Paste the entire contents into the SQL editor
5. Click **Run**

You should see "Success. No rows returned."

**Set up Supabase Auth email confirmations:**
1. Go to **Authentication → Email Templates**
2. Under "Confirm signup", set the redirect URL to: `https://your-vercel-url.vercel.app/auth/callback`
   (Replace with your actual Vercel URL from Step 5)

---

## Step 8 ★ — Add environment variables to Vercel

1. In Vercel, go to your **brandos** project → **Settings → Environment Variables**
2. Add these three variables (paste the values you copied in Step 6):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ANTHROPIC_API_KEY` | Your Claude API key (see below) |

**To get your Claude API key:**
1. Go to https://console.anthropic.com
2. Go to **API Keys → Create Key**
3. Name it "BrandOS"
4. Copy the key immediately (you can't see it again)

3. After adding all variables, go to **Deployments** and click **Redeploy** on the latest deployment so the new variables take effect.

---

## Step 9 — For local development

Create a file called `.env.local` in the project root (this file is already in `.gitignore` — it won't be committed):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Then run:

```bash
npm run dev
```

The app will be available at http://localhost:3000.

---

## Step 10 — Link your user to the BrandOS brand

After you sign up through the app for the first time:

1. Go to Supabase **SQL Editor**
2. Open `supabase/migrations/002_link_user_to_brand.sql`
3. Replace `your-email@example.com` with the email you signed up with
4. Run the query

This links your account to the BrandOS brand row so you can see the brand box.

---

## Step 11 — Test the seatbelt

Prove the branch workflow works:

```bash
# Create your personal branch
git checkout -b josh-sandbox

# Make a tiny change (e.g. add a comment to any file), then:
git add .
git commit -m "Test: josh sandbox branch"
git push origin josh-sandbox
```

Check Vercel — within ~1 minute you'll see a new preview deployment with a unique URL just for your branch. `main` is untouched.

Have Zach do the same with `zach-sandbox`.

---

## You're done when:

- [ ] `brandos` repo is private and Zach is a collaborator  
- [ ] Branch protection is ON for `main`  
- [ ] The app is live on a Vercel URL  
- [ ] You and Zach each have a branch with its own preview URL  
- [ ] Supabase is connected and login works  
- [ ] You can see the brand box after signing in  
- [ ] Typing a prompt and clicking Generate returns a preview  
- [ ] Clicking Deploy marks the page as live  
