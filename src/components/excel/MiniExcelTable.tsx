import { HotTable } from "@handsontable/react"

interface Props {
  data: unknown[][]
  readonly?: boolean
  hiddenRows: number[]
  hiddenCols: number[]
  highlights: { row: number; col: number; className: string }[]
}

const MiniExcelTable: React.FC<Props> = ({
  data,
  readonly = false,
  hiddenRows,
  hiddenCols,
  highlights
}) => {
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
        cell={highlights}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

export default MiniExcelTable
