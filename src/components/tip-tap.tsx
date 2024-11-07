"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Bold, ImageIcon, Italic } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

export function RichTextEditor() {
  const [content, setContent] = useState<string>("");
  const { toast } = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none h-80",
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;

        editor.chain().focus().setImage({ src: result }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl border border-[#E7E7E7] rounded-lg">
      <EditorContent
        editor={editor}
        className="border border-[#E7E7E7] w-full h-96 overflow-y-auto"
      />
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-4 py-1">
          <Button
            variant={"ghost"}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <Bold />
          </Button>
          <Button
            variant={"ghost"}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <Italic />
          </Button>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer rounded p-2 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
          >
            <ImageIcon />
          </Label>
        </div>
        <Button
          disabled={!content}
          onClick={() => {
            navigator.clipboard.writeText(content);
            toast({
              description: "copied to clipboard",
            });
          }}
          className="h-12"
          variant={"secondary"}
        >
          Salvar
        </Button>
      </div>
    </div>
  );
}
