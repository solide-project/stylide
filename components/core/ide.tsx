import { useEffect, useState } from "react"
import Editor, { useMonaco } from "@monaco-editor/react"
import { useTheme } from "next-themes"

import { VFSFile } from "@/lib/core"
import { useEditor } from "@/components/core/providers/editor-provider"
import { useFileSystem } from "@/components/core/providers/file-provider"
import path from "path"
import { MonarchDefinitions } from "@/lib/monaco/stylus/language"
import { getRustCompletion, getStylusCompletion } from "@/lib/monaco/stylus/completion"

interface IDEProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultLanguage?: string
}

export function IDE({ defaultLanguage = "rust" }: IDEProps) {
  const fs = useFileSystem()
  const ide = useEditor()
  const { theme } = useTheme()
  const [selectedDefaultLanguage, setSelectedDefaultLanguage] = useState<string>(defaultLanguage)

  const [file, setSelectedFile] = useState<VFSFile>({} as VFSFile)

  const [editorFontSize, setEditorFontSize] = useState<number>(16)
  useEffect(() => {
    const handleWindowResize = () => {
      let fontSize = 12

      if (window.innerWidth > 1024) {
        fontSize = 16
      } else if (window.innerWidth > 768) {
        fontSize = 14
      }

      setEditorFontSize(fontSize)
    }

    handleWindowResize() // Initialize size
    window.addEventListener("resize", handleWindowResize)
    return () => {
      window.removeEventListener("resize", handleWindowResize)
    }
  }, [])

  useEffect(() => {
    if (!ide.file) {
      return
    }

    const { ext } = path.parse(ide.file.filePath);

    switch (ext) {
      case ".sol":
        setSelectedDefaultLanguage("sol")
        break
      case ".rs":
        setSelectedDefaultLanguage("rust")
        break
      case ".toml":
        setSelectedDefaultLanguage("toml")
        break
      case ".json":
        setSelectedDefaultLanguage("json")
        break
      default:
        setSelectedDefaultLanguage("sol")
    }
    setSelectedFile(ide.file)
  }, [ide.file])

  const monaco = useMonaco()
  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "rust" })
      monaco.languages.setMonarchTokensProvider(
        "rust",
        MonarchDefinitions as any
      )


      monaco.languages.registerCompletionItemProvider("rust", {
        // triggerCharacters: ['.', '', '"', '@', '/'],
        provideCompletionItems: (model, position, context) => {
          const word = model.getWordUntilPosition(position)
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          }


          const textLine = model.getLineContent(position.lineNumber)
          return {
            suggestions: [
              ...getRustCompletion(range, monaco),
              ...getStylusCompletion(range, monaco),
            ],
          }
        },
      })
    }
  }, [monaco])

  const onChange = async (newValue: string | undefined, event: any) => {
    if (!newValue) return
    fs.vfs.touch(file.filePath, newValue)
  }

  const handleSelectionChange = (event: any, editor: any) => {
    const model = editor.getModel()
    if (model) {
      const selection = editor.getSelection()
      if (selection && !selection.isEmpty()) {
        const selectedText = model.getValueInRange(selection)
        // console.log('Text is highlighted:', selectedText);
        window.parent.postMessage(
          { data: { selectedText }, target: "solide-highlight" } || "",
          "https://dapp.solide0x.tech/" || "http://localhost:3001/"
        )
        // You can perform further actions here with the selected text
      }
    }
  }

  return (
    <Editor
      key={file.filePath}
      height="95vh"
      theme={theme === "light" ? "vs" : "vs-dark"}
      defaultLanguage={selectedDefaultLanguage}
      loading={<EditorLoading />}
      onChange={onChange}
      defaultValue={file.content || ""}
      options={{ fontSize: editorFontSize }}
      onMount={(editor, monaco) => {
        // editor.onDidChangeCursorPosition((event: any) => {
        //   console.log("Cursor position changed:", event.position)
        // })

        editor.onDidChangeCursorSelection((event: any) =>
          handleSelectionChange(event, editor)
        )

        editor.addAction({
          id: "copilot",
          label: "Explain This",
          // keybindings: [monaco.KeyMod.CtrlCmd],
          contextMenuGroupId: "9_cutcopypaste",
          run: (editor: any) => {
            const model = editor.getModel()
            if (model) {
              const selection = editor.getSelection()
              if (selection && !selection.isEmpty()) {
                const selectedText = model.getValueInRange(selection)
                console.log("Text is highlighted:", selectedText)
              }
            }
          }
        });
      }}
    />
  )
}

const EditorLoading = () => {
  return <div className="h-5 w-5 animate-spin"></div>
}
