export const norm = v => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export const num = v => { const s=String(v??'').replace(/\./g,'').replace(',','.').replace(/[^0-9.-]/g,''); return Number(s)||0; };
export const date = v => { const s=String(v??'').trim(); if(!s) return null; let m=s.match(/^(\d{2})\/(\d{2})\/(\d{4})/); if(m) return new Date(+m[3],+m[2]-1,+m[1]); m=s.match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1],+m[2]-1,+m[3]) : null; };
export const br = n => Math.round(n||0).toLocaleString('pt-BR');
export const pct = n => `${(n||0).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}%`;
export const monthName = d => d.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
export const monthShort = d => d.toLocaleDateString('pt-BR',{month:'short'}).replace('.','');
function separatorOf(text) {
  // Os extratos podem usar ; (padrão solicitado) ou , (exportação atual).
  // A primeira linha não tem vírgulas dentro de campos, por isso é uma base segura.
  const header = text.replace(/^\uFEFF/, '').split(/\r?\n/, 1)[0] || '';
  const semicolons = (header.match(/;/g) || []).length;
  const commas = (header.match(/,/g) || []).length;
  return semicolons >= commas ? ';' : ',';
}

export function parseCsv(text, wantedHeaders = null) {
  const separator = separatorOf(text);
  const data=[]; let row=[],cell='',quote=false,headers=null,indexes=[];
  const saveRow=()=>{
    row.push(cell.trim()); cell='';
    if(!row.some(x=>x!=='')){row=[];return;}
    if(!headers){
      headers=row.map(h=>h.replace(/^\uFEFF/, '').trim());
      indexes=wantedHeaders ? wantedHeaders.map(h=>[h,headers.indexOf(h)]).filter(([,i])=>i>=0) : headers.map((h,i)=>[h,i]);
    }else data.push(Object.fromEntries(indexes.map(([h,i])=>[h,row[i]??''])));
    row=[];
  };
  for(let i=0;i<text.length;i++){
    const c=text[i];
    if(c==='"'){if(quote&&text[i+1]==='"'){cell+='"';i++;}else quote=!quote;}
    else if(c===separator&&!quote){row.push(cell.trim());cell='';}
    else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&text[i+1]==='\n')i++;saveRow();}
    else cell+=c;
  }
  if(cell||row.length)saveRow();
  return data;
}
export async function readCsv(file, wantedHeaders=null){const b=await file.arrayBuffer();let text=new TextDecoder('utf-8').decode(b);if((text.match(/�/g)||[]).length>3)text=new TextDecoder('windows-1252').decode(b);return parseCsv(text,wantedHeaders);}
export function modality(v){const x=norm(v);if(x.includes('apoio'))return 'Apoio à Produção';if(x.includes('associativa'))return 'Carta de Crédito Associativa';if(x.includes('individual'))return 'Carta de Crédito Individual';if(x.includes('fundo social'))return 'Fundo Social';if(x.includes('classe media'))return 'Classe Média';if(x.includes('pro-cotista'))return 'Pró-Cotista';return String(v||'Outros').trim();}
export function barChart(items,max){return `<div class="chart vertical-chart">${items.map(x=>`<div class="vertical-bar"><b>${br(x.value)}</b><div class="bar-track"><i style="height:${Math.max(2,x.value/max*100)}%;background:${x.color||'#087ab4'}"></i></div><span>${x.label}</span></div>`).join('')}</div>`}
export function comparisonBars(items,max){return `<div class="comparison-chart">${items.map(x=>`<div class="comparison-row"><span>${x.label}</span><div><i style="width:${Math.max(2,x.value/max*100)}%;background:${x.color||'#087ab4'}"></i></div><b>${br(x.value)}</b></div>`).join('')}</div>`}
