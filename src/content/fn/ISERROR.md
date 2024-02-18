---
name: ISERROR
summary: エラーかどうか調べる関数
args:
  - summary: エラーかどうか調べたいセル
return:
  - if: セルがエラーなら
    summary: TRUE
    type: boolean
  - if: セルがエラーでないなら
    summary: FALSE
    type: boolean
category: condition
---