export function getBudgetPdfTemplate(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Verko · Presupuesto</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,200;1,300;1,400&family=Inter:wght@200;300;400;500;600&display=swap" rel="stylesheet">
<style>
/* ─── TOKENS ─────────────────────────────────────── */
:root{
  --ink:#07070a; --ink-2:#0f0e0c; --ink-3:#171510;
  --paper:#faf6ee; --paper-2:#f0ebe2; --paper-3:#e4dcd3;
  --gold:#b09060; --gold-2:#c9ab7a; --gold-soft:#d8c19a;
  --stone:#7a7268; --stone-2:#a09890;
  --line:#d8cebb; --line-soft:#e8dec9;
  --txt:#1a1814; --txt-2:#3a3530; --txt-3:#6a625a;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  font-family:'Inter',sans-serif;
  background:#22201c;
  color:var(--txt);
  -webkit-font-smoothing:antialiased;
  font-feature-settings:'ss01','ss02','cv11';
  font-weight:300;
}

/* ─── LAYOUT: A4 PAGES ──────────────────────────── */
.page{
  width:210mm; min-height:297mm;
  margin:24px auto;
  background:var(--paper);
  position:relative;
  overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.45),0 4px 20px rgba(0,0,0,.2);
}
.page.dark{background:var(--ink);color:var(--paper-2)}
.page-inner{padding:18mm 18mm}
.page.cover .page-inner{padding:0}

/* ─── COVER PAGE ────────────────────────────────── */
.cover{display:flex;flex-direction:column}
.cover-photo{
  position:absolute;inset:0;z-index:0;
  background: linear-gradient(135deg, #1a1710 0%, #0d0b08 60%, #1e1a13 100%);
  background-size:cover;background-position:center 35%;
  filter:brightness(.55) saturate(.9) contrast(1.05);
}
.cover-overlay{
  position:absolute;inset:0;z-index:1;
  background:
    linear-gradient(180deg,rgba(7,7,10,.55) 0%,rgba(7,7,10,.35) 35%,rgba(7,7,10,.95) 100%),
    linear-gradient(90deg,rgba(7,7,10,.65) 0%,rgba(7,7,10,.2) 50%,rgba(7,7,10,.55) 100%);
}
.cover-head{
  padding:14mm 14mm 0;
  display:flex;align-items:flex-start;justify-content:space-between;
  position:relative;z-index:3;
}
.cover-logo{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:28pt;color:var(--gold-2);letter-spacing:.15em;
}
.cover-meta-tl{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:9pt;color:var(--gold-2);letter-spacing:.18em;
  text-transform:uppercase;text-align:right;
}
.cover-meta-tl b{display:block;font-style:normal;font-family:'Inter',sans-serif;
  font-weight:400;color:var(--paper-2);letter-spacing:.22em;font-size:7.5pt;margin-bottom:2mm;opacity:.55}

.cover-body{
  flex:1;
  padding:0 14mm;
  display:flex;flex-direction:column;justify-content:center;
  position:relative;z-index:3;
  margin-top:14mm;
}
.cover-eyebrow{
  font-size:8pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold-2);font-weight:400;margin-bottom:8mm;
  display:flex;align-items:center;gap:8mm;
}
.cover-eyebrow::before{content:'';width:14mm;height:.5pt;background:var(--gold)}
.cover-title{
  font-family:'Cormorant Garamond',serif;font-weight:300;
  font-size:64pt;line-height:.95;letter-spacing:-.01em;
  color:var(--paper);margin-bottom:5mm;
}
.cover-title em{font-style:italic;font-weight:200;color:var(--gold-soft)}
.cover-sub{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:18pt;color:var(--paper-3);letter-spacing:.01em;
  max-width:135mm;line-height:1.35;
}

.cover-rule{height:.5pt;background:linear-gradient(to right,transparent,var(--gold) 20%,var(--gold) 80%,transparent);margin:14mm 0 10mm;opacity:.45}

.cover-grid{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:8mm 14mm;max-width:160mm;
}
.cv-cell{display:flex;flex-direction:column;gap:1.5mm}
.cv-cell .k{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--stone-2);font-weight:400;
}
.cv-cell .v{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:16pt;color:var(--paper);line-height:1.2;
}

