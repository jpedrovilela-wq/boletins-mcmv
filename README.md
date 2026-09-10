# Boletins MCMV

Aplicação estática para gerar boletins mensal e semanal do Programa Minha Casa, Minha Vida. Todo processamento ocorre localmente no navegador: os CSVs não são enviados, armazenados nem incluídos neste repositório.

Os arquivos podem usar separador `;` ou `,`; ambos são reconhecidos automaticamente. A exportação PNG usa uma cópia local da biblioteca necessária, sem depender de CDN.

## Uso

1. Abra a aplicação publicada ou execute um servidor HTTP local nesta pasta.
2. Carregue os quatro CSVs esperados (o Reforma Casa Brasil é opcional para os dois primeiros cenários).
3. Confira a prévia e ajuste as premissas, se necessário.
4. Gere o boletim mensal ou semanal e use **Baixar PNG** ou **Salvar em PDF**.

Arquivos reconhecidos pelos respectivos prefixos: `arquivo_casa_civil_fgts_contratacao`, `arquivo_casa_civil_ogu_contratacao`, `view_exportar_rcb_casa_civil` e `mcmv_financ__contratos__ano_corrente`.

As premissas iniciais são meta nacional de 3.000.000 UH, meta anual OGU de 100.000 UH e estoque até 2025 de 2.148.217 UH. A lógica está centralizada em `config.js` e `calculations.js`.

## Publicação no GitHub Pages

No repositório GitHub, acesse **Settings → Pages**, selecione **Deploy from a branch**, escolha `main` e a pasta `/(root)`. Não há etapa de build nem dependências de servidor.

## Desenvolvimento e validação

O projeto é JavaScript modular sem dependências de build. Os CSVs de referência não devem ser versionados. Valide os totais usando arquivos locais antes de publicar alterações.

Com Node.js 20+ disponível, execute os testes de regras principais com `node tests/calculations.test.mjs`.
