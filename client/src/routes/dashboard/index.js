import React from 'react';
import { useState } from 'react';
import './styles.css';
import { IconButton } from '@mui/material';
import { AddCircle, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import {Button} from '@mui/material';
import {TextField} from '@mui/material';
import {Dialog} from '@mui/material';
import {DialogActions} from '@mui/material';
import {DialogContent} from '@mui/material';
import {DialogContentText} from '@mui/material';
import {DialogTitle} from '@mui/material';
import { createNote } from '../../api/notes.js';


const notes = [1, 2, 3, 4, 5, 6, 7, 8];

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    title: '',
    description: ''
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
      [name]: value
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
      const response = await createNote(formData);
      console.table(response);
      navigate('/editor');
    }
  };
  return (
    <main id="dashboard">
      <h1>My Notes</h1>
      <section className="notes-section">
        <Button sx={{borderRadius:"1rem"}} variant="outlined" onClick={handleClickOpen}>
        <AddCircle />
          <h3> New note</h3>
      </Button>
        {notes.map((item) => {
          return (
            <div className="card" key={item}>
              <h3>{`Note ${item}`}</h3>
              <p>
                {
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              </p>
              <div className="bottom">
                <date>2024-05-30</date>
                <IconButton color="primary" onClick={() => navigate('/editor')}>
                  <Edit />
                </IconButton>
              </div>
            </div>
          );
        })}
      </section>

      <h1>Shared with me</h1>
      <section className="notes-section">
        {notes.slice(2, 4).map((item) => {
          return (
            <div className="card" key={item}>
              <h3>{`Note ${item}`}</h3>
              <p>
                {
                  'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
                }
              </p>
              <div className="bottom">
                <date>2024-05-30</date>
                <IconButton>
                  <Edit />
                </IconButton>
              </div>
            </div>
          );
        })}
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
    <TextField
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
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button type="submit" variant="contained" color="primary">Create</Button>
  </DialogActions>
</Dialog>

    </main>
  );
};

export default Dashboard;