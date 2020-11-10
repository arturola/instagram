import React, { useState, useEffect } from 'react'; 
import './App.css';
import Post from './Post';
import './Post.css';
import { auth, db } from './firebase';
import { Modal, makeStyles, Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import './ImageUpload.css'
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({ 
  paper: {
  position: 'absolute',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  border: '2px solid #000',
  boxShadow: theme.shadows[5],
  padding: theme.spacing(2, 4, 3),
},
}));




function App() {
  
  const classes = useStyles(); // The auth Modal needs this.
  const [modalStyle] = useState(getModalStyle);
  
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false); // This is the State that the modal needs to open
  const [openSignIn, setOpenSignIn]= useState(false);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(null); // to keep track of the user and user profile changes.

  useEffect( () => {
    db.collection('posts').orderBy("timestamp", "desc").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data() 
      })));
      }) 
   }, []);// here you put the variable, whose changes will activate the code. if left blank, only runs de code once when loadin the page
  
   useEffect( () => { // In useEffect, the [] is a frontendlistener and the ()=>{}, in this case is a backendlistener
    const unsubscribe = auth.onAuthStateChanged((authUser) => { // authUser is the object that .onAuthStateChaged returns
        if (authUser) {
          // user has logged in..
          console.log(authUser); //This is just to see the login in the inspector
          setUser(authUser);

          if (authUser.displayName) {} // If we have the user display his name
          else {
            return authUser.updateProfile({displayName: username}) // If we don't have the user, create it
          }
        }
        else {
          setUser(null); // user has logged out.
        }
       
      })
        return () => {unsubscribe()};
      
      }, [user,username])

   const signIn = (event) => {
        event.preventDefault(); // if we don't call this, it will refresh when onClick. Meanwhile what we want is to submit when we press Enter.
        auth
          .signInWithEmailAndPassword(email, password)
          .catch((error) => alert(error.message)); // Firebase gives you backend validation, so if email not right, a message pops up atumatically.
          setOpenSignIn(false);
        };
   
   const signUp = (event) => {
        event.preventDefault(); // if we don't call this, it will refresh when onClick. Meanwhile what we want is to submit when we press Enter.
        auth
          .createUserWithEmailAndPassword(email, password)
          .catch((error) => alert(error.message)); // Firebase gives you backend validation, so if email not right, a message pops up atumatically.
          setOpen(false);
        };


  return (
    <div className="app">
        
     
     <Modal
          open={openSignIn} // The Modal needs some kind of state for opening
          onClose={() => setOpenSignIn(false)} // Sets all the clicks around the Modal to false, so it closes the modal.
          >
          <div style={modalStyle} className={classes.paper}>
            <form className='app__signup'>
              <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                />
              </center>
          

              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={ (e) => setEmail(e.target.value)}
              />
            
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={ (e) => setPassword(e.target.value)}
              />

              <Button type='submit' onClick={signIn}>
              Sign In
              </Button>
              
            </form>

    </div>
      </Modal>
     
      <Modal
          open={open} // The Modal needs some kind of state for opening
          onClose={() => setOpen(false)} // Sets all the clicks around the Modal to false, so it closes the modal.
          >
          <div style={modalStyle} className={classes.paper}>
            <form className='app__signup'>
              <center>
              <img 
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
                />
              </center>
              <Input 
                placeholder="username"
                type="text"
                value={username}
                onChange={ (e) => setUsername(e.target.value)}
              /> 

              <Input 
                placeholder="email"
                type="text"
                value={email}
                onChange={ (e) => setEmail(e.target.value)}
              />
            
              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={ (e) => setPassword(e.target.value)}
              />

              <Button type='submit' onClick={signUp}>
              Sign Up
              </Button>
              
            </form>

    </div>
      </Modal>
     

      {/*Header*/}
      <div className="app__header">
        <img className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
          />

          {user ? (<Button onClick={ () => auth.signOut()}>
        Logout</Button>) : (
        
            <div className="app__loginContainer">
            <Button onClick={ () => setOpenSignIn(true) }>Sign In</Button> {/* We'll need another Modal for Signing in*/}
            <Button onClick={ () => setOpen(true) }>Sign Up</Button>
            </div>

        )}    
      </div>
      

      {/*<h1>Instagram</h1>*/}

      
      {/*Posts*/}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({id, post}) => (
            <Post user={user} key={id} postId={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))} {/*el primer termino es el props de Post.js, y el segundo es a lo que tiene que equivaler */}
        </div>
        
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CD_TBICpY0V/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
    

      </div>
    
    <div className="image_upload">
      {user?.displayName? (<ImageUpload username={user.displayName} />): (<h3>Login to upload</h3>)}

    </div>

    </div>

  
  );
}

export default App;
