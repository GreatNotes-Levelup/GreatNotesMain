import { getApiURL } from '../utils.js';

const createNote = async (formData)=>{
    try {
        const response =  await fetch(getApiURL()+'/api/notes/create-note', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...formData, content:`# Start **writing** `}),
        });
        return response.json();
      } catch (error) {
        console.error('Error:', error);
      }
}

const getNoteByUser=async()=>{
  try {
    const response =  await fetch(getApiURL()+'/api/notes/all-user-notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

export {createNote,getNoteByUser}
