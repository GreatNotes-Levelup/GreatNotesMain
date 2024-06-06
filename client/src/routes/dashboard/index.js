import React, { useEffect, useState } from 'react';
import './styles.css';
import {
  CircularProgress,
  FormHelperText,
  IconButton,
  LinearProgress,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { AddCircle, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton/index.js';
import { createNote, getNoteByUser, deleteNote } from '../../api/notes.js';
import useAuth from '../../components/UserContext.js';

const clipString = (str, limit) => {
  if (!str) return '';
  return str.length > limit ? `${str.substring(0, limit - 3)}...` : str;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
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
  const handleOpenDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
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

  const handleDeleteNote = async () => {
    setIsDeleting(true);
    try {
      await deleteNote(user, noteToDelete.note_id); // Delete note by its ID
      setMyNotes(
        myNotes.filter((note) => note.note_id !== noteToDelete.note_id)
      ); // Remove the deleted note from state
      setIsDeleting(false);
      handleCloseDeleteDialog(); // Close the delete dialog after successful deletion
    } catch (e) {
      setIsDeleting(false);
      alert(e.message);
    }
  };

  const handleConfirmDelete = (note) => {
    setNoteToDelete(note); // Set the note to delete
    handleOpenDeleteDialog(); // Open the delete dialog for confirmation
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const [myNotes, setMyNotes] = useState([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const retrieveNotes = () => {
    if (isFetching || !hasMore) return;
    setIsFetching(true);
    getNoteByUser(user, limit, offset)
      .then((notes) => {
        setMyNotes((prevNotes) => [...prevNotes, ...notes]);
        setIsFetching(false);
        if (notes.length < limit) {
          setHasMore(false);
        }
      })
      .catch(() => {
        setIsFetching(false);
      });
  };

  const loadMoreNotes = () => {
    if (!isFetching && hasMore) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  useEffect(() => {
    retrieveNotes();
  }, [offset]);

  return (
    <main id="dashboard">
      {isDeleting && <LinearProgress style={{ width: '100%' }} />}
      <h1>My Notes</h1>
      <section className="notes-section">
        {isFetching && myNotes.length === 0 ? (
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
            {myNotes.map((item, index) => (
              <div
                onClick={() => {
                  if (!isDeleting)
                    navigate('/editor', { state: { response: item } });
                }}
                className="card"
                key={index}
              >
                <h3>{`${clipString(item.title, 13)}`}</h3>
                <div className="description">
                  {`${clipString(item.description, 40)}`}
                </div>
                <div className="bottom">
                  <time dateTime={`${formatDate(item.updated_at)}`}>
                    {`${formatDate(item.updated_at)}`}
                  </time>
                  <IconButton
                    color="error"
                    disabled={isDeleting}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleConfirmDelete(item); 
                    }}
                  >
                    <Delete />
                  </IconButton>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="load-more">
                <LoadingButton
                  onClick={loadMoreNotes}
                  variant="contained"
                  color="primary"
                  loading={isFetching}
                  disabled={isFetching}
                >
                  Load More
                </LoadingButton>
              </div>
            )}
          </>
        )}
      </section>

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
            {formData.title.trim().length === 25
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
            {formData.description.trim().length === 100
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
            variant="text"
          >
            Create
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
          },
        }}
      >
        <DialogTitle>Delete note?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isDeleting} onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <LoadingButton
            disabled={isDeleting}
            loading={isDeleting}
            type="submit"
            variant="text"
            onClick={()=>handleDeleteNote(noteToDelete)}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </main>
  );
};

export default Dashboard;
