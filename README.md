# FocusFlow — Smart Study Planner

A responsive, static study planner built with HTML, CSS, and vanilla JavaScript.

## Features
- Create, edit, complete, and delete study tasks
- Add subjects, deadlines, priority, and notes
- Filter by Overview, Today, Upcoming, Completed, and subject
- Progress, due-today, and overdue statistics
- Weekly completed-task visualization
- Saves data in browser `localStorage`; no backend or account required

## Run locally
Open `index.html` in a modern browser. For a local development server, open this folder in VS Code and use the Live Server extension, or run `python -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Storage notes
Tasks are stored only in the current browser profile on the current device. They are not synced across devices. Clearing site data or browser storage may delete tasks. This app is a learning project, not a cloud-synced or backed-up task manager.

## AWS learning extension
The intended secure AWS architecture is a private S3 bucket using the S3 REST origin, CloudFront with HTTPS, and Origin Access Control (OAC). Do not use the S3 website endpoint as the final OAC origin. Check current AWS pricing/free-plan eligibility and account billing before creating resources.

## Free-hosting option
GitHub Pages can host static files from a public repository under GitHub Free. Review current GitHub Pages terms and limits before publishing. Do not store secrets or sensitive personal data in the repository or app.
