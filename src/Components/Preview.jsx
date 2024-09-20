import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Preview() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [activeEditor, setActiveEditor] = useState(""); // Keeps track of which editor is active

  return (
    <>
      {/* Title Input */}
      {activeEditor === "title" ? (
        <ReactQuill
          theme="snow"
          value={title}
          onChange={setTitle}
          onBlur={() => setActiveEditor("")} // Reset active editor when losing focus
        />
      ) : (
        <input
          type="text"
          className="border-black border-2 rounded-xl"
          placeholder="Click to edit title"
          value={title}
          onFocus={() => setActiveEditor("title")}
          readOnly
        />
      )}

      {/* Description Input */}
      {activeEditor === "description" && (
        <ReactQuill
          theme="snow"
          value={description}
          onChange={setDescription}
          onBlur={() => setActiveEditor("")} // Reset active editor when losing focus
        />
      )}
      <textarea
        className="border-black border-2px rounded-lg"
        cols={20}
        rows={5}
        placeholder="Click to edit description"
        value={description}
        onFocus={() => setActiveEditor("description")}
        readOnly
      ></textarea>
    </>
  );
}
