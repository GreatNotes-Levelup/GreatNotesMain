import React, { useState, useEffect } from 'react';
import './styles.css';
import { marked } from 'marked';
import { Visibility, Save, Edit, Download } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { saveNote } from '../../api/notes.js';
import {
  Divider,
  IconButton,
  Button,
  Modal,
  Typography,
  Box,
  TextField,
  Select,
  Chip,
  MenuItem,
  CircularProgress,
  useTheme,
} from '@mui/material';
import useAuth from '../../components/UserContext.js';
import DOMPurify from 'dompurify';
import jsPDF from 'jspdf';
import axios from 'axios';
import html2canvas from 'html2canvas';

const MarkdownEditor = () => {
  const location = useLocation();
  const { response } = location.state;
  const theme = useTheme();
  console.log(theme);

  const { user } = useAuth();
  const [markdownText, setMarkdownText] = useState(response.content);
  const [isPreview, setIsPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsSDownloading] = useState(false);

  const insertTextOnEitherSideOfCursor = (textbefore, textafter) => {
    if (isPreview) {
      return;
    }
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = markdownText.substring(0, start);
    const after = markdownText.substring(end, markdownText.length);
    const selection = markdownText.substring(start, end);

    setMarkdownText(before + textbefore + selection + textafter + after);
    setTimeout(() => {
      textarea.selectionStart = start + textbefore.length;
      textarea.selectionEnd = textarea.selectionStart + selection.length;
      textarea.focus();
    }, 0);
  };

  const makeBold = () => {
    insertTextOnEitherSideOfCursor('**', '**');
  };

  const makeItalic = () => {
    insertTextOnEitherSideOfCursor('_', '_');
  };

  const makeUnderline = () => {
    insertTextOnEitherSideOfCursor('<u>', '</u>');
  };

  const makeStrikethrough = () => {
    insertTextOnEitherSideOfCursor('~', '~');
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveNote(
      user,
      response['note_id'],
      response.title,
      response.description,
      markdownText
    );
    setIsSaving(false);
  };

  const handleDownloadPDF = async () => {
    setIsSDownloading(true);
    const sanitizedContent = DOMPurify.sanitize(marked.parse(markdownText));
    const cssUrl =
      'https://cdn.jsdelivr.net/npm/github-markdown-css@5.5.1/github-markdown.min.css';
    const { data: css } = await axios.get(cssUrl);
    const htmlContent = `
      <style>
        ${css}
        .pdf-container {
          padding: 20px; /* Adjust the padding value as needed */
        }
      </style>
      <div class="pdf-container">
        <div class="markdown-body">
          ${sanitizedContent}
        </div>
      </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    document.body.appendChild(tempDiv);
    html2canvas(tempDiv.querySelector('.pdf-container')).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 20, 20, pdfWidth, pdfHeight);
      pdf.save(`${response.title}.pdf`);
      document.body.removeChild(tempDiv);
      setIsSDownloading(false);
    });
  };
  
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        setIsPreview(false);
      }
    };
    checkScreenSize();
    const resizeListener = () => {
      checkScreenSize();
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  return (
    <main id="editor-page">
      <section className="editing-section">
        <div className="tool-bar">
          <div className="text-controls">
            {isSaving ? (
              <CircularProgress color="success" />
            ) : (
              <IconButton
                onClick={handleSave}
                sx={{ color: theme.palette.primary.main }}
              >
                <Save />
              </IconButton>
            )}
            <IconButton onClick={makeBold}>
              <strong>B</strong>
            </IconButton>
            <IconButton onClick={makeItalic}>
              <em>I</em>
            </IconButton>
            <IconButton onClick={makeUnderline}>
              <u>U</u>
            </IconButton>
            <IconButton onClick={makeStrikethrough}>
              <s>S</s>
            </IconButton>
            <IconButton
              onClick={() => setIsPreview(!isPreview)}
              className="preview-button"
            >
              {isPreview ? <Edit /> : <Visibility />}
            </IconButton>
          </div>
          <Button
            disabled={isDownloading}
            variant="outlined"
            onClick={handleDownloadPDF}
          >
            {isDownloading ? <CircularProgress /> : <Download />}
          </Button>
        </div>

        <Divider style={{ backgroundColor: 'slategray' }} />
        {isPreview ? (
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked.parse(markdownText)),
            }}
          ></article>
        ) : (
          <textarea
            autoFocus
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
          />
        )}
      </section>
      {!isPreview && (
        <article
          className="markdown-body"
          id="preview"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked.parse(markdownText)),
          }}
        ></article>
      )}
    </main>
  );
};

export default MarkdownEditor;
