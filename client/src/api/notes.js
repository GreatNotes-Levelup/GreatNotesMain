import { getApiURL } from '../utils.js';

const createNote = async (user, formData)=>{
    try {
        const response =  await fetch(getApiURL()+'/api/notes/create-note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.access_token
          },
          body: JSON.stringify({...formData, content:`# Start **writing** `}),
        });
        return response.json();
      } catch (error) {
        console.error('Error:', error);
      }
}

const getNoteByUser = async (user, limit, offset) => {
  try {
    const response = await fetch(`${getApiURL()}/api/notes/all-user-notes?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token,
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
};


const getSharedNoteByUser=async(user)=>{
  try {
    const response =  await fetch(getApiURL()+'/api/notes//shared-notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

const saveNote = async(user, id,title,description, content)=>{
  try {
    const response =  await fetch(getApiURL()+`/api/notes/update-note/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token
      },
      body: JSON.stringify({title:title, description:description, content:content}),
    });
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

const deleteNote = async(user, id)=>{
  try {
    const response =  await fetch(getApiURL()+`/api/notes/delete-note/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.access_token
      },
    });
    if(response.status===204){
      return;
    }else{
      throw new Error("unable to delete note");
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

export {createNote,getNoteByUser, saveNote, getSharedNoteByUser, deleteNote}
