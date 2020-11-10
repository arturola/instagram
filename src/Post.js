import React, { useState, useEffect } from 'react'
import { Avatar } from '@material-ui/core';
import { db } from './firebase';
import firebase from "firebase";



function Post({ postId, imageUrl, username, caption, user }) {

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    
    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                            .collection("posts")
                            .doc(postId)
                            .collection("comments")
                            .orderBy("timestamp", "asc")
                            .onSnapshot((snapshot) => { 
                                setComments(snapshot.docs.map((doc) => doc.data()));
                            });
        }
        return () => { unsubscribe() };
    }, [postId]);


    const postComment = (event) => {
        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text:comment,
            username:user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }



    return (
        <div className="post">
            <div className="post__header">
                
                {/*Header: Avatar + username */}
                    <Avatar className="post__avatar" alt={username} src="/unnamed.jpg" />
                    <h3>{username}</h3>
            </div>
            
                {/*Image*/}
                    <img className="post__image"  src={ imageUrl } alt=""/>
            
                {/*username + caption */}
                    <h4 className="post__text"><strong>{ username }</strong> { caption }</h4>

                {/*Displaying the comments*/}

                <div className="post__comments">
                        { comments.map( (comment) => (
                            <p>
                            <strong> {comment.username} </strong> {comment.text}
                            </p>
                        )
                        )}
                    </div>
                
                {/*Adding Comments */}
                        
                    { user &&(        
                        <form className="post__commentBox"> 
                            <input className="post__input" 
                                type="text"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}   
                            />
                            <button className="post__button" 
                                    dissable={!comment}
                                    type="submit"
                                    onClick={postComment} 
                            >   Post
                            </button>
                        
                        </form>
                        )}
        </div>
    )
}

export default Post