.cover-foot{
  padding:0 14mm 12mm;
  display:flex;align-items:flex-end;justify-content:space-between;
  position:relative;z-index:3;
  margin-top:auto;padding-top:14mm;
}
.cover-statement{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:200;
  font-size:13pt;color:var(--paper-2);letter-spacing:.02em;line-height:1.4;
}
.cover-statement em{color:var(--gold-soft)}
.cover-no{
  text-align:right;
  font-size:7pt;letter-spacing:.28em;text-transform:uppercase;
  color:var(--stone-2);
}
.cover-no b{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;
  font-weight:300;font-size:14pt;color:var(--gold-2);letter-spacing:.05em;margin-top:1mm;text-transform:none}

.cover-bgmark{display:none}

/* ─── ABOUT / MANIFIESTO PAGE ──────────────────── */
.about-hero{
  position:relative;height:115mm;overflow:hidden;
  margin:-16mm -18mm 10mm;
}
.about-hero-bg{
  position:absolute;inset:0;
  background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%);
}
.about-hero::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 82%,rgba(250,246,238,.5) 93%,var(--paper) 100%);
}
.about-hero-mark{
  position:absolute;top:8mm;left:8mm;z-index:2;
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--paper);opacity:.85;
  display:flex;align-items:center;gap:6mm;
}
.about-hero-mark::before{content:'';width:10mm;height:.5pt;background:var(--gold-2)}

.about-body{padding:0 2mm}
.about-eyebrow{
  font-size:7.5pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:5mm;
  display:flex;align-items:center;gap:6mm;
}
.about-eyebrow::before{content:'';width:10mm;height:.5pt;background:var(--gold)}
.about-title{
  font-family:'Cormorant Garamond',serif;font-weight:300;
  font-size:32pt;line-height:1.05;color:var(--txt);
  margin-bottom:6mm;max-width:160mm;letter-spacing:-.005em;
}
.about-title em{font-style:italic;color:var(--gold)}
.about-text{
  font-size:9.5pt;line-height:1.7;color:var(--txt-2);
  max-width:160mm;font-weight:300;margin-bottom:4mm;
}
.about-pillars{
  display:grid;grid-template-columns:repeat(3,1fr);gap:8mm;
  margin-top:9mm;padding-top:7mm;border-top:.5pt solid var(--line-soft);
}
.pillar h4{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--gold);margin-bottom:3mm;line-height:1.2;
}
.pillar p{
  font-size:8.5pt;line-height:1.55;color:var(--txt-2);font-weight:300;
}

/* ─── PROCESO / PUNTOS PAGE ────────────────────── */
.process-hero{
  position:relative;height:75mm;overflow:hidden;
  margin:-16mm -18mm 9mm;
}
.process-hero-bg{
  position:absolute;inset:0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
}
.process-hero::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(180deg,transparent 45%,rgba(7,7,10,.35) 70%,rgba(7,7,10,.7) 100%);
}
.process-hero-text{
  position:absolute;left:18mm;bottom:8mm;right:18mm;z-index:2;
  display:flex;align-items:flex-end;justify-content:space-between;gap:10mm;
}
.process-hero-text .lab{
  font-size:7.5pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold-2);font-weight:500;
}
.process-hero-text .quote{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--paper);max-width:120mm;line-height:1.3;
  letter-spacing:.01em;
}

.terms-list{margin-top:4mm}
.term-item{
  display:flex;gap:8mm;padding:4mm 0;
  border-bottom:.5pt solid var(--line-soft);
  break-inside:avoid;
}
.term-item:first-child{border-top:.5pt solid var(--line-soft)}
.term-num{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--gold);min-width:12mm;letter-spacing:.04em;
  flex-shrink:0;padding-top:.2mm;
}
.term-content{flex:1}
.term-content h5{
  font-size:8pt;letter-spacing:.18em;text-transform:uppercase;
  color:var(--txt);font-weight:500;margin-bottom:1.5mm;line-height:1.3;
}
.term-content p{
  font-size:8.5pt;line-height:1.55;color:var(--txt-2);
  font-weight:300;max-width:160mm;
}

/* ─── EDITABLE SECTION MARKER ─────────────────── */
.editable-banner{
  display:flex;align-items:center;gap:10mm;
  margin:0 0 8mm;padding:5mm 6mm;
  background:rgba(176,144,96,.08);
  border-left:1pt solid var(--gold);
}
.editable-banner-l{flex:1}
.editable-banner-l .k{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:1.5mm;
}
.editable-banner-l .h{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:13pt;color:var(--txt);line-height:1.25;
}
.editable-banner-r{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:9pt;color:var(--txt-3);text-align:right;line-height:1.4;
  max-width:60mm;
}

