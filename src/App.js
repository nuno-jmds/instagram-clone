import React ,{useState, useEffect}from 'react';
import './App.css';
import Post from './Post';
import {db, auth} from './firebase'
import Modal from '@material-ui/core/Modal';
import { Button, IconButton, Input, SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ImageUpload from './ImageUpload'
import NearMeIcon from '@material-ui/icons/NearMe';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

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
  paper2: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open, setOpen] =useState(false);
  const [newPost,setnewPost]=useState(false);
  const [openSignIn, setOpenSignIn]=useState(false);
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [user,setUser]=useState(null);
  useEffect(() => {
   const unsubscribe= auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        //user has logged in
        console.log(authUser);
        setUser(authUser);
        
      }else{
        //user has logged out
        setUser(null);
      }

      return ()=>{unsubscribe()}
    })
  }, [user,username]);
  useEffect(() => {
    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({id: doc.id ,data:doc.data() })));
      setnewPost(false);
    }); //doc=[id, data=[username,imageURL,caption,timestamp]]
  }, []);

  const signUp=(event)=>{
    event.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser=>{
     return authUser.user.updateProfile({displayName:username})
    }))
    .catch((error)=>alert(error.message));
    setOpen(false);
  }

  const signIn=(event)=>{
    event.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((error)=>alert(error.message));
    setOpenSignIn(false);
  }

  return (

    

    <div className="app">
      
      {/**Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />



        {user ? (

          
          <div className="app__newPost"> 
          
          <div className="app__newPostTooltip">
          
            <Tooltip title="Add" aria-label="add">
              <Fab onClick={()=>setnewPost(true)}>
                <AddIcon />
              </Fab>
            </Tooltip>
            </div>
            <Button onClick={()=>auth.signOut()}>Logout</Button>
       
          </div>
          

        ):(
          <div>
            <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={()=>setOpen(true)}>Sign Up</Button>
          </div>
        )
        }
      </div>
        
      {/**Posts */}
      <div className="app__posts">
        
        <div className="app__postsleft">
          {posts.map(post=>(<Post key={post.id} postId={post.id} user={user} username={post.data.username} imageUrl={post.data.imageUrl} caption={post.data.caption}/>))}
        </div>

        <div className="app__postsright">
        <InstagramEmbed
          url='https://www.instagram.com/p/CD9k15lgMhq/'
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






      {/**Modals */}


      <Modal
        open={open}
        onClose={()=>setOpen(false)}>
        
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input placeholder="username" type="text" value={username} onChange={(e)=>setUsername(e.target.value)}>
            </Input>
            <Input placeholder="e-mail" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}>
            </Input>
            <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>



      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}>
        
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>
            <Input placeholder="e-mail" type="text" value={email} onChange={(e)=>setEmail(e.target.value)}>
            </Input>
            <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}>
            </Input>
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={newPost}
        onClose={()=>setnewPost(false)}>
        
        <div style={modalStyle} className={classes.paper2}>
          <form >
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />
            </center>

            {user?.displayName?(
        <ImageUpload username={user.displayName}></ImageUpload>
      ):(<></>)}
            
          </form>
        </div>
      </Modal>


    </div>
  )
}

export default App;
