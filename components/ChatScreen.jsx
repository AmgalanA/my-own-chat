import { Avatar, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from 'timeago-react';

const ChatScreen = ({ chat, messages }) => {
    const [user] = useAuthState(auth);
    const router = useRouter();

    const [input, setInput] = useState('');
    const endOfMessagesRef = useRef(null);

    const [messagesSnapshot] = useCollection(query(
        collection(
            doc(db, 'chats', router.query.id), 
        'messages'), 
        orderBy('timestamp', 'asc')));

    const [recipientSnapshot] = useCollection(query(collection(db, 'users'), where('email', '==', getRecipientEmail(chat.users, user?.email))));

    const showMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: serverTimestamp(),
                    }}
                />
            ));
        } else {
            return JSON.parse(messages).map(message => (
                <Message 
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ));
            
        }
    };

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const sendMessage = (e) => {
        e.preventDefault();

        // Update the last seen
        setDoc(doc(db, 'users', user.uid), {
            lastSeen: serverTimestamp(), 
        } , {
            merge: true,
        });

        addDoc(collection(db, 'chats', router.query.id, 'messages'), {
            timestamp: serverTimestamp(),
            message: input,
            user: user.email, 
            photoURL: user.photoURL,
        });

        setInput('');
        scrollToBottom();
    };

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(chat.users, user);

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient.photoURL} />
                ) : (   
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                            {recipient?.lastSeen?.toDate() ? (
                                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                            ) : "Unavailable"}                        
                        </p>
                    ) : (
                        <p>Loading Last active</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {/* show messages */}
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef} />
            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon />
                <Input placeholder="Enter a message" value={input} onChange={e => setInput(e.target.value)} />
                
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: -10px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div`
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;

const Input = styled.input`
    flex: 1;
    align-items: center;
    padding:10px;
    position: sticky;
    bottom: 0;
    background-color: whitesmoke;
    z-index: 100;
    border: none;
    outline: none;
    border-radius: 5px;
`;