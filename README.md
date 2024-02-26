# pocket-excel-learning

実際に動くExcel風デモを組み込んだExcel関数学習サイト

## for dev

### Excelシートのデータを追加するときは：

1. https://cloudconvert.com/xlsx-to-csv などでXLSXファイルをCSV化
2. CSVファイルを`src/data/csv`配下に置く
3. `yarn csv-to-json`を実行
4. `yarn json-to-array`を実行