.client-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:6mm 10mm;margin-top:6mm;padding:6mm 0;
  border-top:.5pt solid var(--line-soft);
  border-bottom:.5pt solid var(--line-soft);
}
.cg-cell .k{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:1.5mm;display:block;
}
.cg-cell .v{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--txt);line-height:1.2;
}

/* ─── BODY PAGE HEADER ──────────────────────────── */
.bp-head{
  display:flex;align-items:center;justify-content:space-between;
  padding-bottom:6mm;margin-bottom:10mm;
  border-bottom:.5pt solid var(--line);
}
.bp-head-l{display:flex;align-items:center;gap:6mm}
.bp-logo{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--txt);letter-spacing:.1em;
}
.bp-head-meta{
  font-size:6.5pt;letter-spacing:.28em;text-transform:uppercase;
  color:var(--txt-3);font-weight:400;line-height:1.5;
}
.bp-head-meta b{font-weight:500;color:var(--txt-2)}
.bp-head-r{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:11pt;color:var(--gold);letter-spacing:.04em;
}

/* ─── SECTION INTRO ─────────────────────────────── */
.section-intro{
  margin-bottom:9mm;padding-bottom:6mm;
  border-bottom:.5pt solid var(--line-soft);
}
.section-intro .lab{
  font-size:7.5pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:5mm;
  display:flex;align-items:center;gap:6mm;
}
.section-intro .lab::before{content:'';width:10mm;height:.5pt;background:var(--gold)}
.section-intro h2{
  font-family:'Cormorant Garamond',serif;font-weight:300;
  font-size:30pt;line-height:1.05;color:var(--txt);
  letter-spacing:-.005em;margin-bottom:5mm;max-width:155mm;
}
.section-intro h2 em{font-style:italic;font-weight:300;color:var(--gold)}
.section-intro p{
  font-size:9pt;line-height:1.7;color:var(--txt-2);
  max-width:140mm;font-weight:300;
}

/* ─── ITEM CARDS · ESTILO EDITORIAL ─────────────── */
.item{
  margin-bottom:10mm;padding-bottom:9mm;
  border-bottom:.5pt solid var(--line-soft);
  position:relative;
  break-inside:avoid;page-break-inside:avoid;
}
.item:last-child{border-bottom:none;margin-bottom:0}
.item-head{
  display:grid;grid-template-columns:42mm 1fr auto;
  gap:8mm;align-items:flex-start;margin-bottom:6mm;
}
.item-num{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:200;
  font-size:80pt;line-height:.85;color:var(--gold);letter-spacing:-.02em;
  padding-top:0;
}
.item-head-l{padding-top:9mm;min-width:0}
.item-title-eyebrow{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--txt-3);font-weight:500;margin-bottom:2.5mm;
}
.item-title{
  font-family:'Cormorant Garamond',serif;font-weight:300;
  font-size:24pt;line-height:1.05;color:var(--txt);
  letter-spacing:-.005em;
}
.item-title em{font-style:italic;color:var(--txt-2)}
.item-price{
  text-align:right;flex-shrink:0;padding-top:11mm;
}
.item-price-amt{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:24pt;color:var(--ink);letter-spacing:-.005em;line-height:1;
  white-space:nowrap;
}
.item-price-amt::before{content:'$';font-size:14pt;vertical-align:.4em;margin-right:1.2mm;color:var(--gold)}
.item-price-tag{
  font-size:6.5pt;letter-spacing:.28em;text-transform:uppercase;
  color:var(--stone);margin-top:1.2mm;
}
.item-desc{
  column-count:2;column-gap:8mm;
  margin-bottom:4mm;padding-left:50mm;
  list-style:none;
}
.item-desc li{
  list-style:none;
  font-size:8.5pt;line-height:1.5;color:var(--txt-2);
  padding-left:5mm;position:relative;font-weight:300;
  break-inside:avoid;page-break-inside:avoid;
  margin-bottom:1mm;
}
.item-desc li::before{
  content:'';position:absolute;left:0;top:.42em;
  width:2mm;height:.5pt;background:var(--gold);opacity:.7;
}
.item-note{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:8.5pt;color:var(--txt-3);letter-spacing:.01em;
  padding:0 0 0 50mm;margin-top:3mm;
}
.item-note::before{
  content:'— ';color:var(--gold);font-weight:400;
}

