import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineSend } from "react-icons/ai";
import {
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  Timestamp,
  addDoc,
  where,
} from "firebase/firestore";
import Message from "./Message";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

function Chatscreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null);
  const router = useRouter();
  const [messagesSnapshot] = useCollection(
    query(
      collection(db, `chats/${router.query.id}/messages`),
      orderBy("timestamp", "asc")
    )
  );
  const recipientEmail = getRecipientEmail(chat.users, user);
  const [recipientSnapshot] = useCollection(
    query(collection(db, "users"), where("email", "==", recipientEmail))
  );

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    const docRef = doc(db, `chats/${user.uid}`);
    setDoc(
      docRef,
      {
        lastSeen: Timestamp.now(),
      },
      { merge: true }
    );

    const colRef = collection(db, `chats/${router.query.id}/messages`);
    addDoc(colRef, {
      timestamp: Timestamp.now(),
      message: input,
      user: user.phoneNumber,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  return (
    <Container>
      <Header>
        <Avatar />

        <HeaderInformation>
          <h3>{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p>
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading last active...</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFileIcon className="icons" />
          </IconButton>
          <IconButton>
            <MoreVertIcon className="icons" />
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticonIcon className="icons" />
        </IconButton>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        {/* <EmojiPicker onEmojiClick={input} /> */}
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        {/* <EmojiPicker onEmojiClick={input} /> */}
        {input ? (
          <IconButton>
            <AiOutlineSend
              disabled={!input}
              type="submit"
              onClick={sendMessage}
              className="icons"
            />
          </IconButton>
        ) : (
          <IconButton>
            <MicIcon className="icons" />
          </IconButton>
        )}
        <IconButton>
          <MicIcon className="icons" />
        </IconButton>
      </InputContainer>
    </Container>
  );
}

export default Chatscreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: #202c33;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid #202c33;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: #d1d7db;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.2),
      rgba(0, 0, 0, 0.2)
    ),
    url("https://i.pinimg.com/564x/85/ec/df/85ecdf1c3611ecc9b7fa85282d9526e0.jpg");

  min-height: 90vh;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  background-color: #111b21;
  bottom: 0;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: #202c33;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
  color: #d1d7db;
  font-size:"1.2rem"


  :placeholder {
    font-size:"1.2rem"
    color: #d1d7db;
  }
`;
