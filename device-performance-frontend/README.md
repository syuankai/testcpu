# Device Performance Frontend

Frontend for a web application to collect device information and compare performance scores, deployed on Cloudflare Pages.

## Structure
- `index.html`: Main page with UI.
- `styles.css`: Styles for responsive design.
- `script.js`: Logic for device info collection, API calls, chart rendering, and polling updates.

## Setup
1. **Connect to Cloudflare Pages**:
- Link this repository to Cloudflare Pages.
- Set root directory to `/`.
- Deploy with no build command, output directory `/`.
2. **Update Worker URL**:
- Replace `https://your-worker-subdomain.workers.dev` in `script.js` with the deployed Worker URL.
3. **Testing**:
- Visit Pages URL (e.g., `https://device-performance-frontend.pages.dev`).
- Test device info collection, performance comparison, chart rendering, and polling updates.

## Notes
- Requires a deployed Cloudflare Worker (see `device-performance-backend` repository).
- Ensure Worker URL is updated in `script.js` before deployment.

