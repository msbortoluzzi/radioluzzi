'use client'

import React from 'react'
import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import Paragraph from '@tiptap/extension-paragraph'

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
      ParagraphWithMeta,
      Placeholder.configure({
        placeholder
      }),
      TextStyle,
      Color,
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

  return (
    <div className="border border-[#222222] rounded-lg bg-[#0f0f0f] text-gray-100">
      <div className="border-b border-[#222222] p-2 flex flex-wrap gap-2 bg-[#161616]">
        <div className="flex gap-1">
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
            title="Itálico (Ctrl+I)"
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
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`${baseBtn} ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : ''}`}
            title="Título 1"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`${baseBtn} ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : ''}`}
            title="Título 2"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${baseBtn} ${editor.isActive('paragraph') ? 'bg-blue-600 text-white' : ''}`}
            title="Parágrafo"
          >
            P
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${baseBtn} ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : ''}`}
            title="Lista com marcadores"
          >
            • Lista
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${baseBtn} ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : ''}`}
            title="Lista numerada"
          >
            1. Lista
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Alinhar à esquerda"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Centralizar"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`${baseBtn} ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-600 text-white' : ''}`}
            title="Alinhar à direita"
          >
            →
          </button>
        </div>

        <div className="flex gap-1 border-l border-[#222222] pl-2 ml-auto">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={`${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Desfazer (Ctrl+Z)"
          >
            ↺ Desfazer
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={`${baseBtn} disabled:opacity-50 disabled:cursor-not-allowed`}
            title="Refazer (Ctrl+Y)"
          >
            ↻ Refazer
          </button>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}

export default ReportEditor
