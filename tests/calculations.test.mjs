import assert from 'node:assert/strict';
import { financial, ogu, rcb, scenarios } from '../calculations.js';

const fgts = [
  {mcmv_fgts_06_txt_programa_fed:'MCMV',mcmv_fgts_20_txt_ano_contratacao:'2026',mcmv_fgts_21_txt_mes_contratacao:'01',mcmv_fgts_08_txt_programa_fgts:'Apoio à Produção',mcmv_fgts_15_txt_faixa:'Faixa 1',mcmv_fgts_14_qtd_contratos:'10'},
  {mcmv_fgts_06_txt_programa_fed:'MCMV',mcmv_fgts_20_txt_ano_contratacao:'2026',mcmv_fgts_21_txt_mes_contratacao:'01',mcmv_fgts_08_txt_programa_fgts:'Pró-Cotista',mcmv_fgts_15_txt_faixa:'Fora MCMV/CVA',mcmv_fgts_14_qtd_contratos:'5'}
];
const fin = financial(fgts, 2026);
assert.equal(fin.total, 10, 'exclui Pró-Cotista/Fora MCMV-CVA');

const o = ogu([{mcmv_ogu_16_dt_contratacao:'01/01/2026',mcmv_ogu_37_bln_novo_mcmv:'Sim',mcmv_ogu_05_cod_operacao_snh:'A',mcmv_ogu_22_qtd_uh:'12',mcmv_ogu_13_txt_modalidade:'FAR'}, {mcmv_ogu_16_dt_contratacao:'01/01/2026',mcmv_ogu_37_bln_novo_mcmv:'Sim',mcmv_ogu_05_cod_operacao_snh:'A',mcmv_ogu_22_qtd_uh:'12',mcmv_ogu_13_txt_modalidade:'FAR'}], 2026);
assert.equal(o.total, 12, 'deduplica operações OGU');

const reform = rcb([{rcb_19_dt_assinatura:'01/06/2026'},{rcb_19_dt_assinatura:'02/07/2026'},{rcb_19_dt_assinatura:'03/08/2026'}]);
assert.equal(reform.average, 1, 'calcula média dos três últimos meses');
const scenario = scenarios({lastMonth:'2026-08',total:482489}, {total:21796}, reform, {projection:10000}, {baseStock:2148217,nationalTarget:3000000,oguTarget:100000});
assert.equal(scenario.current, 2652502);
console.log('Cálculos principais: OK');
