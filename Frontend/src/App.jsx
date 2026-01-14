import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Prism
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";

// Markdown
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = app;`);

  const [review, setReview] = useState("Click **Review** to get AI feedback 🚀");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setLoading(true);
      setReview("⏳ Reviewing your code...");

      const response = await axios.post(
        "https://ai-powered-code-reviewer-offline.vercel.app/ai/get-review",
        { code },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setReview(response.data);
    } catch (error) {
      setReview(
        "❌ Failed to fetch review.\n\nMake sure backend is live and CORS is enabled."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* LEFT PANEL */}
      <div className="left">
        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={14}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
              backgroundColor: "#020617",
              color: "#e5e7eb",
              height: "100%",
              width: "100%",
              borderRadius: "10px",
            }}
          />
        </div>

        <button className="review" onClick={reviewCode} disabled={loading}>
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <Markdown rehypePlugins={[rehypeHighlight]}>
          {review}
        </Markdown>
      </div>
    </main>
  );
}

export default App;


