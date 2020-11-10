import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { storage, db } from "./firebase";
//import { firestore } from 'firebase';
import firebase from "firebase";

function ImageUpload({username}) {

    const [caption,setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    
    const handleUpload = () => {
        // Push the shit to Firebase
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
      
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransfered / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            }, 
            (error) => { console.log(error); }, 
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL() // we'll need this so that later our Post appears in the site 
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });
                        
                    });
            } 
        )
        
    }

    return (
        <div>
            {/*I wanna... */}

            {/*Add a Caption*/}
            <input type="text" placeholder="Enter a caption..." value={caption} onChange={ event => setCaption(event.target.value)}/>
           
            {/*Have a file Picker */} 
            <input type="file" onChange={handleChange}/>
            <progress className="imageUpload__progress" value={progress} max="100%"/>
            
            {/*Post my shit online */}
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