/* ─── SUMMARY PAGE ──────────────────────────────── */
.summary-grid{
  display:grid;grid-template-columns:1fr;
  gap:6mm;margin-top:0;
}
.summary-list{}
.sum-row{
  display:flex;align-items:baseline;justify-content:space-between;
  padding:3mm 0;border-bottom:.5pt solid var(--line-soft);gap:8mm;
}
.sum-row:first-child{border-top:.5pt solid var(--line)}
.sum-row .nm{
  font-family:'Inter',sans-serif;font-weight:400;
  font-size:9pt;color:var(--txt);letter-spacing:.06em;
  text-transform:uppercase;flex:1;min-width:0;
}
.sum-row .nm small{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-weight:300;font-size:9pt;color:var(--gold);
  text-transform:none;letter-spacing:.04em;margin-right:3mm;
}
.sum-row .vl{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:14pt;color:var(--ink);letter-spacing:-.005em;white-space:nowrap;
}
.sum-row .vl::before{content:'$';font-size:9pt;vertical-align:.35em;margin-right:.8mm;color:var(--gold)}

.grand-total{
  margin-top:4mm;padding:7mm 8mm;
  background:var(--ink);color:var(--paper-2);
  position:relative;overflow:hidden;
}
.grand-total::before{
  content:'';position:absolute;top:0;left:0;right:0;height:.5pt;
  background:linear-gradient(to right,transparent,var(--gold),transparent);
}
.gt-row{display:flex;align-items:baseline;justify-content:space-between;gap:8mm}
.gt-label{display:flex;flex-direction:column;gap:1.5mm}
.gt-label .k{
  font-size:7.5pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold-2);font-weight:500;
}
.gt-label .s{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:11pt;color:var(--paper-3);letter-spacing:.02em;
}
.gt-amt{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:36pt;line-height:1;color:var(--paper);letter-spacing:-.01em;
  white-space:nowrap;
}
.gt-amt::before{content:'$';font-size:20pt;vertical-align:.45em;margin-right:1.5mm;color:var(--gold-2)}
.gt-iva{
  margin-top:3.5mm;padding-top:3mm;border-top:.5pt solid rgba(176,144,96,.25);
  display:flex;justify-content:space-between;align-items:baseline;
  font-size:7.5pt;letter-spacing:.28em;text-transform:uppercase;color:var(--gold-soft);
}

.conditions{
  margin-top:6mm;padding:5mm 0 0;
  border-top:.5pt solid var(--line);
}
.conditions h3{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:3mm;
}
.conditions p{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:10pt;line-height:1.55;color:var(--txt-2);
  letter-spacing:.005em;max-width:165mm;
}

/* ─── CLOSING PAGE ──────────────────────────────── */
.closing{
  display:flex;flex-direction:column;flex:1;
}
.closing-head{flex:1;display:flex;flex-direction:column;justify-content:center;gap:8mm}
.closing-statement{
  font-family:'Cormorant Garamond',serif;font-weight:200;font-style:italic;
  font-size:26pt;line-height:1.22;letter-spacing:-.005em;
  color:var(--txt);max-width:170mm;margin:6mm 0;
}
.closing-statement em{color:var(--gold);font-weight:300}
.closing-statement b{font-weight:300;font-style:normal;color:var(--ink)}

.sign-area{
  display:grid;grid-template-columns:1fr 1fr;gap:12mm;margin-top:8mm;
}
.sign-box{padding-top:10mm;border-top:.5pt solid var(--txt-3);position:relative}
.sign-box::before{
  content:'';position:absolute;top:-.5pt;left:0;width:14mm;height:.5pt;background:var(--gold);
}
.sign-box .k{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--txt-3);font-weight:500;margin-bottom:1.5mm;
}
.sign-box .v{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:13pt;color:var(--txt-2);
}

.cta-band{
  margin-top:8mm;padding:6mm 7mm;
  background:var(--paper-3);
  display:flex;align-items:center;justify-content:space-between;gap:8mm;
}
.cta-l .k{
  font-size:7pt;letter-spacing:.32em;text-transform:uppercase;
  color:var(--gold);font-weight:500;margin-bottom:2mm;
}
.cta-l .h{
  font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:300;
  font-size:18pt;color:var(--ink);line-height:1.2;
}
.cta-r{
  font-family:'Inter',sans-serif;font-weight:400;
  font-size:8.5pt;letter-spacing:.04em;color:var(--txt-2);
  text-align:right;line-height:1.7;
}
.cta-r b{display:block;font-family:'Cormorant Garamond',serif;font-style:italic;
  font-weight:400;font-size:14pt;color:var(--ink);letter-spacing:.02em;margin-top:1mm}

