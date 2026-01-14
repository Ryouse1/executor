// server.js
import express from "express";
import cors from "cors";
import { exec } from "child_process";
import fs from "fs";
import { LANGUAGE_IMAGE } from "./languages.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/run/:lang", (req, res) => {
  const lang = req.params.lang;
  const code = req.body.code;

  if (!LANGUAGE_IMAGE[lang]) return res.json({ output: "Unsupported language" });

  const filename = `temp_${Date.now()}`;
  let fileExt = lang;
  if (lang === "python") fileExt = "py";
  else if (lang === "javascript" || lang === "typescript") fileExt = "js";
  else if (lang === "cpp" || lang === "c") fileExt = lang;
  else fileExt = "txt";

  fs.writeFileSync(`${filename}.${fileExt}`, code);

  let cmd = "";
  if (lang === "python") cmd = `docker run --rm -v ${process.cwd()}:${process.cwd()} -w ${process.cwd()} ${LANGUAGE_IMAGE[lang]} python3 ${filename}.py`;
  else if (lang === "javascript") cmd = `docker run --rm -v ${process.cwd()}:${process.cwd()} -w ${process.cwd()} ${LANGUAGE_IMAGE[lang]} node ${filename}.js`;
  else if (lang === "cpp") cmd = `docker run --rm -v ${process.cwd()}:${process.cwd()} -w ${process.cwd()} ${LANGUAGE_IMAGE[lang]} bash -c "g++ ${filename}.cpp -o ${filename} && ./${filename}"`;
  else cmd = `docker run --rm -v ${process.cwd()}:${process.cwd()} -w ${process.cwd()} ${LANGUAGE_IMAGE[lang]} cat ${filename}.${fileExt}`;

  exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
    try { fs.unlinkSync(`${filename}.${fileExt}`) } catch {}
    if (err) return res.json({ output: stderr || err.message });
    res.json({ output: stdout });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
