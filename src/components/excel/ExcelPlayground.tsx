import { HotTable } from "@handsontable/react"
import { useRef, useEffect, useState } from "react"
import { HyperFormula } from "hyperformula"

interface Props {
  data: any[][]
  slugName: string
}

const ExcelPlayground: React.FC<Props> = ({ data, slugName }) => {
  const hotRef = useRef(null)
  const [activeCellValue, setActiveCellValue] = useState(null)
  const activeEditorRef = useRef(null)

  const hyperformulaInstance = HyperFormula.buildFromSheets(
    { data },
    { licenseKey: "internal-use-in-handsontable" }
  )

  let buttonClickCallback: () => void

  useEffect(() => {
    const hot = hotRef.current.hotInstance
    const exportPlugin = hot.getPlugin("exportFile")

    buttonClickCallback = () => {
      exportPlugin.downloadFile("csv", {
        bom: false,
        columnDelimiter: ",",
        columnHeaders: false,
        rowHeaders: false,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: "csv",
        filename: `PocketExcel-${slugName}_[YYYY]-[MM]-[DD]`,
        mimeType: "text/csv",
        rowDelimiter: "\r\n"
      })
    }
  }, [hotRef.current])

  useEffect(() => {
    const hot = hotRef.current.hotInstance
    activeEditorRef.current = hot.getActiveEditor()
  }, [hotRef.current])

  return (
    <div>
      <input type="text" value={activeCellValue} />
      <button id="export-file" onClick={() => buttonClickCallback()}>
        Download CSV
      </button>
      <div className="overflow-auto overscroll-contain mx-auto h-dvh w-fit">
        <HotTable
          ref={hotRef}
          data={data}
          rowHeaders={true}
          colHeaders={true}
          formulas={{
            engine: hyperformulaInstance
          }}
          contextMenu={["row_above", "row_below", "col_left", "col_right", "undo", "redo"]}
          width="90vw"
          height="80%"
          licenseKey="non-commercial-and-evaluation"
        />
      </div>
    </div>
  )
}

export default ExcelPlayground
