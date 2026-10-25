# ATELIER // PRESENCE
## PDF Editorial Design System Specification
### "Slow Morning" Telemetry & Architectural Monograph Edition

> **Version:** 1.0.0-RELEASE  
> **Target Output:** A4 Print & Archival Vector PDF (210mm × 297mm)  
> **Print Engine:** Chromium / Google Chrome Headless (`--headless=new`)  
> **Typography:** Fraunces (Optical Serif), Instrument Sans (Grotesque Sans), JetBrains Mono (Technical Mono)  
> **Palette:** Espresso, Roast, Mocha, Caramel, Latte, Crema, Foam  

---

## 1. Editorial Vision & Design Philosophy

The **ATELIER // PRESENCE** PDF design language translates our live web telemetry interface into a physical architectural monograph and high-end publication (inspired by *Apartamento*, *Kinfolk*, and *Swiss Style Architectural Portfolios*). 

Unlike corporate reports that rely on sterile white cards and flat blue charts, this system treats every page as archival paper stock:
1. **Warm Analog Paper Stock:** Backgrounds avoid stark `#FFFFFF`, utilizing `#F7F0E3` (Foam) for daylight spreads and deep `#1C1310` (Espresso) for dramatic cover folios.
2. **Kinfolk Typographic Tension:** High-contrast pairing of *Fraunces* (warm, variable, optical serif with expressive curved italics) alongside *Instrument Sans* (meticulous, quiet humanist grotesque) and *JetBrains Mono* (hyper-precise CAD coordinates and telemetry timestamps).
3. **Drafting CAD Precision:** Fine hairline rules (0.5pt to 1pt), tactile dotted leaders, crop and registration crosshairs (`+`), archival verification stamps, and angled marginalia field notes (-1.2° to +1.8°).
4. **Vector Fidelity:** Headless Chromium rendering outputs 100% crisp, infinite-resolution vector text, embedded SVG schematics, and zero-loss geometry with exact paged media pagination.

---

## 2. Color Palette & Tokens

| Token Name | Hex Code | RGB | Role & Usage |
| :--- | :--- | :--- | :--- |
| **Espresso** | `#1C1310` | `28, 19, 16` | Primary dark surface, hero cover background, high-contrast headings on light pages. |
| **Roast** | `#3A2619` | `58, 38, 25` | Secondary dark surface, dark mode card fills, deep structural section bands. |
| **Mocha** | `#6B4630` | `107, 70, 48` | Muted structural borders, secondary body text, hairline dividers, dotted leaders. |
| **Caramel** | `#B8772F` | `184, 119, 47` | **Primary Active Accent**: live telemetry status, vector arrows, badges, key metric highlights. |
| **Latte** | `#D2AE82` | `210, 174, 130` | Warm mid-tone illustrations, diagram strokes, secondary accent rules, muted stamps. |
| **Crema** | `#EBDCC2` | `235, 220, 194` | Secondary light surface, table zebra shading, marginalia sticky cards, chip backgrounds. |
| **Foam** | `#F7F0E3` | `247, 240, 227` | **Primary Editorial Paper**: daytime page background, pristine archival paper tone. |
| **Pure Paper**| `#FAF6EE` | `250, 246, 238` | Card fill on light foam spreads to provide subtle tactile elevation without drop shadows. |

### CSS Color Custom Properties
```css
:root {
  --espresso: #1C1310;
  --roast:    #3A2619;
  --mocha:    #6B4630;
  --caramel:  #B8772F;
  --latte:    #D2AE82;
  --crema:    #EBDCC2;
  --foam:     #F7F0E3;
  --pure-paper: #FAF6EE;
  
  --font-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-sans:  'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:  'JetBrains Mono', Consolas, 'Courier New', monospace;
}
```

---

## 3. Chromium Headless PDF Engine Configuration

```bash
chrome.exe \
  --headless=new \
  --print-to-pdf="docs/ATELIER_PRESENCE_MONOGRAPH.pdf" \
  --no-pdf-header-footer \
  --run-all-compositor-stages-before-draw \
  --disable-gpu \
  --enable-font-antialiasing \
  "file:///c:/Sejal%20project/docs/monograph_template.html"
```

### Essential CSS Paged Media Reset
```css
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

  body {
    overflow: hidden;
  }
}

.page {
  width: 210mm;
  min-height: 297mm;
  height: 297mm;
  max-height: 297mm;
  padding: 18mm 20mm 18mm 20mm;
  position: relative;
  box-sizing: border-box;
  page-break-inside: avoid;
  break-inside: avoid;
  page-break-after: always;
  break-after: page;
  overflow: hidden;
  background-color: var(--foam);
  color: var(--espresso);
}

.page:first-of-type {
  break-before: avoid;
  page-break-before: avoid;
}

p, h1, h2, h3, h4, table, figure, .card, .component {
  break-inside: avoid;
  page-break-inside: avoid;
}

h1, h2, h3 {
  break-after: avoid;
  page-break-after: avoid;
}

p {
  orphans: 3;
  widows: 3;
}
```
