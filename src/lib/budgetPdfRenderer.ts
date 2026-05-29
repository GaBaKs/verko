import { getBudgetPdfTemplate } from './budgetPdfTemplate';
import type { BudgetPdfPayload } from './budgetPdfPayload';

const ITEMS_PER_PAGE = 4;

function fmt(n: number | string): string {
  return Math.round(Number(n) || 0).toLocaleString('es-AR').replace(/,/g, '.');
}

function buildDimensiones(item: any): string {
  if (!item) return '—';
  // Attempt to build dimension string if those fields exist, else return empty or handle gracefully
  // This depends if payload has it. The payload interface currently has `especificaciones: string[]`.
  // I will just use especificaciones instead of ancho_mm etc formatting, because payload items don't have ancho/alto.
  return '—';
}

function buildSpecRow(label: string, value: string): string {
  if (!value) return '';
  return `<div class="spec"><span class="k">${label}</span><span class="v">${value}</span></div>`;
}

function buildItemsHtml(items: BudgetPdfPayload['items'], numeroPpto: string, clienteNombre: string, fecha: string): string {
  let html = '';
  
  if (!items || items.length === 0) return html;

  // We group in chunks
  const chunks = [];
  for (let i = 0; i < items.length; i += ITEMS_PER_PAGE) {
    chunks.push(items.slice(i, i + ITEMS_PER_PAGE));
  }

  chunks.forEach((chunk, chunkIndex) => {
    let chunkHtml = '';
    
    // Build articles for this chunk
    chunk.forEach(item => {
      const especificacionesHTML = item.especificaciones.map(esp => `<li>${esp}</li>`).join('');
      const notaExclusiones = item.nota_exclusiones ? `<div class="item-note">${item.nota_exclusiones}</div>` : '';
      
      chunkHtml += `
        <article class="item">
          <div class="item-head">
            <div class="item-num">${item.numero}</div>
            <div class="item-head-l">
              <div class="item-title-eyebrow">${item.tipo}</div>
              <h3 class="item-title">${item.titulo}</h3>
            </div>
            <div class="item-price">
              <div class="item-price-amt" data-price="${item.precio_sin_iva}" data-item-total="${item.precio_sin_iva}">${item.precio_sin_iva}</div>
              <div class="item-price-tag">+ IVA</div>
            </div>
          </div>
          <ul class="item-desc">
            ${especificacionesHTML}
          </ul>
          ${notaExclusiones}
        </article>
      `;
    });

    if (chunkIndex === 0) {
      // First chunk just returns the items, it replaces the <div id="items"> content in the template
      html += chunkHtml;
    } else {
      // Additional chunks: we need to close the previous <section class="page"> and open a new one
      const pageNumStr = String(4 + chunkIndex).padStart(2, '0');
      
      html += `
        </div><!-- close items -->
        <footer class="bp-foot">
          <div class="l"><span><b>Verko</b> · Diseños en Madera</span><span>San Lorenzo 1680, Ezeiza</span></div>
          <div class="pn">${String(4 + chunkIndex - 1).padStart(2, '0')}</div>
        </footer>
      </div><!-- close page-inner -->
    </section>

    <!-- NEW PAGE FOR ITEMS -->
    <section class="page">
      <div class="page-inner">
        <header class="bp-head">
          <div class="bp-head-l">
            <div class="bp-logo">VERKO</div>
            <div class="bp-head-meta">
              <b>Presupuesto</b> · <span>N° ${numeroPpto}</span><br>
              <span>Cliente</span> · <span>${clienteNombre}</span>
            </div>
          </div>
          <div class="bp-head-r">${fecha}</div>
        </header>

        <div class="section-intro">
          <div class="lab">Por suministro e instalación</div>
          <h2>Mobiliario integral residencial a medida. (Cont.)</h2>
        </div>

        <div id="items-${chunkIndex + 1}">
          ${chunkHtml}
      `;
      // The last chunk will be closed by the template itself that has </div> and <footer...
    }
  });

  return html;
}

function buildSummaryHtml(items: BudgetPdfPayload['items']): string {
  if (!items) return '';
  return items.map(item => `
    <div class="sum-row">
      <div class="nm"><small>${item.numero}</small>${item.titulo}</div>
      <div class="vl" data-price="${item.precio_sin_iva}">${item.precio_sin_iva}</div>
    </div>
  `).join('');
}

export function renderBudgetPdf(payload: BudgetPdfPayload): string {
  const template = getBudgetPdfTemplate();
  
  const d = new Date();
  const fechaHoy = String(d.getDate()).padStart(2, '0') + ' · ' + 
                   d.toLocaleDateString('es-AR', { month: 'long' }) + ' · ' + 
                   d.getFullYear();
                   
  const itemsHtml = buildItemsHtml(payload.items, payload.identificacion.numero, payload.cliente.nombre, fechaHoy);
  const summaryHtml = buildSummaryHtml(payload.items);

  let html = template;

  html = html.replaceAll('{{numero}}', payload.identificacion.numero);
  html = html.replaceAll('{{fecha}}', fechaHoy);
  html = html.replaceAll('{{cliente.nombre}}', payload.cliente.nombre);
  html = html.replaceAll('{{cliente.domicilio}}', payload.cliente.domicilio);
  html = html.replaceAll('{{cliente.localidad}}', payload.cliente.localidad);
  html = html.replaceAll('{{cliente.proyecto}}', payload.cliente.proyecto);
  html = html.replaceAll('{{validez_dias}}', String(payload.identificacion.validez_dias));
  html = html.replaceAll('{{condiciones_generales}}', payload.condiciones_generales);
  html = html.replaceAll('{{totales.subtotal_con_descuento}}', String(payload.totales.subtotal_con_descuento));

  // Inyectar items
  html = html.replace(/(<div id="items">)([\s\S]*?)(<\/div>)/, `$1${itemsHtml}$3`);

  // Inyectar resumen
  html = html.replace(/(<div class="summary-list" id="summaryList">)([\s\S]*?)(<\/div>)/, `$1${summaryHtml}$3`);

  return html;
}
