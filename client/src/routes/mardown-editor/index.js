import React, { useState } from "react";
import "./styles.css";
import { marked } from "marked";

const defaultMarkdown = `
# Welcome to Great Note!

## Introduction

Great Note is your ultimate platform for organizing your thoughts, ideas, and tasks efficiently. With its intuitive interface and powerful features, you can take your note-taking experience to the next level.

## Key Features

### Collaboration
+ You can collaborate with colleagues, friends, and family members in real-time, making teamwork seamless and productive.

### Sharing
+ Easily share your notes with others by generating shareable links or inviting them to collaborate directly.

### Incredible Speed
+ Great Note offers lightning-fast performance, ensuring that you can capture your ideas without any delays.

### Top-notch Security
+ Your data security is our top priority. Great Note employs advanced encryption techniques to safeguard your notes and personal information.

## Get Started!

Start using Great Note today and unlock a world of possibilities for organizing and managing your notes effortlessly.
`;

const MarkdownEditor = () => {
  const [markdownText, setMarkdownText] = useState(defaultMarkdown);

  return (
    <main>
      <section className="">
        <textarea
          value={markdownText}
          onChange={(e) => setMarkdownText(e.target.value)}
        />
      </section>
      <article>
        <div className="markdown-body"
        dangerouslySetInnerHTML={{ __html: marked.parse(markdownText) }}></div>
      </article>
    </main>
  );
};

export default MarkdownEditor;
