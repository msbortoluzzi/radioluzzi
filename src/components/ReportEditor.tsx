'use client'

import React from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Paragraph from '@tiptap/extension-paragraph'
import Underline from '@tiptap/extension-underline'

interface ReportEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

const ParagraphWithMeta = Paragraph.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-section': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-section'),
        renderHTML: (attributes) =>
          attributes['data-section'] ? { 'data-section': attributes['data-section'] } : {}
      },
      'data-line': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-line'),
        renderHTML: (attributes) =>
          attributes['data-line'] ? { 'data-line': attributes['data-line'] } : {}
      }
    }
  }
})

const applyLineNumbersToElements = (elements: NodeListOf<HTMLElement>) => {
  const counters = new Map<string, number>()
  let currentSection: string | null = null

  elements.forEach((node) => {
    const sectionAttr = node.getAttribute('data-section')

    if (sectionAttr) {
      currentSection = sectionAttr
    } else if (currentSection) {
      node.setAttribute('data-section', currentSection)
    } else {
      currentSection = 'geral'
      node.setAttribute('data-section', currentSection)
    }

    const sectionKey = node.getAttribute('data-section') || 'geral'
    const nextLine = (counters.get(sectionKey) ?? 0) + 1
    counters.set(sectionKey, nextLine)
    node.setAttribute('data-line', String(nextLine))
  })
}

const addLineNumbersToHtml = (html: string) => {
  if (typeof window === 'undefined') return html
  const temp = document.createElement('div')
  temp.innerHTML = html
  applyLineNumbersToElements(temp.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4'))
  return temp.innerHTML
}

const ReportEditor: React.FC<ReportEditorProps> = ({
  content,
  onChange,
  placeholder = 'Digite ou dite o laudo aqui...',
  editable = true
}) => {
  const lastEmittedHtml = React.useRef<string>('')

  const refreshDomLineNumbers = React.useCallback(
    (editorInstance: Editor | null) => {
      if (!editorInstance) return
      applyLineNumbersToElements(editorInstance.view.dom.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4'))
    },
    []
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        paragraph: false,
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      ParagraphWithMeta,
      Placeholder.configure({
        placeholder
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle']
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      refreshDomLineNumbers(editor)
      const numberedHtml = addLineNumbersToHtml(editor.getHTML())
      if (numberedHtml !== lastEmittedHtml.current) {
        lastEmittedHtml.current = numberedHtml
        onChange(numberedHtml)
      }
    },
    onCreate: ({ editor }) => {
      refreshDomLineNumbers(editor)
      const numberedHtml = addLineNumbersToHtml(editor.getHTML())
      lastEmittedHtml.current = numberedHtml
      onChange(numberedHtml)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none p-6 bg-[#0f0f0f] text-gray-100 prose-invert'
      }
    }
  })

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      if (content !== lastEmittedHtml.current) {
        editor.commands.setContent(content)
        lastEmittedHtml.current = addLineNumbersToHtml(content)
      }
      refreshDomLineNumbers(editor)
    }
  }, [content, editor, refreshDomLineNumbers])

  if (!editor) {
    return null
  }

  const baseBtn = 'px-3 py-1 rounded text-sm bg-[#0f0f0f] text-gray-200 hover:bg-[#1f1f1f]'
  const fontSizes = [
    { label: 'Padrao', value: '' },
    { label: '10', value: '10pt' },
    { label: '11', value: '11pt' },
    { label: '12', value: '12pt' },
    { label: '14', value: '14pt' },
    { label: '16', value: '16pt' },
    { label: '18', value: '18pt' }
  ]
  const fontFamilies = [
    { label: 'Padrao', value: '' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times', value: '"Times New Roman", serif' },
    { label: 'Calibri', value: 'Calibri, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' }
  ]

  const applyFontFamily = (value: string) => {
    if (value) editor.chain().focus().setFontFamily(value).run()
    else editor.chain().focus().unsetFontFamily().run()
  }

  const applyFontSize = (value: string) => {
    const chain = editor.chain().focus() as any // setTextStyle comes from TextStyle extension
    if (value) chain.setTextStyle({ fontSize: value }).run()
    else chain.unsetTextStyle().run()
  }

  return (
    <div className="border border-[#222222] rounded-lg bg-[#0f0f0f] text-gray-100">
      <div className="border-b border-[#222222] p-2 flex flex-wrap gap-2 bg-[#161616] items-center">
        <div className="flex gap-2">
          <select
            onChange={(e) => applyFontFamily(e.target.value)}
            className="h-9 rounded-md bg-[#0f0f0f] border border-[#2a2a2a] text-sm text-gray-100 px-2"
            defaultValue=""
          >
            {fontFamilies.map((f) => (
              <option key={f.value || 'default-font'} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => applyFontSize(e.target.value)}
            className="h-9 rounded-md bg-[#0f0f0f] border border-[#2a2a2a] text-sm text-gray-100 px-2 w-18"
            defaultValue=""
          >
            {fontSizes.map((f) => (
              <option key={f.value || 'default-size'} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-3">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${baseBtn} font-semibold ${editor.isActive('bold') ? 'bg-blue-600 text-white' : ''}`}
            title="Negrito (Ctrl+B)"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${baseBtn} italic ${editor.isActive('italic') ? 'bg-blue-600 text-white' : ''}`}
            title="Italico (Ctrl+I)"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${baseBtn} underline ${editor.isActive('underline') ? 'bg-blue-600 text-white' : ''}`}
            title="Sublinhado (Ctrl+U)"
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${baseBtn} line-through ${editor.isActive('strike') ? 'bg-blue-600 text-white' : ''}`}
            title="Tachado"
          >
            S
          </button>
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className={baseBtn}
            title="Limpar formatacao"
          >
            Limpar
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-3">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${baseBtn} ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : ''}`}
            title="Titulo 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${baseBtn} ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : ''}`}
            title="Titulo 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${baseBtn} ${editor.isActive('paragraph') ? 'bg-blue-600 text-white' : ''}`}
            title="Paragrafo"
          >
            P
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-3">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${baseBtn} ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : ''}`}
            title="Lista com marcadores"
          >
            Lista
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${baseBtn} ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : ''}`}
            title="Lista numerada"
          >
            1.
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-3">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Alinhar a esquerda"
          >
            Esq
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Centralizar"
          >
            Ctr
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Alinhar a direita"
          >
            Dir
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Justificar"
          >
            Just
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-3 ml-auto">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Desfazer (Ctrl+Z)"
          >
            Desfazer
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Refazer (Ctrl+Y)"
          >
            Refazer
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
      <style jsx global>{`
        .ProseMirror p {
          margin: 0 !important;
          line-height: 1.15;
        }
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3 {
          margin: 6px 0 2px 0 !important;
          line-height: 1.2;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 2px 0 !important;
          padding-left: 18px;
        }
      `}</style>
    </div>
  )
}

export default ReportEditor