/* ─── FOOTER (every page) ──────────────────────── */
.bp-foot{
  position:absolute;bottom:10mm;left:18mm;right:18mm;
  display:flex;justify-content:space-between;align-items:center;
  font-size:6.5pt;letter-spacing:.22em;text-transform:uppercase;
  color:var(--txt-3);padding-top:4mm;
  border-top:.5pt solid var(--line-soft);
}
.bp-foot .l{display:flex;gap:6mm}
.bp-foot b{font-weight:500;color:var(--txt-2);letter-spacing:.18em}
.bp-foot .pn{
  font-family:'Cormorant Garamond',serif;font-style:italic;
  font-weight:300;font-size:10pt;color:var(--gold);letter-spacing:.04em;
  text-transform:none;
}

/* ─── PRINT ─────────────────────────────────────── */
@media print{
  @page{size:A4;margin:0}
  html,body{background:#fff!important;margin:0!important;padding:0!important}
  body{cursor:auto}
  .no-print {display:none!important}
  .page{
    width:210mm!important;height:297mm!important;
    min-height:297mm!important;max-height:297mm!important;
    margin:0!important;box-shadow:none!important;
    overflow:hidden!important;
    page-break-after:always!important;break-after:page!important;
    page-break-inside:avoid!important;break-inside:avoid!important;
  }
  .page:last-child{page-break-after:auto!important;break-after:auto!important}
  .page-inner{
    width:100%;height:100%;
    display:flex!important;flex-direction:column!important;
    padding:16mm 18mm 12mm!important;
    position:relative;
  }
  .cover .page-inner{padding:0!important;display:flex!important}
  .bp-foot{
    position:static!important;
    margin-top:auto!important;
    left:auto!important;right:auto!important;bottom:auto!important;
    padding-top:5mm!important;
  }
  *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;color-adjust:exact!important}
}

/* ─── SCREEN HELPERS ────────────────────────────── */
@media screen{
  body{padding:30px 0 80px}
}
@media (max-width:900px){
  .page{width:100%;min-height:auto}
  .item-desc{grid-template-columns:1fr}
}
.print-btn {
  position: fixed;
  top: 18px; right: 18px; z-index: 9999;
  background: var(--gold); color: var(--ink);
  font-family: 'Inter', sans-serif; font-weight: 500; font-size: 14px;
  border: none; border-radius: 6px; padding: 10px 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  cursor: pointer; transition: all 0.2s;
}
.print-btn:hover { background: var(--gold-2); transform: translateY(-1px); }
</style>
</head>
<body>

<button class="print-btn no-print" onclick="window.print()">⎙ Descargar PDF</button>

<!-- ═══ PÁGINA 1 · TAPA ═══ -->
<section class="page dark cover">
  <div class="cover-photo"></div>
  <div class="cover-overlay"></div>

  <div class="cover-head">
    <div class="cover-logo">VERKO</div>
    <div class="cover-meta-tl">
      <b>Presupuesto</b>
      <span>N° {{numero}}</span>
    </div>
  </div>

  <div class="cover-body">
    <div class="cover-eyebrow"><span>Mobiliario integral a medida</span></div>
    <h1 class="cover-title">Presupuesto.</h1>
    <div class="cover-sub">{{cliente.proyecto}}</div>

    <div class="cover-rule"></div>

    <div class="cover-grid">
      <div class="cv-cell">
        <span class="k">Cliente</span>
        <span class="v" >{{cliente.nombre}}</span>
      </div>
      <div class="cv-cell">
        <span class="k">Fecha</span>
        <span class="v" >{{fecha}}</span>
      </div>
      <div class="cv-cell">
        <span class="k">Domicilio</span>
        <span class="v" >{{cliente.domicilio}}</span>
      </div>
      <div class="cv-cell">
        <span class="k">Localidad</span>
        <span class="v" >{{cliente.localidad}}</span>
      </div>
      <div class="cv-cell">
        <span class="k">Proyecto</span>
        <span class="v" >{{cliente.proyecto}}</span>
      </div>
      <div class="cv-cell">
        <span class="k">Validez</span>
        <span class="v">{{validez_dias}} días</span>
      </div>
    </div>
  </div>

  <div class="cover-foot">
    <div class="cover-statement">Si es <em>Verko,</em><br>se nota.</div>
    <div class="cover-no">
      Estudio operativo
      <b>2002 — 2026</b>
    </div>
  </div>
