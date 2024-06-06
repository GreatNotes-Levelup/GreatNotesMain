import React, { useState, useEffect } from 'react';
import './styles.css';
import { marked } from 'marked';
import { Visibility, Save, Edit, Group } from '@mui/icons-material';
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

const MarkdownEditor = () => {
  const location = useLocation();
  const { response } = location.state;
  const theme = useTheme();
  console.log(theme);

  const { user } = useAuth();
  const [markdownText, setMarkdownText] = useState(response.content);
  const [isPreview, setIsPreview] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const insertTextAtCursor = (text) => {
    if (isPreview) {
      return;
    }
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = markdownText.substring(0, start);
    const after = markdownText.substring(end, markdownText.length);

    setMarkdownText(before + text + after);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length / 2;
      textarea.focus();
    }, 0);
  };

  const makeBold = () => {
    insertTextAtCursor('****');
  };

  const makeItalic = () => {
    insertTextAtCursor('__');
  };

  const makeUnderline = () => {
    insertTextAtCursor('<u></u>');
  };

  const makeStrikethrough = () => {
    insertTextAtCursor('~~');
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
          <Button variant="outlined" onClick={handleOpen}>
            <Group />
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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="Manage Access"
        aria-describedby="Control who access your note"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            borderRadius: '0.5rem',
            boxShadow: 24,
            p: 4,
            color: 'white',
          }}
        >
          <Typography variant="h6" component="h2" align="center" gutterBottom>
            Manage Access
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              className="access-input"
              style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
            >
              <TextField fullWidth label="Email" variant="outlined" />
              <Select
                fullWidth
                value="read only"
                variant="outlined"
                label="Permission"
              >
                <MenuItem value="read only">Read Only</MenuItem>
                <MenuItem value="edit">Edit</MenuItem>
              </Select>
            </div>
            <Button variant="contained">Add</Button>
            <Divider />
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}
            >
              <Typography variant="subtitle1" component="h3">
                Current Access
              </Typography>
              <div className="access-wrapper">
                <Chip label={'arinaomuleluz@gmail@gmail.com'} />
                <Chip label={'arinao@gmail.com'} />
                <Chip label={'arinao@gmail.com'} />
              </div>
            </Box>
          </Box>
        </Box>
      </Modal>
    </main>
  );
};

export default MarkdownEditor;
