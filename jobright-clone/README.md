# JobRight — AI Job Search Copilot (Recreation)

A front-end recreation of [jobright.ai](https://jobright.ai), the AI job search copilot. Built with **plain HTML, CSS, and JavaScript** — no frameworks, no build step, no backend. Open it in a browser and it works.

> ⚠️ This is a learning/portfolio project. It is not affiliated with Jobright, Inc. All job listings are fictional mock data.

## ✨ Features

- **Landing page** (`index.html`) — hero, feature grid, how-it-works, testimonials, and pricing sections styled after Jobright's dark-navy + neon-green look
- **AI job matching** (`app.html`) — every job is scored against your profile with a weighted match engine:
  - Skills overlap — 45%
  - Experience fit vs. role level — 25%
  - Work mode preference (remote/hybrid/onsite) — 15%
  - H1B visa fit — 15%
- **Match tiers** — STRONG (85%+), GOOD (70%+), FAIR, with score rings and per-job match breakdowns
- **Filters** — search, experience level, work mode, H1B sponsorship, minimum match score
- **Orion AI copilot** — chat interface with career advice on resumes, interviews, salary negotiation, certifications, and "why did I match with this job?" explanations
- **Application tracker** — like ❤️ and apply 📬 to jobs; tabs for Liked and Applied
- **Profile & onboarding** — skill bank, experience, and preferences that drive the match scores; recalculates instantly on save
- **Persistence** — profile, likes, applications, and chat history are saved to `localStorage`

## 🚀 Run it

No install needed:

```bash
# option 1: just open the file
open jobright-clone/index.html

# option 2: serve it (nicer URLs)
cd jobright-clone && python3 -m http.server 8000
# → http://localhost:8000
```

Works great on GitHub Pages too — point Pages at this folder.

## 📁 Structure

```
jobright-clone/
├── index.html          # landing page
├── app.html            # the app: jobs, Orion, tracker, profile
└── assets/
    ├── css/style.css   # all styles (landing + app)
    └── js/
        ├── data.js     # mock jobs, skill bank, Orion responses
        └── app.js      # matching engine, views, chat, persistence
```

## 🧠 How the matching works

Each job in `data.js` lists required skills and a level (Entry/Mid/Senior). When you save your profile, `scoreJob()` in `app.js` computes a weighted score per job and the feed re-sorts. Toggle skills in **My Profile** and watch the scores move — jobs sharing your skills jump to the top as STRONG MATCH.
