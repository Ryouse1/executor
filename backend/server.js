import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { LANGUAGE_IMAGE } from "./languages.js";

const app = express();
app.use(cors());
app.use(express.json());

// フロント配信
app.use(express.static(path.join(__dirname, "../frontend")));

app.post("/run/:lang", (req, res) => {
  const lang = req.params.lang;
  const code = req.body.code;

  if (!LANGUAGE_IMAGE[lang]) return res.json({ output: "Unsupported language" });

  const filename = `temp_${Date.now()}`;
  const fileExt = lang === "python" ? "py" :
                  lang === "javascript" ? "js" :
                  lang === "cpp" ? "cpp" : "txt";
  fs.writeFileSync(`${filename}.${fileExt}`, code);

  const cmd = `docker run --rm -v ${process.cwd()}:${process.cwd()} -w ${process.cwd()} ${LANGUAGE_IMAGE[lang]} ${lang === "python" ? `python3 ${filename}.py` :
             lang === "javascript" ? `node ${filename}.js` :
             lang === "cpp" ? `bash -c "g++ ${filename}.cpp -o ${filename} && ./${filename}"` :
             `cat ${filename}.${fileExt}`}`;

  exec(cmd, { timeout:5000 }, (err, stdout, stderr) => {
    try { fs.unlinkSync(`${filename}.${fileExt}`) } catch {}
    if (err) return res.json({ output: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
