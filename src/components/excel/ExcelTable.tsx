import { HotTable } from "@handsontable/react"

interface Props {
  data: unknown[][]
  readonly?: boolean
}

const ExcelTable: React.FC<Props> = ({ data, readonly = false }) => {
  return (
    <div className="overflow-auto overscroll-contain w-fit mx-auto">
      <HotTable
        data={data}
        readOnly={readonly}
        rowHeaders={true}
        colHeaders={true}
        width="90vw"
        height="90vh"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

export default ExcelTable
