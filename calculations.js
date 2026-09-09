import { norm, num, date, modality } from './utils.js';

const sum = (items, get) => items.reduce((total, item) => total + get(item), 0);
const monthKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const monday = d => { const value = new Date(d); value.setHours(0,0,0,0); value.setDate(value.getDate() - ((value.getDay() + 6) % 7)); return value; };
const daysInMonth = d => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

export function financial(rows, year) {
  const today = new Date();
  const filtered = rows.filter(r => norm(r.mcmv_fgts_06_txt_programa_fed) === 'mcmv' && +r.mcmv_fgts_20_txt_ano_contratacao === year && +r.mcmv_fgts_21_txt_mes_contratacao < (today.getMonth() + 1) && !(norm(r.mcmv_fgts_08_txt_programa_fgts) === 'pro-cotista' && norm(r.mcmv_fgts_15_txt_faixa) === 'fora mcmv/cva'));
  const months = {}, mods = {};
  filtered.forEach(r => { const k = `${year}-${String(r.mcmv_fgts_21_txt_mes_contratacao).padStart(2,'0')}`, value = num(r.mcmv_fgts_14_qtd_contratos), m = modality(r.mcmv_fgts_08_txt_programa_fgts); months[k] = (months[k] || 0) + value; mods[m] = (mods[m] || 0) + value; });
  return { rows: filtered, total: sum(filtered, r => num(r.mcmv_fgts_14_qtd_contratos)), months, mods, lastMonth: Object.keys(months).sort().at(-1) };
}

export function ogu(rows, year) {
  const used = rows.filter(r => { const d = date(r.mcmv_ogu_16_dt_contratacao); return d?.getFullYear() === year && norm(r.mcmv_ogu_37_bln_novo_mcmv) === 'sim'; });
  const seen = new Set(), unique = used.filter(r => { const id = r.mcmv_ogu_05_cod_operacao_snh; if (seen.has(id)) return false; seen.add(id); return true; });
  const months = {}, mods = {};
  unique.forEach(r => { const d = date(r.mcmv_ogu_16_dt_contratacao), value = num(r.mcmv_ogu_22_qtd_uh), m = modality(r.mcmv_ogu_13_txt_modalidade); months[monthKey(d)] = (months[monthKey(d)] || 0) + value; mods[m] = (mods[m] || 0) + value; });
  return { rows: unique, total: sum(unique, r => num(r.mcmv_ogu_22_qtd_uh)), months, mods, lastMonth: Object.keys(months).sort().at(-1), duplicates: used.length - unique.length };
}

export function rcb(rows) {
  const valid = rows.map(r => date(r.rcb_19_dt_assinatura)).filter(Boolean), months = {};
  valid.forEach(d => months[monthKey(d)] = (months[monthKey(d)] || 0) + 1);
  const lastMonth = Object.keys(months).sort().at(-1), recent = Object.keys(months).sort().filter(k => k <= lastMonth).slice(-3);
  return { total: valid.length, months, lastMonth, average: recent.length === 3 ? sum(recent, k => months[k]) / 3 : null };
}

export function weekly(rows, year) {
  const filtered = rows.filter(r => { const d = date(r.dte_data_contratacao); return d?.getFullYear() === year && (norm(r.txt_pmcmv) === 's' || String(r.txt_faixa_pmcmv || '').trim() !== ''); });
  const max = filtered.reduce((latest, r) => { const d = date(r.dte_data_contratacao); return d > latest ? d : latest; }, new Date(0));
  let last = monday(max); if (max.getDay() !== 0) last.setDate(last.getDate() - 7);
  const weeks = {};
  filtered.forEach(r => { const d = monday(date(r.dte_data_contratacao)); if (d <= last) { const k = d.toISOString().slice(0,10); (weeks[k] ??= []).push(r); } });
  const keys = Object.keys(weeks).sort(), latest = keys.at(-1), previous = keys.at(-2), total = k => sum(weeks[k] || [], () => 1), last4 = keys.slice(-4), prior4 = keys.slice(-8,-4), m4 = sum(last4,total) / last4.length, p4 = sum(prior4,total) / prior4.length;
  const modalities = {}; (weeks[latest] || []).forEach(r => { const m = modality(r.txt_nome_programa || r['txt_linha_crédito']); modalities[m] = (modalities[m] || 0) + 1; });
  return { filtered, weeks, keys, last: latest, previous, lastTotal: total(latest), previousTotal: total(previous), m4, prior4: p4, modalities, nextMonth: new Date(last.getFullYear(),last.getMonth()+1,1), projection: m4 * daysInMonth(new Date(last.getFullYear(),last.getMonth()+1,1)) / 7 };
}

export function scenarios(fin, og, rcbData, weeklyData, assumptions) {
  const remaining = Math.max(1, 12 - (+fin.lastMonth.slice(5) - 1)), current = assumptions.baseStock + fin.total + og.total, balance = assumptions.nationalTarget - current, oguBalance = Math.max(0, assumptions.oguTarget - og.total), rcbForecast = rcbData?.total ? rcbData.total + (rcbData.average || 0) * remaining : 0;
  const raw = [['OGU alcança 100 mil UH', balance - oguBalance], ['Sem novas contratações OGU', balance], ['Reforma Casa Brasil, sem novo OGU', balance - rcbForecast]];
  return { current, balance, oguBalance, items: raw.map(([label, need], index) => { const monthly = need / remaining, weeklyNeed = monthly * 12 / 52, nextNeed = monthly, diff = weeklyData ? weeklyData.projection - nextNeed : null; return { label, need, monthly, weekly: weeklyNeed, nextNeed, diff, diffPct: diff === null ? null : diff / nextNeed * 100, available: index < 2 || !!rcbData?.total }; }) };
}
