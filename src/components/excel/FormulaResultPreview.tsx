import { HotTable } from "@handsontable/react"
import { HyperFormula } from "hyperformula"

interface Props {
  data: any[][]
  readonly?: boolean
}

const FormulaResultPreview: React.FC<Props> = ({ data, readonly = false }) => {
  const hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: "internal-use-in-handsontable"
  })
  return (
    <div className="overflow-auto overscroll-contain w-full mx-auto">
      <HotTable
        data={data}
        readOnly={readonly}
        rowHeaders={true}
        colHeaders={true}
        formulas={{
          engine: hyperformulaInstance
        }}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
      />
    </div>
  )
}

export default FormulaResultPreview
