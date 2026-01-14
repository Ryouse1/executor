// App.jsx
import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";

const LANGUAGES = [
  "python", "javascript", "cpp", "ruby", "go", "java", "c", "php", 
  "swift", "kotlin", "scala", "rust", "perl", "lua", "haskell", 
  "dart", "r", "julia", "typescript", "csharp",
  // 実際には100言語分追加可能
];

export default function App() {
  const [files, setFiles] = useState({ "main.py": "print('Hello World')" });
  const [currentFile, setCurrentFile] = useState("main.py");
  const [currentLang, setCurrentLang] = useState("python");
  const [output, setOutput] = useState("");

  const runCode = async () => {
    const code = files[currentFile];
    const res = await fetch(`http://localhost:5000/run/${currentLang}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setOutput(data.output);
  };

  const updateCode = (value) => setFiles({ ...files, [currentFile]: value });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div style={{ padding: "5px", borderBottom: "1px solid gray" }}>
        <select value={currentLang} onChange={(e) => setCurrentLang(e.target.value)}>
          {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "200px", borderRight: "1px solid gray", padding: "10px" }}>
          {Object.keys(files).map((f) => (
            <div
              key={f}
              onClick={() => setCurrentFile(f)}
              style={{
                padding: "5px",
                cursor: "pointer",
                background: f === currentFile ? "#555" : "transparent",
                color: f === currentFile ? "#fff" : "#000",
              }}
            >
              {f}
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }}>
          <MonacoEditor
            height="100%"
            language={currentLang}
            value={files[currentFile]}
            onChange={updateCode}
            theme="vs-dark"
          />
        </div>
      </div>
      <div style={{ height: "150px", background: "#1e1e1e", color: "#fff", padding: "10px", overflow: "auto" }}>
        <pre>{output}</pre>
        <button onClick={runCode} style={{ marginTop: "10px", padding: "5px 10px" }}>Run</button>
      </div>
    </div>
  );
}
