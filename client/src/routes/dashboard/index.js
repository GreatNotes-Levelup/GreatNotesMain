import React, { useEffect, useState } from 'react';
import './styles.css';
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { AddCircle, Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import { Dialog } from '@mui/material';
import { DialogActions } from '@mui/material';
import { DialogContent } from '@mui/material';
import { DialogContentText } from '@mui/material';
import { DialogTitle } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton/index.js';
import {
  createNote,
  getNoteByUser,
  getSharedNoteByUser,
  deleteNote,
} from '../../api/notes.js';
import useAuth from '../../components/UserContext.js';

const clipString = (str, limit) => {
  if (!str) return '';
  return str.length > limit ? `${str.substring(0, limit - 3)}...` : str;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrors({ title: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    let isValid = true;
    const newErrors = { title: '', description: '' };

    if (formData.title.trim() === '') {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (formData.description.trim() === '') {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      setIsCreating(true);
      try {
        const response = await createNote(user, formData);
        setIsCreating(false);
        navigate('/editor', { state: { response } });
      } catch (e) {
        setIsCreating(false);
        alert(e.message);
      }
    }
  };

  const handleDeleteNote = async (noteId) => {
    setIsDeleting(true);
    try {
      await deleteNote(user, noteId);
      setMyNotes(myNotes.filter((note) => note['note_id'] !== noteId));
      setIsDeleting(false);
    } catch (e) {
      setIsDeleting(false);
      alert(e.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const [myNotes, setMyNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);

  const retrieveNotes = () => {
    setIsRetrieving(true);
    getNoteByUser(user).then((notes) => {
      setMyNotes(notes);
      setIsRetrieving(false);
    });
    getSharedNoteByUser(user).then((notes) => {
      setSharedNotes(notes);
    });
  };

  useEffect(retrieveNotes, []);
  return (
    <main id="dashboard">
      {isDeleting && <LinearProgress style={{ width: '100%' }} />}
      <h1>My Notes</h1>
      <section className="notes-section">
        {isRetrieving ? (
          <CircularProgress />
        ) : (
          <>
            <Button
              sx={{ borderRadius: '1rem', minHeight: '10rem' }}
              variant="outlined"
              onClick={handleClickOpen}
            >
              <AddCircle />
              <h3> New note</h3>
            </Button>
            {myNotes.map((item) => {
              return (
                <div
                  onClick={() => {
                    if (!isDeleting)
                      navigate('/editor', { state: { response: item } });
                  }}
                  className="card"
                  key={item['note_id']}
                >
                  <h3>{`${clipString(item.title, 13)}`}</h3>
                  <div className="description">
                    {`${clipString(item.description, 40)}`}
                  </div>
                  <div className="bottom">
                    <time
                      datetime={`${formatDate(item.updated_at)}`}
                    >{`${formatDate(item.updated_at)}`}</time>
                    <IconButton
                      color="error"
                      disabled={isDeleting}
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDeleteNote(item['note_id']);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </section>

      <h1>Shared with me</h1>
      {sharedNotes.length > 0 ? (
        <section className="notes-section">
          {sharedNotes.map((item) => {
            return (
              <div
                onClick={() =>
                  navigate('/editor', { state: { response: item } })
                }
                className="card"
                key={item['note_id']}
              >
                <h3>{`${item.title}`}</h3>
                <p>{item.description}</p>
                <div className="bottom">
                  <time
                    datetime={`${formatDate(item.updated_at)}`}
                  >{`${formatDate(item.updated_at)}`}</time>
                  <IconButton
                    color="primary"
                    onClick={() => navigate('/editor', { state: { item } })}
                  >
                    <Edit />
                  </IconButton>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <p>{'Nothing shared with you yet:)'}</p>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            handleSubmit();
          },
        }}
      >
        <DialogTitle>Create a New Note</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide the details for your new note.
          </DialogContentText>
          <TextField
            inputProps={{ maxLength: 25 }}
            autoFocus
            error={!!errors.title}
            helperText={errors.title}
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
          />
          <FormHelperText>
            {formData.title.trim().length == 25
              ? 'Character limit reached 25/25'
              : ''}
          </FormHelperText>
          <TextField
            inputProps={{ maxLength: 100 }}
            error={!!errors.description}
            helperText={errors.description}
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={handleInputChange}
          />
          <FormHelperText>
            {formData.description.trim().length == 100
              ? 'Character limit reached 100/100'
              : ''}
          </FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isCreating} onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            disabled={isCreating}
            loading={isCreating}
            type="submit"
            variant="contained"
            color="primary"
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Dashboard;
