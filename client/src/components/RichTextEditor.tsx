import React, { useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { Button } from '@/components/ui/button';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b mb-4">
      <Button
        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="font-bold"
      >
        H1
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="font-bold"
      >
        H2
      </Button>
      <Button
        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className="font-bold"
      >
        H3
      </Button>
      <Button
        variant={editor.isActive('paragraph') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        Para
      </Button>
      <Button
        variant={editor.isActive('bold') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="font-bold"
      >
        B
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="italic"
      >
        I
      </Button>
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </Button>
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'outline'}
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </Button>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <div className="p-4">
        <EditorContent 
          editor={editor} 
          className="min-h-[200px] prose prose-sm max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;