</section>

<!-- ═══ PÁGINA 2 · SOBRE VERKO ═══ -->
<section class="page">
  <div class="page-inner">
    <header class="bp-head">
      <div class="bp-head-l">
        <div class="bp-logo">VERKO</div>
        <div class="bp-head-meta">
          <b>Verko</b> · Diseños en madera<br>
          <span>Estudio operativo desde 2002</span>
        </div>
      </div>
      <div class="bp-head-r">Carpintería integral</div>
    </header>

    <div class="about-hero">
      <div class="about-hero-bg"></div>
      <div class="about-hero-mark">— La carpintería</div>
    </div>

    <div class="about-body">
      <div class="about-eyebrow">Sobre Verko</div>
      <h2 class="about-title">Veinticuatro años fabricando mobiliario fijo a medida <em>para los proyectos más exigentes</em> de Buenos Aires.</h2>
      <p class="about-text">Verko es un estudio de carpintería integral con fábrica propia en Ezeiza. Diseñamos, fabricamos y colocamos mobiliario residencial y corporativo a medida — cocinas, vestidores, placards, revestimientos, bibliotecas, mobiliario de oficina y exteriores. Trabajamos sobre planos y obra, con un equipo técnico que acompaña el proyecto desde la primera medición hasta la última terminación.</p>
      <p class="about-text">Nuestros clientes incluyen Faena Buenos Aires, Faena Art Center, Casa FOA, Toscas Shopping, Telecentro y desarrollos residenciales en los principales barrios de la ciudad y el conurbano. Las inmobiliarias más exigentes venden con nuestro nombre — tener Verko en tu casa es un valor que se reconoce.</p>

      <div class="about-pillars">
        <div class="pillar">
          <h4>Fábrica propia</h4>
          <p>5.000 m² de planta en Ezeiza. Producción 100% in-house: cortes, mecanizados, laqueado, ensamble y control de calidad bajo el mismo techo.</p>
        </div>
        <div class="pillar">
          <h4>Diseño técnico</h4>
          <p>Equipo de proyectistas que llevan tu idea a planos ejecutivos. Planificamos cada interferencia, cada herraje, cada milímetro antes de fabricar.</p>
        </div>
        <div class="pillar">
          <h4>Garantía Verko</h4>
          <p>Materiales premium, herrajes Häfele, terminaciones poliuretánicas. Garantía sobre fabricación y colocación. ISO 9001 en proceso.</p>
        </div>
      </div>
    </div>

    <footer class="bp-foot">
      <div class="l"><span><b>Verko</b> · Diseños en Madera</span><span>San Lorenzo 1680, Ezeiza</span></div>
      <div class="pn">02</div>
    </footer>
  </div>
</section>

