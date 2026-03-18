"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImagePlus,
  Heading1,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { uploadEditorImage } from "@/services/imageService";
import { richTextEditor as labels } from "@/data/labels";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled = false,
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInternalChange = useRef(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || labels.placeholder,
      }),
    ],
    content: value,
    immediatelyRender: false,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      isInternalChange.current = true;
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved || !event.dataTransfer?.files.length) return false;

        const files = Array.from(event.dataTransfer.files).filter((f) =>
          f.type.startsWith("image/")
        );
        if (files.length === 0) return false;

        event.preventDefault();
        files.forEach((file) => handleImageUpload(file));
        return true;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files || []).filter(
          (f) => f.type.startsWith("image/")
        );
        if (files.length === 0) return false;

        event.preventDefault();
        files.forEach((file) => handleImageUpload(file));
        return true;
      },
    },
  });

  // 수정 모드: 외부에서 value가 변경될 때만 에디터에 반영
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    // 에디터 내부 변경이면 setContent 스킵 (undo 히스토리 보존)
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editor.getHTML() === value) return;
    editor.commands.setContent(value);
  }, [editor, value]);

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      try {
        const url = await uploadEditorImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        // api.ts에서 공통 에러 처리
      }
    },
    [editor]
  );

  const handleImageButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => handleImageUpload(file));
      e.target.value = "";
    },
    [handleImageUpload]
  );

  if (!editor) return null;

  return (
    <div
      className={`rounded-md border border-input bg-background ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      {/* 툴바 */}
      <div
        className="flex flex-wrap items-center gap-0.5 border-b border-input p-1"
        role="toolbar"
        aria-label={labels.toolbarLabel}
      >
        {/* 텍스트 서식 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          label={labels.bold}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          label={labels.italic}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          label={labels.underline}
        >
          <UnderlineIcon className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          label={labels.strikethrough}
        >
          <Strikethrough className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 제목 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          label={labels.heading1}
        >
          <Heading1 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          label={labels.heading2}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          label={labels.heading3}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 리스트 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label={labels.bulletList}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label={labels.orderedList}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 정렬 */}
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          active={editor.isActive({ textAlign: "left" })}
          label={labels.alignLeft}
        >
          <AlignLeft className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          active={editor.isActive({ textAlign: "center" })}
          label={labels.alignCenter}
        >
          <AlignCenter className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          active={editor.isActive({ textAlign: "right" })}
          label={labels.alignRight}
        >
          <AlignRight className="size-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* 구분선 */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          label={labels.horizontalRule}
        >
          <Minus className="size-4" />
        </ToolbarButton>

        {/* 이미지 */}
        <ToolbarButton
          onClick={handleImageButtonClick}
          label={labels.insertImage}
        >
          <ImagePlus className="size-4" />
        </ToolbarButton>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handleFileChange}
          aria-label={labels.insertImage}
        />

      </div>

      {/* 에디터 본문 */}
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={`size-8 ${active ? "bg-accent text-accent-foreground" : ""}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}
