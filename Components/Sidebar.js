import styled from "styled-components";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import LogOut from "@material-ui/icons/ExitToAppSharp";

import MoreVerticon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatSnapshot] = useCollection(userChatRef);

  const createNewChat = async () => {
    const input = prompt(
      "Please enter the email address of user you want to chat with."
    );

    if (!input) {
      return null;
    }

    if (
      EmailValidator.validate(input) &&
      input != user.email &&
      !doesChatAlreadyExists(input)
    ) {
      // if email is valid , check if user already exists
      await db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const logout = async () => {
    auth.signOut();
  };

  const doesChatAlreadyExists = (receiverEmail) => {
    return !!chatSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === receiverEmail)
    );
  };

  return (
    <Container>
      {/* header */}
      <Header>
        {user && user.photoURL ? (
          <UserAvatar src={user.photoURL}> </UserAvatar>
        ) : (
          <UserAvatar>{user.email[0]}</UserAvatar>
        )}
        <IconsContainer>
          <IconButton>
            {" "}
            <ChatIcon />
          </IconButton>

          <IconButton onClick={logout}> {<LogOut />}</IconButton>

          <IconButton>
            {" "}
            <MoreVerticon />
          </IconButton>
        </IconsContainer>
      </Header>

      {/* searchbar */}
      <Search>
        <SearchIcon></SearchIcon>
        <SearchInput placeholder="Search in chats" />{" "}
      </Search>

      {/* sidebar button */}
      <SideBarButton onClick={createNewChat}>START A NEW CHAT</SideBarButton>

      {/* chat list */}
      {chatSnapshot?.docs.map((chat, index) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; // IE and edge
  scrollbar-width: none; // firefox
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const Search = styled.div`
  display: flex;
  padding: 20px;
  align-items: center;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  /* background-color: blue; */
`;

const SideBarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