<!-- ═══ PÁGINA 3 · CÓMO TRABAJAMOS + PUNTOS ═══ -->
<section class="page">
  <div class="page-inner">
    <header class="bp-head">
      <div class="bp-head-l">
        <div class="bp-logo">VERKO</div>
        <div class="bp-head-meta">
          <b>Verko</b> · Diseños en madera<br>
          <span>Cómo trabajamos · Puntos a tener en cuenta</span>
        </div>
      </div>
      <div class="bp-head-r">Información general</div>
    </header>

    <div class="process-hero">
      <div class="process-hero-bg"></div>
      <div class="process-hero-text">
        <div class="quote">Cada proyecto se diseña a medida. Antes de cualquier presupuesto firme hay medición técnica, planos ejecutivos y validación con el cliente.</div>
        <div class="lab">Proceso</div>
      </div>
    </div>

    <div class="about-body">
      <div class="about-eyebrow">Puntos a tener en cuenta</div>

      <div class="terms-list">
        <div class="term-item">
          <div class="term-num">01</div>
          <div class="term-content">
            <h5>Qué incluye el presupuesto</h5>
            <p>Medición técnica, diseño y planos ejecutivos, fabricación con materiales especificados, entrega y colocación dentro de los 80 km del Centro de Distribución de Buenos Aires. Garantía Verko sobre fabricación y montaje.</p>
          </div>
        </div>

        <div class="term-item">
          <div class="term-num">02</div>
          <div class="term-content">
            <h5>Qué no incluye</h5>
            <p>Iluminación LED, transformadores e instalación eléctrica. Mármol, granito y artefactos. Retiro de muebles existentes. Trabajos de albañilería, pintura, plomería o gas. Salvo indicación expresa por ítem.</p>
          </div>
        </div>

        <div class="term-item">
          <div class="term-num">03</div>
          <div class="term-content">
            <h5>Sobre la obra</h5>
            <p>El ambiente a medir y a colocar debe estar libre de obstáculos y con paredes y pisos preparados estructuralmente para soportar carga. No intervenimos sobre instalaciones de servicios (agua, gas, eléctrica, telefonía, audio).</p>
          </div>
        </div>

        <div class="term-item">
          <div class="term-num">04</div>
          <div class="term-content">
            <h5>Almacenamiento y guarda</h5>
            <p>Nuestro Centro de Distribución almacena el mobiliario sin cargo durante 30 días posteriores a la fecha de fabricación. Pasado ese período se cobra un costo diario en concepto de guarda.</p>
          </div>
        </div>

        <div class="term-item">
          <div class="term-num">05</div>
          <div class="term-content">
            <h5>Validez y forma de pago</h5>
            <p>Validez del presupuesto: {{validez_dias}} días desde la emisión. Valores expresados más IVA. Forma de pago a convenir. La fabricación inicia luego de la firma de la propuesta y la seña correspondiente.</p>
          </div>
        </div>
      </div>
    </div>

    <footer class="bp-foot">
      <div class="l"><span><b>Verko</b> · Diseños en Madera</span><span>San Lorenzo 1680, Ezeiza</span></div>
      <div class="pn">03</div>
    </footer>
  </div>
</section>

<!-- ═══ PÁGINA 4 · INICIO PARTE EDITABLE (ÍTEMS) ═══ -->
<section class="page">
  <div class="page-inner">
    <header class="bp-head">
      <div class="bp-head-l">
        <div class="bp-logo">VERKO</div>
        <div class="bp-head-meta">
          <b>Presupuesto</b> · <span>N° {{numero}}</span><br>
          <span>Cliente</span> · <span>{{cliente.nombre}}</span>
        </div>
      </div>
      <div class="bp-head-r">{{fecha}}</div>
    </header>

    <div class="editable-banner">
      <div class="editable-banner-l">
        <div class="k">— Presupuesto del cliente</div>
        <div class="h">Datos del proyecto y detalle de cada ítem.</div>
      </div>
      <div class="editable-banner-r">A continuación se detallan las partidas, especificaciones y valores correspondientes a este proyecto.</div>
    </div>

    <div class="client-grid">
      <div class="cg-cell"><span class="k">Cliente</span><span class="v">{{cliente.nombre}}</span></div>
      <div class="cg-cell"><span class="k">Fecha</span><span class="v">{{fecha}}</span></div>
      <div class="cg-cell"><span class="k">N° presupuesto</span><span class="v">{{numero}}</span></div>
      <div class="cg-cell"><span class="k">Domicilio</span><span class="v">{{cliente.domicilio}}</span></div>
      <div class="cg-cell"><span class="k">Localidad</span><span class="v">{{cliente.localidad}}</span></div>
      <div class="cg-cell"><span class="k">Proyecto</span><span class="v">{{cliente.proyecto}}</span></div>
    </div>

    <div class="section-intro" style="margin-top:8mm">
      <div class="lab">Por suministro e instalación</div>
      <h2>Mobiliario integral residencial a medida.</h2>
      <p>La siguiente propuesta contempla fabricación, provisión y colocación de mobiliario fijo a medida para el proyecto detallado más arriba, bajo criterios de terminación, funcionalidad y calidad Verko.</p>
    </div>

    <div id="items">
    
      <!-- RENDERIZAR ÍTEMS DINÁMICAMENTE AQUÍ. 
           Si hay más ítems que quepan en la página, debés crear nuevas <section class="page"> como esta 
           con su respectivo header y footer, y el id="items-2", id="items-3", etc.
      -->

    </div>

    <footer class="bp-foot">
      <div class="l"><span><b>Verko</b> · Diseños en Madera</span><span>San Lorenzo 1680, Ezeiza</span></div>
      <div class="pn">04</div>
    </footer>
  </div>
</section>

