export const FILES = {
  fgts: { prefix: 'arquivo_casa_civil_fgts_contratacao', label: 'Linha financiada (mensal)', required: ['mcmv_fgts_06_txt_programa_fed','mcmv_fgts_08_txt_programa_fgts','mcmv_fgts_14_qtd_contratos','mcmv_fgts_15_txt_faixa','mcmv_fgts_20_txt_ano_contratacao','mcmv_fgts_21_txt_mes_contratacao'] },
  ogu: { prefix: 'arquivo_casa_civil_ogu_contratacao', label: 'OGU (mensal)', required: ['mcmv_ogu_05_cod_operacao_snh','mcmv_ogu_13_txt_modalidade','mcmv_ogu_16_dt_contratacao','mcmv_ogu_22_qtd_uh','mcmv_ogu_37_bln_novo_mcmv'] },
  rcb: { prefix: 'view_exportar_rcb_casa_civil', label: 'Reforma Casa Brasil (mensal)', required: ['rcb_19_dt_assinatura'], optional: true },
  weekly: { prefix: 'mcmv_financ__contratos__ano_corrente', label: 'Linha financiada (semanal)', required: ['txt_numero_contrato','dte_data_contratacao','txt_pmcmv','txt_faixa_pmcmv','txt_nome_programa','txt_linha_crédito'] }
};
export const DEFAULTS = { nationalTarget: 3000000, oguTarget: 100000, baseStock: 2148217 };
export const BLUE = '#004a87';
