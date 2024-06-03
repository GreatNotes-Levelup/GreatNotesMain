import React, { useState } from "react";
import "./styles.css";
import { marked } from "marked";
import { getApiURL } from '../../utils.js';

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

  const handleSave = async () => {
    const content_url = markdownText;

    try {
      let apiURL = getApiURL();
      const response = await fetch(apiURL +'/api/notes/save-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content_url }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Note saved successfully:', result);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return (
    <main id="editor-page">
      <section className="editor-section">
        <button className="save-button" onClick={handleSave}>Save</button>
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
