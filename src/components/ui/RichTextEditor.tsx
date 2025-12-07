/**
 * Rich Text Editor - Tiptap
 * Version: v1.2 - SSR Safe con immediatelyRender
 */

'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Quote
} from 'lucide-react';
import { useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Escribe aquí...',
  readOnly = false,
  minHeight = '300px',
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // ✅ AGREGADO: Evita SSR hydration mismatch
    extensions: [
      StarterKit. configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 dark:text-blue-400',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: ! readOnly,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none dark:prose-invert p-4`,
        style: `min-height: ${minHeight}`,
      },
    },
  });

  const addLink = useCallback(() => {
    if (! editor) return;

    const previousUrl = editor.getAttributes('link'). href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().extendMarkRange('link'). unsetLink().run();
      return;
    }

    editor.chain(). focus().extendMarkRange('link').setLink({ href: url }). run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt('URL de la imagen:');

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
        <div className="flex gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
          {[... Array(10)].map((_, i) => (
            <div key={i} className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
          ))}
        </div>
        <div className="p-4" style={{ minHeight }}>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        {/* Headings */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }). run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Título 1"
        >
          <Heading1 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={() => editor. chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Título 2"
        >
          <Heading2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Format */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Negrita"
        >
          <Bold className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus(). toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Cursiva"
        >
          <Italic className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Lista con viñetas"
        >
          <List className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Lista numerada"
        >
          <ListOrdered className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Cita"
        >
          <Quote className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Link & Image */}
        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
            editor. isActive('link') ? 'bg-gray-300 dark:bg-gray-600' : ''
          }`}
          title="Insertar enlace"
        >
          <LinkIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          title="Insertar imagen"
        >
          <ImageIcon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Undo/Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Deshacer"
        >
          <Undo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo(). run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Rehacer"
        >
          <Redo className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}