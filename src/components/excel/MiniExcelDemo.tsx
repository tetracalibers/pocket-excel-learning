import { HotTable } from "@handsontable/react"
import { HyperFormula } from "hyperformula"

interface Props {
  source: {
    data: any[][]
    sheetName: string
  }
  data: unknown[][]
  hiddenRows: number[]
  hiddenCols: number[]
  readonly?: boolean
  highlights: { row: number; col: number; className: string }[]
  sheetName: string
}

const MiniExcelDemo: React.FC<Props> = ({
  source,
  data,
  readonly = false,
  sheetName,
  hiddenRows,
  hiddenCols,
  highlights
}) => {
  const hyperformulaInstance = HyperFormula.buildFromSheets(
    {
      [source.sheetName]: source.data
    },
    {
      licenseKey: "internal-use-in-handsontable"
    }
  )
  return (
    <div className="overflow-auto overscroll-contain w-full mx-auto">
      <HotTable
        data={data}
        readOnly={readonly}
        rowHeaders={true}
        colHeaders={true}
        hiddenRows={{
          indicators: true,
          rows: hiddenRows
        }}
        hiddenColumns={{
          indicators: true,
          columns: hiddenCols
        }}
        formulas={{
          engine: hyperformulaInstance,
          sheetName
        }}
        cell={highlights}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

export default MiniExcelDemo
