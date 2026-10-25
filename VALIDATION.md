# Validation

Chromium checks pass at 360, 390, 768, and 1440px viewport widths:
- No horizontal overflow; local images load successfully.
- All internal section links resolve.
- Research tabs work with mouse, Arrow keys, Home, and End, with correct ARIA selection and panel visibility.
- Native FAQ disclosures expand correctly.
- The proposal builder prepares an email and copies its text; tests use dummy data and do not send mail.
- Workshop sharing copies the expected event information.
- Credits, image manifest, institutional logo, and calendar are served successfully.
- Research content and direct organizer contact remain available without JavaScript.
- Reduced-motion layouts are supported; no JavaScript runtime errors.
- JavaScript syntax and git diff whitespace checks pass.

Run `python -m http.server 8034`, then `python verify_site.py` with Playwright installed to repeat checks and generate screenshots. Preview images are excluded from Git. GitHub Pages deployment has not been run because the local GitHub CLI is not authenticated.
