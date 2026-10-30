import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { FontFamily } from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import "./RichTextEditor.css";

/* Custom font-size support */
const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,

            parseHTML: (element) =>
              element.style.fontSize || null,

            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize })
            .run(),

      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .run(),
    };
  },
});

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
];

const FONTS = [
  "Arial",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
];

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Write your content here...",
}) {
  const [, refreshToolbar] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({
        multicolor: true,
      }),
      TextStyle,
      Color,
      FontSize,
      FontFamily,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value,

    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },

    onTransaction: () => {
      refreshToolbar((previous) => previous + 1);
    },

    editorProps: {
      attributes: {
        class: "rich-text-editor-content",
        spellcheck: "true",
      },
    },
  });

  /* Keep editor content synchronized when loading another record */
  useEffect(() => {
    if (!editor) return;

    const currentContent = editor.getHTML();

    if (value !== currentContent) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) {
    return <div className="rich-editor-loading">Loading editor...</div>;
  }

  const applyLink = () => {
    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter the link URL:", previousUrl);

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  const ToolbarButton = ({
    label,
    action,
    active = false,
    title,
  }) => (
    <button
      type="button"
      className={`rich-editor-button ${active ? "active" : ""}`}
      onClick={action}
      title={title || label}
      aria-label={title || label}
    >
      {label}
    </button>
  );

  return (
    <div className="rich-editor-wrapper">
      <div className="rich-editor-toolbar">

        {/* Text formatting */}
        <div className="rich-toolbar-group">
          <ToolbarButton
            label="B"
            title="Bold"
            active={editor.isActive("bold")}
            action={() => editor.chain().focus().toggleBold().run()}
          />

          <ToolbarButton
            label="I"
            title="Italic"
            active={editor.isActive("italic")}
            action={() => editor.chain().focus().toggleItalic().run()}
          />

          <ToolbarButton
            label="U"
            title="Underline"
            active={editor.isActive("underline")}
            action={() => editor.chain().focus().toggleUnderline().run()}
          />

          <ToolbarButton
            label="S"
            title="Strikethrough"
            active={editor.isActive("strike")}
            action={() => editor.chain().focus().toggleStrike().run()}
          />
        </div>

        {/* Headings */}
        <div className="rich-toolbar-group">
          <select
            aria-label="Heading style"
            value={
              editor.isActive("heading", { level: 1 })
                ? "1"
                : editor.isActive("heading", { level: 2 })
                  ? "2"
                  : editor.isActive("heading", { level: 3 })
                    ? "3"
                    : "paragraph"
            }
            onChange={(event) => {
              const level = event.target.value;

              if (level === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: Number(level) })
                  .run();
              }
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
        </div>

        {/* Font family and size */}
        <div className="rich-toolbar-group">
          <select
            aria-label="Font family"
            defaultValue=""
            onChange={(event) => {
              const font = event.target.value;

              if (font) {
                editor.chain().focus().setFontFamily(font).run();
              }
            }}
          >
            <option value="">Font</option>
            {FONTS.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>

          <select
            aria-label="Font size"
            defaultValue=""
            onChange={(event) => {
              const size = event.target.value;

              if (size) {
                editor.chain().focus().setFontSize(size).run();
              }
            }}
          >
            <option value="">Size</option>
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Text and highlight colours */}
        <div className="rich-toolbar-group rich-color-controls">
          <label title="Text colour">
            <span>A</span>
            <input
              type="color"
              aria-label="Text colour"
              defaultValue="#142536"
              onChange={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
            />
          </label>

          <label title="Highlight colour">
            <span className="highlight-symbol">H</span>
            <input
              type="color"
              aria-label="Highlight colour"
              defaultValue="#fff176"
              onChange={(event) =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: event.target.value })
                  .run()
              }
            />
          </label>
        </div>

        {/* Alignment */}
        <div className="rich-toolbar-group">
          <ToolbarButton
            label="≡"
            title="Align left"
            active={editor.isActive({ textAlign: "left" })}
            action={() =>
              editor.chain().focus().setTextAlign("left").run()
            }
          />

          <ToolbarButton
            label="☷"
            title="Align center"
            active={editor.isActive({ textAlign: "center" })}
            action={() =>
              editor.chain().focus().setTextAlign("center").run()
            }
          />

          <ToolbarButton
            label="≣"
            title="Align right"
            active={editor.isActive({ textAlign: "right" })}
            action={() =>
              editor.chain().focus().setTextAlign("right").run()
            }
          />
        </div>

        {/* Lists */}
        <div className="rich-toolbar-group">
          <ToolbarButton
            label="• List"
            title="Bullet list"
            active={editor.isActive("bulletList")}
            action={() =>
              editor.chain().focus().toggleBulletList().run()
            }
          />

          <ToolbarButton
            label="1. List"
            title="Numbered list"
            active={editor.isActive("orderedList")}
            action={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
          />
        </div>

        {/* Links and other actions */}
        <div className="rich-toolbar-group">
          <ToolbarButton
            label="🔗"
            title="Insert link"
            active={editor.isActive("link")}
            action={applyLink}
          />

          <ToolbarButton
            label="❝"
            title="Blockquote"
            active={editor.isActive("blockquote")}
            action={() =>
              editor.chain().focus().toggleBlockquote().run()
            }
          />

          <ToolbarButton
            label="↶"
            title="Undo"
            action={() => editor.chain().focus().undo().run()}
          />

          <ToolbarButton
            label="↷"
            title="Redo"
            action={() => editor.chain().focus().redo().run()}
          />
        </div>
      </div>

      <EditorContent editor={editor} />

      <div className="rich-editor-footer">
        <span>Rich text editor</span>
        <span>{editor.getText().trim().split(/\s+/).filter(Boolean).length} words</span>
      </div>
    </div>
  );
}