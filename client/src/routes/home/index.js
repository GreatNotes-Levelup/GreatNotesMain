import './styles.css';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect  } from 'react';
import { UserContext } from '../../components/UserContext.js';

const Home = () => {
  const { currentUser, _, removeCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(()=>{
    if(currentUser){
      navigate('/dashboard');
    }
    return;
  },[]);

  return (
    <main id="home-page">
      <h1>GreatNotes</h1>
      <h4>For <u>all</u> your note-taking needs</h4>
    </main>
  )
}

export default Home;