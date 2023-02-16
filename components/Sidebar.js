import styled from "styled-components";
import { Avatar, IconButton, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, addDoc, query, where } from "firebase/firestore";
import { BiSearchAlt2 } from "react-icons/bi";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user.phoneNumber)
  );
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter a phone number for the user you wish to chat with:"
    );

    if (!input) {
      return null;
    }

    if (
      // EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.phoneNumber
    ) {
      const col = collection(db, "chats");
      addDoc(col, {
        users: [user.phoneNumber, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail) !== undefined
    );
  console.log(user);
  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={() => {
            signOut(auth);
          }}
        />

        <IconsContainer>
          <IconButton>
            <ChatIcon className="icons" />
          </IconButton>

          <IconButton>
            <MoreVertIcon className="icons" />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <BiSearchAlt2 size={22} className="searchIcon" />
        <SearchInput placeholder="Search in Chats" />
      </Search>
      <div
        style={{ display: "flex", justifyContent: "center", padding: "0.5rem" }}
      >
        <button className="newChatButton" onClick={createChat}>
          Start a New Chat
        </button>
      </div>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid #27363e;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 2px;
  margin-left: -1rem;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    color: black;
  }
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  border-radius: 0.3rem;
  height: 2.1rem;
  padding-left: 3rem;
  background-color: #202c33;
  color: var(--primaryFontColor);
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: #202c33;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid #27363e;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
