'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'

interface ReportEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  editable?: boolean
}

const ReportEditor: React.FC<ReportEditorProps> = ({
  content,
  onChange,
  placeholder = 'Digite ou dite o laudo aqui...',
  editable = true
}) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
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
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[500px] max-w-none p-6 bg-[#0f0f0f] text-gray-100 prose-invert'
      }
    }
  })

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

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
