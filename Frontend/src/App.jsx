import { useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";

// Prism editor
import "prismjs/themes/prism.css";
import "prismjs/components/prism-javascript";

// Markdown render
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import axios from "axios";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

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

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      setReview("⚠️ Please enter some code to review.");
      return;
    }

    try {
      setLoading(true);
      setReview("");

      const response = await axios.post(
        `${API_URL}/ai/get-review`,
        { code }
      );

      // backend may return string or { review }
      setReview(response.data.review || response.data);
    } catch (error) {
      console.error(error);
      setReview("❌ Failed to get AI review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      {/* LEFT : CODE EDITOR */}
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

        <button
          className="review"
          onClick={reviewCode}
          disabled={loading}
        >
          {loading ? "Reviewing..." : "Review"}
        </button>
      </div>

      {/* RIGHT : AI REVIEW */}
      <div className="right">
        {review ? (
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        ) : (
          <p className="placeholder">
            AI review will appear here...
          </p>
        )}
      </div>
    </main>
  );
}

export default App;

