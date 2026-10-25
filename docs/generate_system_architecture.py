"""
Self-contained generator for docs/ATELIER_SYSTEM_ARCHITECTURE.html and docs/ATELIER_SYSTEM_ARCHITECTURE.pdf.
"""
import os
import subprocess
import pypdfium2 as pdfium

DOCS_DIR = os.path.abspath(r"c:\Sejal project\docs")
HTML_PATH = os.path.join(DOCS_DIR, "ATELIER_SYSTEM_ARCHITECTURE.html")
PDF_PATH = os.path.join(DOCS_DIR, "ATELIER_SYSTEM_ARCHITECTURE.pdf")
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

print("=" * 70)
print(" GENERATING ATELIER_SYSTEM_ARCHITECTURE.HTML & PDF")
print("=" * 70)

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ATELIER // PRESENCE — System Architecture &amp; Technology Breakdown</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --espresso:    #1C1310;
      --roast:       #3A2619;
      --mocha:       #6B4630;
      --caramel:     #B8772F;
      --latte:       #D2AE82;
      --crema:       #EBDCC2;
      --foam:        #F7F0E3;
      --pure-paper:  #FAF6EE;
      --card-bg:     #F4EDE2;
      --card-border: #D8C3AC;
      --accent-green:#3F624D;
      --accent-amber:#D28A3E;

      --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
      --font-sans:  'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono:  'JetBrains Mono', Consolas, 'Courier New', monospace;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    @page {
      size: A4 portrait; /* 210mm x 297mm */
      margin: 0;
    }

    @media print {
      html, body {
        width: 210mm;
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
        background-color: var(--foam);
      }
      .page {
        margin: 0 !important;
        box-shadow: none !important;
        page-break-after: always !important;
        break-after: page !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      .page:last-child {
        page-break-after: auto !important;
        break-after: auto !important;
      }
    }

    @media screen {
      body {
        background-color: #2D1E16;
        padding: 36px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
      }
      .page {
        box-shadow: 0 18px 48px rgba(0, 0, 0, 0.45);
      }
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      height: 297mm;
      max-height: 297mm;
      position: relative;
      box-sizing: border-box;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-after: always;
      break-after: page;
      overflow: hidden;
      background-color: var(--foam);
      color: var(--espresso);
      padding: 13mm 15mm 13mm 15mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-family: var(--font-sans);
      font-size: 8.4pt;
      line-height: 1.45;
    }

    /* Dark Cover Theme */
    .page.page-cover-dark {
      background-color: var(--espresso);
      color: var(--foam);
    }

    .content-wrap {
      position: relative;
      z-index: 2;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: calc(297mm - 26mm);
      overflow: hidden;
    }

    /* Running Header */
    .running-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 2mm;
      border-bottom: 1px solid var(--latte);
      margin-bottom: 3.5mm;
      font-family: var(--font-mono);
      font-size: 6.8pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--mocha);
    }
    .page-cover-dark .running-header {
      border-bottom-color: var(--roast);
      color: var(--latte);
    }
    .running-header .doc-id {
      color: var(--caramel);
      font-weight: 600;
    }

    /* Running Footer */
    .running-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 2mm;
      border-top: 1px solid var(--latte);
      margin-top: 2.5mm;
      font-family: var(--font-mono);
      font-size: 6.5pt;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--mocha);
    }
    .page-cover-dark .running-footer {
      border-top-color: var(--roast);
      color: var(--latte);
    }
    .running-footer .folio-pill {
      background-color: var(--crema);
      color: var(--espresso);
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 2px;
    }
    .page-cover-dark .running-footer .folio-pill {
      background-color: var(--roast);
      color: var(--foam);
      border: 1px solid var(--mocha);
    }

    /* Headings */
    h1, h2, h3, h4 {
      font-family: var(--font-serif);
      font-weight: 500;
      line-height: 1.15;
    }
    .serif-italic {
      font-style: italic;
      font-variation-settings: 'opsz' 144;
    }

    .page-title-block {
      margin-bottom: 3mm;
    }
    .page-num-label {
      font-family: var(--font-mono);
      font-size: 7.2pt;
      font-weight: 600;
      letter-spacing: 0.16em;
      color: var(--caramel);
      text-transform: uppercase;
      margin-bottom: 1.5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .page-num-label::before {
      content: "";
      display: inline-block;
      width: 12px;
      height: 1.5px;
      background-color: var(--caramel);
    }
    .page-heading {
      font-size: 16.5pt;
      letter-spacing: -0.02em;
      color: var(--espresso);
      margin-bottom: 2px;
    }
    .page-cover-dark .page-heading {
      color: var(--foam);
    }
    .page-subheading {
      font-size: 8.2pt;
      color: var(--mocha);
      font-weight: 400;
      line-height: 1.35;
    }
    .page-cover-dark .page-subheading {
      color: var(--latte);
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3.5mm;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 3mm;
    }

    /* Elevated Editorial Cards */
    .card {
      background-color: var(--pure-paper);
      border: 1px solid var(--card-border);
      border-radius: 3px;
      padding: 3mm 3.5mm;
    }
    .card-dark {
      background-color: #231713;
      color: var(--foam);
      border: 1px solid var(--roast);
      border-radius: 3px;
      padding: 3mm 3.5mm;
    }

    .card-title-mono {
      font-family: var(--font-mono);
      font-size: 7.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--roast);
      margin-bottom: 1.5mm;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .card-dark .card-title-mono {
      color: var(--caramel);
    }

    p {
      font-size: 7.8pt;
      line-height: 1.44;
      color: var(--roast);
    }
    .page-cover-dark p {
      color: var(--crema);
    }

    /* Infographic Figures */
    .figure-frame {
      background-color: var(--pure-paper);
      border: 1px solid var(--card-border);
      border-radius: 4px;
      padding: 3mm;
      margin: 2.5mm 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .figure-caption {
      font-family: var(--font-mono);
      font-size: 6.5pt;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--mocha);
      margin-top: 2mm;
      text-align: center;
      font-weight: 600;
    }

    /* Tables */
    table.clean-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-top: 1.5mm;
    }
    table.clean-table th {
      font-family: var(--font-mono);
      font-size: 6.6pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--espresso);
      background-color: var(--crema);
      border-top: 1px solid var(--latte);
      border-bottom: 1.5px solid var(--latte);
      padding: 2.5px 6px;
      text-align: left;
    }
    table.clean-table td {
      padding: 2.8px 6px;
      border-bottom: 1px solid rgba(210, 174, 130, 0.4);
      color: var(--espresso);
      vertical-align: middle;
    }
    table.clean-table tr:last-child td {
      border-bottom: 1px solid var(--latte);
    }
    table.clean-table tr:nth-child(even) td {
      background-color: rgba(235, 220, 194, 0.25);
    }

    /* Dark Table on Cover Page */
    table.dark-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7.2pt;
      margin-top: 1.5mm;
    }
    table.dark-table th {
      font-family: var(--font-mono);
      font-size: 6.6pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--caramel);
      background-color: #2F1E18;
      border-bottom: 1.5px solid var(--caramel);
      padding: 3px 6px;
      text-align: left;
    }
    table.dark-table td {
      padding: 3px 6px;
      border-bottom: 1px solid #3A2619;
      color: var(--foam);
      vertical-align: middle;
    }
    table.dark-table tr:last-child td {
      border-bottom: none;
    }
    table.dark-table tr:nth-child(even) td {
      background-color: rgba(58, 38, 25, 0.35);
    }

    /* Badges */
    .pill {
      display: inline-block;
      font-family: var(--font-mono);
      font-size: 6.2pt;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 1.5px 5px;
      border-radius: 2px;
      background: var(--crema);
      color: var(--espresso);
      border: 1px solid var(--latte);
    }
    .pill.caramel {
      background: rgba(184, 119, 47, 0.15);
      border-color: var(--caramel);
      color: var(--caramel);
      font-weight: 700;
    }
    .pill.green {
      background: rgba(63, 98, 77, 0.15);
      border-color: var(--accent-green);
      color: var(--accent-green);
      font-weight: 700;
    }
    .pill.amber {
      background: rgba(210, 138, 62, 0.15);
      border-color: var(--accent-amber);
      color: var(--accent-amber);
      font-weight: 700;
    }

    .callout-box {
      background: #F9F2E7;
      border-left: 3px solid var(--caramel);
      padding: 2.2mm 3.2mm;
      border-radius: 0 3px 3px 0;
      margin: 2mm 0;
    }
    .callout-box p {
      color: var(--espresso);
      font-size: 7.5pt;
    }
    .svg-diagram {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: EDITORIAL COVER (LUXURIOUS ESPRESSO & WARM CREMA) -->
  <div class="page page-cover-dark" id="arch-page-1">
    <div class="content-wrap" style="justify-content: space-between;">
      
      <div class="running-header">
        <span>ATELIER COMPUTATIONAL PAPERS // MONOGRAPH NO. 042-S</span>
        <span class="doc-id">SYSTEM ARCHITECTURE BREAKDOWN</span>
        <span>REVISION 2026.10</span>
      </div>

      <div style="border: 1px solid var(--roast); padding: 5mm; background: radial-gradient(circle at 50% 35%, #2A1A14 0%, #1C1310 80%); border-radius: 4px; position: relative;">
        <span style="position: absolute; top: -6px; left: -6px; font-family: var(--font-mono); font-size: 11px; color: var(--caramel);">+</span>
        <span style="position: absolute; top: -6px; right: -6px; font-family: var(--font-mono); font-size: 11px; color: var(--caramel);">+</span>
        <span style="position: absolute; bottom: -6px; left: -6px; font-family: var(--font-mono); font-size: 11px; color: var(--caramel);">+</span>
        <span style="position: absolute; bottom: -6px; right: -6px; font-family: var(--font-mono); font-size: 11px; color: var(--caramel);">+</span>

        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 2mm 0 3mm 0;">
          <svg width="76" height="76" viewBox="0 0 100 100" style="margin-bottom: 3mm;">
            <circle cx="50" cy="50" r="47" fill="none" stroke="#6B4630" stroke-width="0.8" stroke-dasharray="2 2" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#B8772F" stroke-width="1.2" />
            <circle cx="50" cy="50" r="34" fill="#251813" stroke="#D2AE82" stroke-width="0.8" />
            <line x1="50" y1="3" x2="50" y2="12" stroke="#B8772F" stroke-width="1.4" />
            <line x1="50" y1="88" x2="50" y2="97" stroke="#B8772F" stroke-width="1.4" />
            <line x1="3" y1="50" x2="12" y2="50" stroke="#B8772F" stroke-width="1.4" />
            <line x1="88" y1="50" x2="97" y2="50" stroke="#B8772F" stroke-width="1.4" />
            <polygon points="50,22 56,41 76,50 56,59 50,78 44,59 24,50 44,41" fill="none" stroke="#B8772F" stroke-width="1" />
            <polygon points="50,29 53,44 69,50 53,56 50,71 47,56 31,50 47,44" fill="#3A2619" stroke="#EBDCC2" stroke-width="0.8" />
            <circle cx="50" cy="50" r="3.5" fill="#FAF6EE" />
            <text x="50" y="47" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="4.2" fill="#B8772F" font-weight="700" letter-spacing="0.8">ATELIER</text>
            <text x="50" y="56" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="3.5" fill="#EBDCC2" letter-spacing="0.8">PRESENCE</text>
          </svg>

          <div style="font-family: var(--font-mono); font-size: 7.2pt; letter-spacing: 0.25em; text-transform: uppercase; color: var(--caramel); margin-bottom: 1.5mm;">
            ARCHITECTURAL SYSTEM MONOGRAPH // EDITION 2026.10
          </div>
          <h1 style="font-size: 32pt; letter-spacing: -0.025em; color: var(--foam); line-height: 1.05; margin-bottom: 2mm;">
            ATELIER <span class="serif-italic" style="color: var(--caramel); font-weight: 300;">//</span> PRESENCE
          </h1>
          <div style="font-family: var(--font-serif); font-size: 11pt; font-style: italic; color: var(--crema); max-width: 520px; line-height: 1.35; margin: 0 auto;">
            A Privacy-Preserving Multimodal Attendance &amp; Cognitive Telemetry Architecture for Creative Seminars and Hybrid Learning Spaces
          </div>
        </div>

        <div class="grid-2" style="margin-top: 3.5mm;">
          
          <div class="card-dark" style="border-left: 3px solid var(--caramel); background-color: #241713;">
            <div class="card-title-mono" style="color: var(--caramel); margin-bottom: 2mm;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--caramel);"></span>
              SYSTEM ARCHITECTURE SPECIFICATION
            </div>
            <table class="dark-table">
              <tr><td style="width: 36%; font-weight: 600; color: var(--crema);">Core Server</td><td>FastAPI Asynchronous Engine (Python 3.11 Runtime)</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Computer Vision</td><td>OpenCV Multi-Face Haar Cascades + Centroid Matcher</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Audio Intelligence</td><td>WebAudio 16kHz PCM + Librosa Speech Formant Filter</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Local Storage</td><td>SQLite 3.4x Write-Ahead Logging (WAL Mode, Concurrency)</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Pedagogical AI</td><td>Contextual Advisory Engine (Groq Llama 3.1 / Gemini Flash)</td></tr>
            </table>
          </div>

          <div class="card-dark" style="border-left: 3px solid var(--latte); background-color: #241713;">
            <div class="card-title-mono" style="color: var(--latte); margin-bottom: 2mm;">
              <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--latte);"></span>
              COMPUTATIONAL PRIVACY GUARANTEES
            </div>
            <table class="dark-table">
              <tr><td style="width: 36%; font-weight: 600; color: var(--crema);">Zero Photo Storage</td><td><strong style="color: #EBDCC2;">100% In-Memory RAM</strong> · No video or photos written to disk</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Anonymous Vectors</td><td>Participants tracked by dimensionless coordinate centers</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Verification Rule</td><td>10.0-Second Continuous Presence · Ignores Hallway Walk-Bys</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">API Throttling</td><td>10-Second Insight Cache protects LLM token quota</td></tr>
              <tr><td style="font-weight: 600; color: var(--crema);">Spreadsheet Export</td><td>Standard Excel-compatible CSV via Pandas DataFrame</td></tr>
            </table>
          </div>

        </div>

        <div style="display: flex; justify-content: center; gap: 8px; margin-top: 3.5mm; flex-wrap: wrap;">
          <span class="pill caramel">ZERO BIOMETRIC STORAGE</span>
          <span class="pill">IN-MEMORY CENTROID TRACKING (&lt;15MS)</span>
          <span class="pill">SQLITE WAL CONCURRENCY</span>
          <span class="pill">16-BAND AUDIO EQUALIZER</span>
          <span class="pill caramel">RATE-PROTECTED TEACHING AGENT</span>
        </div>
      </div>

      <div class="card-dark" style="border: 1px solid var(--roast); padding: 3mm 4mm; background-color: #211612; margin-top: 2.5mm;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--roast); padding-bottom: 1.5mm; margin-bottom: 2mm;">
          <span style="font-family: var(--font-mono); font-size: 6.8pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--caramel);">
            EXECUTIVE ARCHITECTURE ABSTRACT // PHILOSOPHY &amp; OBJECTIVES
          </span>
          <span style="font-family: var(--font-mono); font-size: 6.2pt; color: var(--latte);">
            REF: ARCH-2026-PRESENCE-V4
          </span>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; text-align: justify;">
          <p style="font-size: 7.2pt; line-height: 1.45; color: var(--foam);">
            <strong style="font-family: var(--font-serif); font-size: 13pt; line-height: 0.9; float: left; margin-right: 3px; color: var(--caramel);">C</strong>onventional
            attendance tools rely on coercive surveillance that invades student privacy, introduces brittle cloud latency, and hoards biometric liabilities on third-party servers. <em>Atelier // Presence</em> replaces invasive facial recognition with a non-invasive, mathematical telemetry companion inspired by the warmth of slow morning design ateliers.
          </p>
          <p style="font-size: 7.2pt; line-height: 1.45; color: var(--crema);">
            By measuring continuous presence through Euclidean center-of-mass tracking and human speech acoustics (300Hz–3400Hz), Atelier distinguishes genuine seminar immersion from fleeting doorway visitors. Video frames are decoded strictly in RAM and discarded instantly. Telemetry commits to a local SQLite database, providing educators with real-time insight while preserving 100% human dignity.
          </p>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>CONFIDENTIAL &amp; OPEN SYSTEM STANDARD</span>
        <span class="folio-pill">PAGE 01 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 2: SYSTEM TOPOLOGY & END-TO-END PIPELINE -->
  <div class="page" id="arch-page-2">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 01: SYSTEM TOPOLOGY &amp; SECURITY</span>
        <span>PAGE 02</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">PARADIGM &amp; SECURITY FOUNDATIONS</div>
        <h2 class="page-heading">01 / System Architecture &amp; Data Pipeline</h2>
        <div class="page-subheading">
          How video, audio, and state information flow seamlessly between the browser client, processing engines, and local database.
        </div>
      </div>

      <div class="grid-3" style="margin-bottom: 2.5mm;">
        <div class="card">
          <div class="card-title-mono" style="color: var(--caramel);">1. Zero Photo Retention</div>
          <p>Camera frames are decoded into temporary memory buffers and purged every 100ms. No photos, faces, or video files are ever saved to disk.</p>
        </div>
        <div class="card">
          <div class="card-title-mono" style="color: var(--caramel);">2. In-Memory Tracking</div>
          <p>Participants are identified solely as coordinate centers (X, Y) with an active timer. If an individual leaves, their coordinate record vanishes.</p>
        </div>
        <div class="card">
          <div class="card-title-mono" style="color: var(--caramel);">3. Local SQLite WAL</div>
          <p>Attendance records and engagement sessions persist locally in an air-gapped SQLite database using Write-Ahead Logging for zero lockups.</p>
        </div>
      </div>

      <!-- Human-Friendly Infographic: How Data Flows End-to-End -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 170" class="svg-diagram" style="max-height: 165px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="15" width="165" height="135" rx="4" fill="#FDFBF7" stroke="#D2AE82" stroke-width="1.2" />
          <rect x="200" y="15" width="165" height="135" rx="4" fill="#FDFBF7" stroke="#B8772F" stroke-width="1.5" />
          <rect x="390" y="15" width="170" height="135" rx="4" fill="#FDFBF7" stroke="#6B4630" stroke-width="1.2" />
          <rect x="585" y="15" width="165" height="135" rx="4" fill="#FDFBF7" stroke="#3A2619" stroke-width="1.5" />

          <rect x="10" y="15" width="165" height="24" rx="4" fill="#EBDCC2" />
          <text x="92" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#1C1310">STAGE 1: INPUT SENSORS</text>
          
          <rect x="200" y="15" width="165" height="24" rx="4" fill="#B8772F" />
          <text x="282" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">STAGE 2: WEBSOCKET BUS</text>

          <rect x="390" y="15" width="170" height="24" rx="4" fill="#6B4630" />
          <text x="475" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">STAGE 3: IN-MEMORY AI</text>

          <rect x="585" y="15" width="165" height="24" rx="4" fill="#3A2619" />
          <text x="667" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">STAGE 4: LEDGER &amp; DB</text>

          <text x="20" y="55" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Hardware Webcam (640×480)</text>
          <text x="28" y="68" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">30 FPS WebRTC canvas stream</text>
          
          <text x="20" y="90" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Microphone Audio Stream</text>
          <text x="28" y="103" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">WebAudio 16kHz PCM chunks</text>

          <text x="20" y="125" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Synthetic Simulation Mode</text>
          <text x="28" y="138" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Classroom testing without camera</text>

          <line x1="175" y1="82" x2="198" y2="82" stroke="#B8772F" stroke-width="2" />
          <polygon points="198,82 192,78 192,86" fill="#B8772F" />

          <text x="210" y="55" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Bi-Directional WebSocket</text>
          <text x="218" y="68" font-family="'JetBrains Mono', monospace" font-size="7.5" fill="#B8772F">ws://localhost:8000/ws/stream</text>
          
          <text x="210" y="90" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Ultra-Low Latency (&lt;18ms)</text>
          <text x="218" y="103" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Sends base64 frame &amp; audio samples</text>

          <text x="210" y="125" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Clean Mode Reset</text>
          <text x="218" y="138" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Purges avatars when camera turns on</text>

          <line x1="365" y1="82" x2="388" y2="82" stroke="#B8772F" stroke-width="2" />
          <polygon points="388,82 382,78 382,86" fill="#B8772F" />

          <text x="400" y="55" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Face Centroid Tracking</text>
          <text x="408" y="68" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">10s presence rule + 3s grace</text>
          
          <text x="400" y="90" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Librosa Speech Analysis</text>
          <text x="408" y="103" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">RMS dBFS + 16-band spectrum</text>

          <text x="400" y="125" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Multimodal Equilibrium</text>
          <text x="408" y="138" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Fused score + 4 dynamic trends</text>

          <line x1="560" y1="82" x2="583" y2="82" stroke="#B8772F" stroke-width="2" />
          <polygon points="583,82 577,78 577,86" fill="#B8772F" />

          <text x="595" y="55" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Verified Presence Ledger</text>
          <text x="603" y="68" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Auto-commits student arrival</text>
          
          <text x="595" y="90" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• SQLite WAL Concurrency</text>
          <text x="603" y="103" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Zero lockups during writes</text>

          <text x="595" y="125" font-family="'Instrument Sans', sans-serif" font-size="8" font-weight="700" fill="#1C1310">• Pandas CSV Export</text>
          <text x="603" y="138" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">1-click download of attendance data</text>
        </svg>
        <div class="figure-caption">FIGURE 1.1: END-TO-END DATAFLOW — FROM HARDWARE SENSORS TO IN-MEMORY ANALYTICS &amp; SQLITE PERSISTENCE</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">Ephemeral RAM Frame Decoding</div>
          <p>
            When a video frame arrives over the WebSocket, it is decoded into an in-memory NumPy array. OpenCV scans the frame for frontal faces and extracts bounding coordinates.
          </p>
          <div class="callout-box">
            <p><strong>Privacy Shield:</strong> The moment facial coordinates are recorded, the raw image frame is purged from RAM. No JPEG or MP4 files ever touch disk storage.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">SQLite Write-Ahead Logging (WAL)</div>
          <p>
            Traditional SQLite setups lock the entire database file during writes, creating freeze-ups during high-frequency telemetry. Atelier configures SQLite with WAL mode:
          </p>
          <div class="callout-box">
            <p style="font-family: var(--font-mono); font-size: 7pt; color: var(--caramel); font-weight: 700;">
              PRAGMA journal_mode = WAL;<br>
              PRAGMA synchronous = NORMAL;
            </p>
            <p style="margin-top: 1mm;">This allows continuous attendance logging while the UI reads analytics and exports CSV files with zero waiting.</p>
          </div>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 01: SYSTEM TOPOLOGY &amp; SECURITY</span>
        <span class="folio-pill">PAGE 02 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 3: COMPUTER VISION & THE 10-SECOND ATTENDANCE RULE -->
  <div class="page" id="arch-page-3">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 02: COMPUTER VISION &amp; CENTROID TRACKING</span>
        <span>PAGE 03</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">SPATIAL TELEMETRY &amp; PRESENCE VERIFICATION</div>
        <h2 class="page-heading">02 / Euclidean Centroid Tracking &amp; The 10s Rule</h2>
        <div class="page-subheading">
          How Atelier distinguishes actual seated participants from hallway walk-bys and brief doorway glance-overs.
        </div>
      </div>

      <!-- Human-Friendly Infographic: The 10-Second Attendance Journey -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 165" class="svg-diagram" style="max-height: 160px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="225" height="130" rx="4" fill="#FDFBF7" stroke="#D2AE82" stroke-width="1.2" />
          <rect x="15" y="15" width="225" height="26" rx="4" fill="#EBDCC2" />
          <text x="127" y="32" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#1C1310">STEP 1: DURATION &lt; 3.0 SECONDS</text>
          
          <circle cx="50" cy="65" r="14" fill="#6B4630" />
          <path d="M 32 95 Q 50 82 68 95 L 68 125 L 32 125 Z" fill="#6B4630" />
          <line x1="72" y1="65" x2="95" y2="65" stroke="#B8772F" stroke-width="1.5" stroke-dasharray="2 2" />
          <polygon points="95,65 89,61 89,69" fill="#B8772F" />

          <text x="105" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Corridor Walk-By</text>
          <text x="105" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Person walks through door</text>
          <rect x="105" y="82" width="115" height="18" rx="2" fill="#EAE0D4" stroke="#D2AE82" />
          <text x="162" y="94" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#6B4630">STATUS: TRANSIENT (&lt;3s)</text>
          <text x="105" y="115" font-family="'Instrument Sans', sans-serif" font-size="7.2" font-weight="600" fill="#9E5B26">Discarded • Not marked present</text>

          <line x1="242" y1="80" x2="268" y2="80" stroke="#B8772F" stroke-width="2" />
          <polygon points="268,80 260,76 260,84" fill="#B8772F" />

          <rect x="270" y="15" width="225" height="130" rx="4" fill="#FDFBF7" stroke="#D28A3E" stroke-width="1.5" />
          <rect x="270" y="15" width="225" height="26" rx="4" fill="#D28A3E" />
          <text x="382" y="32" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#FAF6EE">STEP 2: DURATION 3.0s – 9.9s</text>

          <circle cx="305" cy="65" r="14" fill="#B8772F" />
          <path d="M 287 95 Q 305 82 323 95 L 323 125 L 287 125 Z" fill="#B8772F" />
          <rect x="282" y="47" width="46" height="42" fill="none" stroke="#B8772F" stroke-width="1.5" stroke-dasharray="3 3" />

          <text x="340" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Student Takes Seat</text>
          <text x="340" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Organizing sketchbook &amp; tools</text>
          <rect x="340" y="82" width="135" height="18" rx="2" fill="rgba(210, 138, 62, 0.15)" stroke="#D28A3E" />
          <text x="407" y="94" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#D28A3E">STATUS: VERIFYING... (6.2s)</text>
          <text x="340" y="115" font-family="'Instrument Sans', sans-serif" font-size="7.2" font-weight="600" fill="#6B4630">Timer active • Awaiting 10.0s</text>

          <line x1="497" y1="80" x2="523" y2="80" stroke="#B8772F" stroke-width="2" />
          <polygon points="523,80 515,76 515,84" fill="#B8772F" />

          <rect x="525" y="15" width="220" height="130" rx="4" fill="#FDFBF7" stroke="#3F624D" stroke-width="1.8" />
          <rect x="525" y="15" width="220" height="26" rx="4" fill="#3F624D" />
          <text x="635" y="32" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="700" fill="#FAF6EE">STEP 3: DURATION &gt;= 10.0 SECONDS</text>

          <circle cx="560" cy="65" r="14" fill="#3F624D" />
          <path d="M 542 95 Q 560 82 578 95 L 578 125 L 542 125 Z" fill="#3F624D" />
          <path d="M 537 53 L 537 47 L 543 47" stroke="#B8772F" stroke-width="1.8" fill="none" />
          <path d="M 583 53 L 583 47 L 577 47" stroke="#B8772F" stroke-width="1.8" fill="none" />
          <path d="M 537 83 L 537 89 L 543 89" stroke="#B8772F" stroke-width="1.8" fill="none" />
          <path d="M 583 83 L 583 89 L 577 89" stroke="#B8772F" stroke-width="1.8" fill="none" />

          <text x="595" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Verified Present!</text>
          <text x="595" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#3F624D">Presence locked in</text>
          <rect x="595" y="82" width="135" height="18" rx="2" fill="rgba(63, 98, 77, 0.15)" stroke="#3F624D" />
          <text x="662" y="94" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#3F624D">✓ VERIFIED PRESENT (10.0s)</text>
          <text x="595" y="115" font-family="'Instrument Sans', sans-serif" font-size="7.2" font-weight="700" fill="#1C1310">Auto-Committed to SQLite!</text>
        </svg>
        <div class="figure-caption">FIGURE 2.1: THE 3-STEP ATTENDANCE VERIFICATION PIPELINE — ELIMINATES FALSE ATTENDANCE FROM PASSING VISITORS</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">How Centroid Matching Works</div>
          <p>
            Rather than scanning biometric facial identity, Atelier calculates the center point of detected face boxes:
          </p>
          <div class="callout-box">
            <p style="font-family: var(--font-mono); font-size: 7.2pt; color: var(--espresso); font-weight: 600;">
              Center_X = Box_Left + (Box_Width / 2)<br>
              Center_Y = Box_Top + (Box_Height / 2)
            </p>
          </div>
          <p>
            Between video frames, it matches previous centers to new centers using straightforward 2D distance. If a point moves by a small natural amount, it continues the same participant's record without confusion.
          </p>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">The 3.0-Second Occlusion Grace Period</div>
          <p>
            In a real classroom, students frequently turn to talk to neighbors, sip coffee, or bend down to sketch notes. Traditional trackers lose the student immediately and restart their timer from zero.
          </p>
          <div class="callout-box">
            <p><strong>3.0-Second Buffer:</strong> If a student's face temporarily turns or gets blocked, Atelier preserves their active timer in memory. Only if they remain unobserved for more than 3.0 seconds does the track deregister.</p>
          </div>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 02: COMPUTER VISION &amp; CENTROID TRACKING</span>
        <span class="folio-pill">PAGE 03 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 4: HEAD-POSE ATTENTION & OPTICAL INACTIVITY ENGINE -->
  <div class="page" id="arch-page-4">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 03: HEAD-POSE &amp; OPTICAL MOVEMENT</span>
        <span>PAGE 04</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">COGNITIVE ENGAGEMENT GAUGES</div>
        <h2 class="page-heading">03 / Head-Pose Attention &amp; Inactivity Engine</h2>
        <div class="page-subheading">
          Measuring attentive focus while protecting students in deep creative flow state from false inactivity penalties.
        </div>
      </div>

      <!-- Human-Friendly Infographic: Head Pose & Flow State Protection -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 160" class="svg-diagram" style="max-height: 155px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="225" height="125" rx="4" fill="#FDFBF7" stroke="#3F624D" stroke-width="1.5" />
          <rect x="15" y="15" width="225" height="24" rx="4" fill="#3F624D" />
          <text x="127" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">SCENARIO A: DIRECT FOCUS</text>
          
          <circle cx="60" cy="75" r="22" fill="#EBDCC2" stroke="#6B4630" stroke-width="1.2" />
          <circle cx="52" cy="72" r="3" fill="#1C1310" />
          <circle cx="68" cy="72" r="3" fill="#1C1310" />
          <line x1="60" y1="75" x2="60" y2="83" stroke="#6B4630" stroke-width="1.5" />
          <path d="M 53 88 Q 60 92 67 88" stroke="#6B4630" stroke-width="1.2" fill="none" />

          <text x="100" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Facing Presentation</text>
          <text x="100" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Yaw: 0° to 15° (Frontal)</text>
          <text x="100" y="90" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#3F624D">100% ATTENTION</text>
          <text x="100" y="105" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">High visual equilibrium</text>

          <rect x="265" y="15" width="230" height="125" rx="4" fill="#FDFBF7" stroke="#B8772F" stroke-width="1.5" />
          <rect x="265" y="15" width="230" height="24" rx="4" fill="#B8772F" />
          <text x="380" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">SCENARIO B: NOTE-TAKING (FLOW)</text>
          
          <circle cx="310" cy="75" r="22" fill="#EBDCC2" stroke="#6B4630" stroke-width="1.2" />
          <ellipse cx="304" cy="77" rx="3" ry="1.5" fill="#1C1310" />
          <ellipse cx="316" cy="77" rx="3" ry="1.5" fill="#1C1310" />
          <line x1="310" y1="76" x2="310" y2="83" stroke="#6B4630" stroke-width="1.5" />
          <rect x="296" y="93" width="28" height="15" fill="#FAF6EE" stroke="#B8772F" stroke-width="1" rx="1" />
          <line x1="299" y1="97" x2="321" y2="97" stroke="#B8772F" stroke-width="0.8" />
          <line x1="299" y1="102" x2="318" y2="102" stroke="#B8772F" stroke-width="0.8" />

          <text x="350" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Sketching / Writing</text>
          <text x="350" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Pitch: Downward (-25°)</text>
          <text x="350" y="90" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#B8772F">78% FOCUS SCORE</text>
          <text x="350" y="105" font-family="'Instrument Sans', sans-serif" font-size="7" font-weight="700" fill="#3F624D">✓ FLOW STATE PROTECTED</text>
          <text x="350" y="117" font-family="'Instrument Sans', sans-serif" font-size="6.8" fill="#6B4630">Stillness NOT penalized!</text>

          <rect x="520" y="15" width="225" height="125" rx="4" fill="#FDFBF7" stroke="#D28A3E" stroke-width="1.5" />
          <rect x="520" y="15" width="225" height="24" rx="4" fill="#D28A3E" />
          <text x="632" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">SCENARIO C: TURNED AWAY</text>
          
          <circle cx="565" cy="75" r="22" fill="#EBDCC2" stroke="#6B4630" stroke-width="1.2" />
          <circle cx="578" cy="73" r="3" fill="#1C1310" />
          <path d="M 586 75 L 591 79 L 586 82" stroke="#6B4630" stroke-width="1.2" fill="none" />

          <text x="605" y="58" font-family="'Instrument Sans', sans-serif" font-size="9" font-weight="700" fill="#1C1310">Looking Out Window</text>
          <text x="605" y="72" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Yaw: &gt; 45° Side angle</text>
          <text x="605" y="90" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700" fill="#D28A3E">25% ATTENTION</text>
          <text x="605" y="105" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Gradual attention decay</text>
          <text x="605" y="117" font-family="'Instrument Sans', sans-serif" font-size="6.8" fill="#D28A3E">Flags potential fatigue</text>
        </svg>
        <div class="figure-caption">FIGURE 3.1: HEAD POSE ESTIMATION &amp; FLOW STATE PROTECTION — ATTENTIVE SKETCHING IS RECOGNIZED AND HONORED</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">Optical Motion Differencing</div>
          <p>
            To detect physical fatigue or engagement, Atelier compares consecutive video frames inside each face box. By subtracting the previous frame from the current frame:
          </p>
          <div class="callout-box">
            <p><strong>Motion Energy:</strong> Normal human movement (nodding, writing, gesturing) produces healthy optical energy (0.15 to 0.65). If a participant remains completely motionless like a mannequin for more than 8 seconds, the engine flags potential disengagement.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">The Flow State Exemption Rule</div>
          <p>
            Naive engagement software penalizes stillness as boredom. However, the deepest human concentration occurs when a student sits quietly while sketching or reading.
          </p>
          <div class="callout-box">
            <p><strong>Flow State Exemption:</strong> If a student's visual attention score is &gt;= 65.0%, stillness is recognized as contemplative focus. The inactivity penalty is automatically dropped to <strong>0.0 points</strong>, preventing false disengagement warnings.</p>
          </div>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 03: HEAD-POSE &amp; OPTICAL MOVEMENT</span>
        <span class="folio-pill">PAGE 04 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 5: ACOUSTIC SIGNAL PROCESSING & 16-BAND SPECTRUM EQUALIZER -->
  <div class="page" id="arch-page-5">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 04: ACOUSTIC SIGNAL PROCESSING</span>
        <span>PAGE 05</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">AUDIO INTELLIGENCE &amp; SPEECH RECOGNITION</div>
        <h2 class="page-heading">04 / Acoustic DSP &amp; 16-Band Spectral Analysis</h2>
        <div class="page-subheading">
          Analyzing classroom vocal energy and discussion cadence without recording, transcribing, or storing private conversations.
        </div>
      </div>

      <!-- Human-Friendly Infographic: How Audio is Processed & Visualized -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 160" class="svg-diagram" style="max-height: 155px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="225" height="130" rx="4" fill="#FDFBF7" stroke="#3A2619" stroke-width="1.2" />
          <rect x="15" y="15" width="225" height="24" rx="4" fill="#3A2619" />
          <text x="127" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">ACOUSTIC PRIVACY PRINCIPLE</text>
          
          <text x="25" y="55" font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1C1310">Zero Audio Recording</text>
          <text x="25" y="68" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">No microphones save audio files or voice notes.</text>

          <text x="25" y="88" font-family="'Instrument Sans', sans-serif" font-size="8.5" font-weight="700" fill="#1C1310">Mathematical Extraction Only</text>
          <text x="25" y="101" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Computes 2 numbers: Decibels &amp; Frequency.</text>

          <rect x="25" y="112" width="205" height="22" fill="#FAF6EE" stroke="#B8772F" stroke-width="1" rx="2" />
          <text x="127" y="126" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#B8772F">HUMAN SPEECH BAND: 300Hz – 3400Hz</text>

          <rect x="260" y="15" width="485" height="130" rx="4" fill="#1C1310" stroke="#6B4630" stroke-width="1.5" />
          <rect x="260" y="15" width="485" height="24" rx="4" fill="#291A14" />
          <text x="502" y="31" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#B8772F">16-BAND ANALOG SPECTRUM EQUALIZER (LIVE TELEMETRY DESK)</text>

          <rect x="285" y="105" width="16" height="20" fill="#6B4630" rx="1" />
          <rect x="310" y="95" width="16" height="30" fill="#6B4630" rx="1" />
          <rect x="335" y="85" width="16" height="40" fill="#B8772F" rx="1" />

          <rect x="360" y="60" width="16" height="65" fill="#B8772F" rx="1" />
          <rect x="385" y="45" width="16" height="80" fill="#EBDCC2" rx="1" />
          <rect x="410" y="50" width="16" height="75" fill="#EBDCC2" rx="1" />
          <rect x="435" y="40" width="16" height="85" fill="#FAF6EE" rx="1" />
          <rect x="460" y="48" width="16" height="77" fill="#EBDCC2" rx="1" />
          <rect x="485" y="58" width="16" height="67" fill="#B8772F" rx="1" />
          <rect x="510" y="70" width="16" height="55" fill="#B8772F" rx="1" />

          <rect x="535" y="85" width="16" height="40" fill="#6B4630" rx="1" />
          <rect x="560" y="95" width="16" height="30" fill="#6B4630" rx="1" />
          <rect x="585" y="102" width="16" height="23" fill="#6B4630" rx="1" />
          <rect x="610" y="108" width="16" height="17" fill="#6B4630" rx="1" />
          <rect x="635" y="112" width="16" height="13" fill="#6B4630" rx="1" />
          <rect x="660" y="115" width="16" height="10" fill="#6B4630" rx="1" />

          <text x="322" y="138" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6.5" fill="#D2AE82">BASS</text>
          <text x="460" y="138" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#FAF6EE">VOCAL REGION (SPEECH)</text>
          <text x="610" y="138" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="6.5" fill="#D2AE82">TREBLE</text>
        </svg>
        <div class="figure-caption">FIGURE 4.1: REAL-TIME 16-BAND SPECTRUM EQUALIZER — DETECTS ACTIVE PARTICIPATION WITHIN HUMAN SPEECH FREQUENCIES</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">Decibel Level &amp; Voice Activity Detection (VAD)</div>
          <p>
            Incoming microphone audio is analyzed using Root-Mean-Square (RMS) math to calculate real decibels relative to full scale (dBFS):
          </p>
          <div class="callout-box">
            <p><strong>Vocal Threshold (-32 dBFS):</strong> Normal quiet background noise sits between -45 dBFS and -55 dBFS. When a student speaks, energy climbs to between -15 dBFS and -28 dBFS, triggering active participation mode.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">Spectral Centroid &amp; Human Speech Band</div>
          <p>
            Shuffling paper or typing on a keyboard creates high-frequency clicks. To avoid counting typing as talking, Atelier uses Librosa Spectral Centroid analysis:
          </p>
          <div class="callout-box">
            <p><strong>Formant Filter (300Hz – 3400Hz):</strong> Audio is flagged as genuine speech only if the spectral energy center sits cleanly within human voice formant bands, ensuring zero false speech triggers.</p>
          </div>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 04: ACOUSTIC SIGNAL PROCESSING</span>
        <span class="folio-pill">PAGE 05 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 6: MULTIMODAL EQUILIBRIUM & PEDAGOGICAL AI -->
  <div class="page" id="arch-page-6">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 05: MULTIMODAL FUSION &amp; AI AGENT</span>
        <span>PAGE 06</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">COGNITIVE EQUILIBRIUM FUSION</div>
        <h2 class="page-heading">05 / Multimodal Equilibrium &amp; Pedagogical AI</h2>
        <div class="page-subheading">
          Fusing visual, acoustic, and movement vectors into a single balanced index, paired with context-aware teacher advisory.
        </div>
      </div>

      <!-- Human-Friendly Infographic: The Cognitive Equilibrium Formula -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 160" class="svg-diagram" style="max-height: 155px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="25" width="145" height="105" rx="3" fill="#FDFBF7" stroke="#B8772F" stroke-width="1.2" />
          <rect x="15" y="25" width="145" height="22" rx="3" fill="#B8772F" />
          <text x="87" y="39" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#FAF6EE">VISUAL ATTENTION</text>
          <text x="87" y="70" text-anchor="middle" font-family="'Fraunces', serif" font-size="20" font-weight="600" fill="#1C1310">45%</text>
          <text x="87" y="88" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Head pose &amp; gaze focus</text>
          <text x="87" y="100" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#9E5B26">Flow state protected</text>

          <text x="175" y="82" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="#B8772F">+</text>

          <rect x="190" y="25" width="145" height="105" rx="3" fill="#FDFBF7" stroke="#6B4630" stroke-width="1.2" />
          <rect x="190" y="25" width="145" height="22" rx="3" fill="#6B4630" />
          <text x="262" y="39" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#FAF6EE">MOVEMENT ENERGY</text>
          <text x="262" y="70" text-anchor="middle" font-family="'Fraunces', serif" font-size="20" font-weight="600" fill="#1C1310">35%</text>
          <text x="262" y="88" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Optical note-taking</text>
          <text x="262" y="100" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">&gt;8s stillness penalty</text>

          <text x="350" y="82" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="#B8772F">+</text>

          <rect x="365" y="25" width="145" height="105" rx="3" fill="#FDFBF7" stroke="#D2AE82" stroke-width="1.2" />
          <rect x="365" y="25" width="145" height="22" rx="3" fill="#D2AE82" />
          <text x="437" y="39" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#1C1310">AUDIO ENERGY</text>
          <text x="437" y="70" text-anchor="middle" font-family="'Fraunces', serif" font-size="20" font-weight="600" fill="#1C1310">20%</text>
          <text x="437" y="88" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7.5" fill="#6B4630">Vocal discussion dBFS</text>
          <text x="437" y="100" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#6B4630">Human speech formant</text>

          <text x="525" y="82" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="18" font-weight="700" fill="#B8772F">=</text>

          <rect x="540" y="18" width="205" height="120" rx="4" fill="#241713" stroke="#B8772F" stroke-width="1.8" />
          <rect x="540" y="18" width="205" height="24" rx="4" fill="#B8772F" />
          <text x="642" y="34" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8" font-weight="700" fill="#FAF6EE">FUSED EQUILIBRIUM INDEX</text>
          
          <text x="642" y="75" text-anchor="middle" font-family="'Fraunces', serif" font-size="28" font-weight="700" fill="#FAF6EE">84.2<tspan font-size="14" fill="#EBDCC2">/100</tspan></text>
          
          <rect x="560" y="88" width="165" height="18" rx="2" fill="rgba(63, 98, 77, 0.3)" stroke="#3F624D" />
          <text x="642" y="100" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#EBDCC2">TREND: STEADY CLASSROOM RHYTHM</text>
          
          <text x="642" y="125" text-anchor="middle" font-family="'Instrument Sans', sans-serif" font-size="7" fill="#D2AE82">Smoothed with Exponential Moving Average (α=0.25)</text>
        </svg>
        <div class="figure-caption">FIGURE 5.1: MULTIMODAL COGNITIVE EQUILIBRIUM FORMULA — BALANCES VISION, MOVEMENT, AND ACOUSTIC ENERGY</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">The 4 Dynamic Classroom Trends</div>
          <table class="clean-table">
            <tr>
              <th style="width: 32%;">Trend Mode</th>
              <th style="width: 25%;">Score Range</th>
              <th>Classroom Behavior</th>
            </tr>
            <tr>
              <td><span class="pill caramel">Interactive Peak</span></td>
              <td><strong>&gt; 85 / 100</strong></td>
              <td>Lively participatory debate, active speech, and high movement.</td>
            </tr>
            <tr>
              <td><span class="pill green">Steady Rhythm</span></td>
              <td><strong>65 – 85 / 100</strong></td>
              <td>Harmonious lecture focus, note-taking, and attentive listening.</td>
            </tr>
            <tr>
              <td><span class="pill">Reflective Silence</span></td>
              <td><strong>60 – 80 / 100</strong></td>
              <td>Quiet sketching, low noise, protected flow state.</td>
            </tr>
            <tr>
              <td><span class="pill amber">Attention Drop</span></td>
              <td><strong>&lt; 60 / 100</strong></td>
              <td>Gaze turned away, downward fatigue; triggers break suggestion.</td>
            </tr>
          </table>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">The Context-Aware AI Teaching Agent</div>
          <p>
            Atelier pairs the telemetry feed with a pedagogical advisor powered by Gemini 2.5 Flash, Groq Llama 3.1, or a local 6-state heuristic engine:
          </p>
          <div class="callout-box">
            <p><strong>10-Second Rate Throttling:</strong> To prevent API rate limits, the AI is invoked only when classroom rhythm changes OR at least 10 seconds have elapsed. Cached suggestions display seamlessly in the meantime.</p>
          </div>
          <p>
            When attention drops, the agent gently recommends: <em>"Introduce a 3-minute peer sketch review to re-energize the room."</em>
          </p>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 05: MULTIMODAL FUSION &amp; AI AGENT</span>
        <span class="folio-pill">PAGE 06 OF 07</span>
      </div>

    </div>
  </div>

  <!-- PAGE 7: DATA PERSISTENCE, EXPORT & DEPLOYMENT ARCHITECTURE -->
  <div class="page" id="arch-page-7">
    <div class="content-wrap">
      
      <div class="running-header">
        <span>ATELIER // PRESENCE · ARCHITECTURAL SPECIFICATION</span>
        <span class="doc-id">SECTION 06: DATA ENGINEERING &amp; DEPLOYMENT</span>
        <span>PAGE 07</span>
      </div>

      <div class="page-title-block">
        <div class="page-num-label">DATA ENGINEERING &amp; PRODUCTION READINESS</div>
        <h2 class="page-heading">06 / SQLite WAL Schema, CSV Export &amp; Deployment</h2>
        <div class="page-subheading">
          Relational data structures, one-click spreadsheet download, and full production containerization.
        </div>
      </div>

      <!-- Human-Friendly Infographic: SQLite WAL Database Schema -->
      <div class="figure-frame">
        <svg viewBox="0 0 760 155" class="svg-diagram" style="max-height: 150px;" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="15" y="15" width="225" height="125" rx="3" fill="#FDFBF7" stroke="#3A2619" stroke-width="1.2" />
          <rect x="15" y="15" width="225" height="22" rx="3" fill="#3A2619" />
          <text x="127" y="30" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#FAF6EE">TABLE: ATTENDANCE_LOGS</text>
          <text x="25" y="52" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">id:</tspan> Integer PRIMARY KEY</text>
          <text x="25" y="66" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">session_id:</tspan> String (Session Key)</text>
          <text x="25" y="80" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">participant_id:</tspan> String (e.g. Elena Rostova)</text>
          <text x="25" y="94" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">first_seen / last_seen:</tspan> DateTime (UTC)</text>
          <text x="25" y="108" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">sustained_seconds:</tspan> Float (e.g. 10.4s)</text>
          <text x="25" y="122" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#3F624D">status: 'Verified Present'</text>

          <rect x="265" y="15" width="230" height="125" rx="3" fill="#FDFBF7" stroke="#6B4630" stroke-width="1.2" />
          <rect x="265" y="15" width="230" height="22" rx="3" fill="#6B4630" />
          <text x="380" y="30" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#FAF6EE">TABLE: ENGAGEMENT_SESSIONS</text>
          <text x="275" y="52" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">id:</tspan> Integer PRIMARY KEY</text>
          <text x="275" y="66" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">timestamp:</tspan> DateTime (UTC sample)</text>
          <text x="275" y="80" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">fused_score:</tspan> Float (0.0 to 100.0)</text>
          <text x="275" y="94" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">visual_attention / acoustic:</tspan> Float</text>
          <text x="275" y="108" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">active_face_count:</tspan> Integer</text>
          <text x="275" y="122" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#B8772F">trend: 'Steady Rhythm' | 'Peak'</text>

          <rect x="520" y="15" width="225" height="125" rx="3" fill="#FDFBF7" stroke="#B8772F" stroke-width="1.5" />
          <rect x="520" y="15" width="225" height="22" rx="3" fill="#B8772F" />
          <text x="632" y="30" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="700" fill="#FAF6EE">TABLE: AI_INSIGHTS</text>
          <text x="530" y="52" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">id:</tspan> Integer PRIMARY KEY</text>
          <text x="530" y="66" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">timestamp:</tspan> DateTime (UTC)</text>
          <text x="530" y="80" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">suggestion_text:</tspan> Text (Pedagogical advice)</text>
          <text x="530" y="94" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">pacing_action:</tspan> Text (e.g. Socratic pause)</text>
          <text x="530" y="108" font-family="'JetBrains Mono', monospace" font-size="7" fill="#1C1310"><tspan fill="#B8772F">provider:</tspan> 'Gemini' | 'Groq' | 'Offline'</text>
          <text x="530" y="122" font-family="'JetBrains Mono', monospace" font-size="7" font-weight="700" fill="#6B4630">engagement_context: String</text>
        </svg>
        <div class="figure-caption">FIGURE 6.1: RELATIONAL SQLITE SCHEMA — OPTIMIZED FOR CONCURRENT REAL-TIME APPENDS &amp; INSTANT CSV EXPORT</div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">1-Click Streaming CSV Export</div>
          <p>
            Educators can download live attendance records at any moment by clicking <strong>[Export Attendance as CSV]</strong> on the dashboard.
          </p>
          <div class="callout-box">
            <p><strong>Pandas DataFrame Streaming:</strong> The endpoint <code style="font-family: var(--font-mono); color: var(--caramel);">/api/export/csv</code> streams standard RFC 4180 CSV with participant names, first-seen timestamps, sustained seconds, and verification status ready for Excel.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-title-mono" style="color: var(--espresso);">Production Deployment Options</div>
          <p>
            The entire platform runs anywhere with zero cloud lock-in:
          </p>
          <table class="clean-table" style="margin-top: 1.5mm;">
            <tr>
              <th style="width: 32%;">Target</th>
              <th>Execution Command</th>
            </tr>
            <tr>
              <td><strong>Windows 1-Click</strong></td>
              <td><code style="font-family: var(--font-mono); font-size: 6.8pt; color: var(--caramel);">run_app.bat</code></td>
            </tr>
            <tr>
              <td><strong>macOS / Linux</strong></td>
              <td><code style="font-family: var(--font-mono); font-size: 6.8pt; color: var(--caramel);">./run_app.sh</code></td>
            </tr>
            <tr>
              <td><strong>Docker Container</strong></td>
              <td><code style="font-family: var(--font-mono); font-size: 6.8pt; color: var(--caramel);">docker compose up --build</code></td>
            </tr>
            <tr>
              <td><strong>Cloud / VM</strong></td>
              <td>FastAPI serves Vite static bundle on port 8000</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="running-footer">
        <span>ATELIER ARCHITECTURAL PAPERS // MONOGRAPH 042-S</span>
        <span>SECTION 06: DATA ENGINEERING &amp; DEPLOYMENT</span>
        <span class="folio-pill">PAGE 07 OF 07</span>
      </div>

    </div>
  </div>

</body>
</html>
"""

with open(HTML_PATH, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML written to {HTML_PATH} ({len(html_content)} bytes)")

# Compile to PDF
cmd = [
    CHROME_PATH,
    "--headless=new",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    "--disable-gpu",
    "--enable-font-antialiasing",
    f"--print-to-pdf={PDF_PATH}",
    f"file:///{HTML_PATH.replace(os.sep, '/')}"
]
print("Compiling to PDF with Chrome...")
res = subprocess.run(cmd, capture_output=True)
print("Exit code:", res.returncode)

if os.path.exists(PDF_PATH):
    print("SUCCESS: PDF generated at:", PDF_PATH, "Size:", os.path.getsize(PDF_PATH), "bytes")
    doc = pdfium.PdfDocument(PDF_PATH)
    print("Detected PDF Pages:", len(doc))
    # Render page 1 preview
    page1 = doc[0].render(scale=1.5).to_pil()
    page1.save(os.path.join(DOCS_DIR, "arch_page1_fixed.png"))
    print("Saved arch_page1_fixed.png preview!")
else:
    print("ERROR: PDF was not generated.")
