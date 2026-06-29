# Tech Decisions — VelvetPath

## PDF Rendering: Puppeteer (server-side)

**Decision: Puppeteer** — Express endpoint receives CV HTML + data, renders via headless Chrome, returns PDF. Angular preview renders the same HTML/CSS template directly, guaranteeing WYSIWYG.

| Approach | Pros | Cons |
|----------|------|------|
| **Puppeteer (server-side)** | Pixel-perfect PDF = same HTML/CSS rendered by Chromium; single source of truth for template; preview and PDF are identical | Requires headless Chrome on server; higher memory footprint |
| jsPDF + html2canvas (client-side) | No server deps; works offline | Double transformation (DOM→canvas→PDF) causes layout shifts; font embedding painful; preview and PDF often diverge |

## Image Upload: Multer (server-side)

**Decision: Multer** — Angular uploads cropped image to `POST /api/upload`, Express stores in `backend/uploads/`, returns path/URL. CV data JSON only holds the image URL.

| Approach | Pros | Cons |
|----------|------|------|
| **Multer (server-side upload)** | Clean separation; file validated server-side; scales to cloud storage later | Requires multipart form handling |
| Base64 in request body | Simple, no file upload endpoint | Bloats request JSON; no server-side validation; very large strings |

## Styling: SCSS

Angular's built-in SCSS support is used. No Tailwind — full control over typography and layout is needed for high-quality CV templates.