<!-- ═══ PÁGINA RESUMEN ═══ -->
<section class="page">
  <div class="page-inner">
    <header class="bp-head">
      <div class="bp-head-l">
        <div class="bp-logo">VERKO</div>
        <div class="bp-head-meta">
          <b>Presupuesto</b> · <span>N° {{numero}}</span><br>
          <span>Cliente</span> · <span>{{cliente.nombre}}</span>
        </div>
      </div>
      <div class="bp-head-r">{{fecha}}</div>
    </header>

    <div class="section-intro">
      <div class="lab">— Resumen de inversión</div>
      <h2>Una propuesta integral, <em>presentada con detalle.</em></h2>
    </div>

    <div class="summary-grid">
      <div class="summary-list" id="summaryList">
        
        <!-- Renderizar el resumen de los ítems usando los mismos datos -->

      </div>

      <div class="grand-total">
        <div class="gt-row">
          <div class="gt-label">
            <span class="k">Total general</span>
            <span class="s">Mobiliario integral residencial a medida</span>
          </div>
          <div class="gt-amt" id="grand-total" data-price="{{totales.subtotal_con_descuento}}">{{totales.subtotal_con_descuento}}</div>
        </div>
        <div class="gt-iva">
          <span>Valores expresados</span>
          <span>+ IVA</span>
        </div>
      </div>
    </div>

    <footer class="bp-foot">
      <div class="l"><span><b>Verko</b> · Diseños en Madera</span><span>San Lorenzo 1680, Ezeiza</span></div>
      <div class="pn">xx</div>
    </footer>
  </div>
</section>

<!-- ═══ PÁGINA CIERRE ═══ -->
<section class="page">
  <div class="page-inner">
    <header class="bp-head">
      <div class="bp-head-l">
        <div class="bp-logo">VERKO</div>
        <div class="bp-head-meta">
          <b>Presupuesto</b> · <span>N° {{numero}}</span><br>
          <span>Cliente</span> · <span>{{cliente.nombre}}</span>
        </div>
      </div>
      <div class="bp-head-r">{{fecha}}</div>
    </header>

    <div class="closing">
      <div class="closing-head">
        <div class="section-intro" style="border:none;padding:0;margin:0">
          <div class="lab">— Aceptación</div>
          <h2 style="font-size:24pt">Confirmación <em>del presupuesto.</em></h2>
        </div>

        <div class="closing-statement">
          Cada proyecto se aborda como una pieza única — desde la primera reunión hasta la última terminación. Si avanzamos, lo hacemos con el mismo cuidado con el que <em>encaramos cada obra</em> en estos <b>veinticuatro años.</b>
        </div>

        <div class="conditions" style="margin-top:6mm">
          <h3>— Condiciones generales</h3>
          <p>{{condiciones_generales}}</p>
        </div>

        <div class="sign-area">
          <div class="sign-box">
            <div class="k">Por el cliente</div>
            <div class="v">Firma · Aclaración</div>
          </div>
          <div class="sign-box">
            <div class="k">Por Verko</div>
            <div class="v">Firma · Aclaración</div>
          </div>
        </div>
      </div>

      <div class="cta-band">
        <div class="cta-l">
          <div class="k">Estudio · Fábrica · Showroom</div>
          <div class="h">San Lorenzo 1680<br><em>Ezeiza · Buenos Aires.</em></div>
        </div>
        <div class="cta-r">
          presupuestos@verko.com.ar<br>
          info@verko.com.ar<br>
          Tel · 4454-4506 / 4308-3509
          <b>+54 9 11 2313 3120</b>
        </div>
      </div>
    </div>

    <footer class="bp-foot">
      <div class="l">
        <span><b>Grupo VRK Canning SRL</b> · CUIT 30-71805927-1</span>
        <span>verko.com.ar</span>
      </div>
      <div class="pn">xx</div>
    </footer>
  </div>
</section>

<script>
// Formato moneda argentina
function fmt(n) {
  n = Math.round(Number(n) || 0);
  return n.toLocaleString('es-AR').replace(/,/g, '.');
}

// Formatear todos los precios al cargar
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-price]').forEach(el => {
    el.textContent = fmt(el.dataset.price);
  });
  // Calcular grand total si fuera necesario o simplemente formatearlo (el span del gran total debe tener data-price con el total general de js)
  let total = 0;
  document.querySelectorAll('[data-item-total]').forEach(el => {
    total += Number(el.dataset.itemTotal) || 0;
  });
  
  if (total > 0) {
    const gtEl = document.getElementById('grand-total');
    if (gtEl) gtEl.textContent = fmt(total);
  }
});
</script>

</body>
</html>`;
}
