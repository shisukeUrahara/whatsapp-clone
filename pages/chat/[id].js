import styled from "styled-components";
import Head from "next/head";
import ChatScreen from "../../Components/ChatScreen";
import Sidebar from "../../Components/Sidebar";
import { db, auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getRecipientEmail } from "../../utils/utils";

function Chat({ chat, messages }) {
  const [user] = useAuthState(auth);

  return (
    <Container>
      <Head>
        <title>Chat With {getRecipientEmail(chat.users, user)}</title>
      </Head>

      <Sidebar></Sidebar>

      <ChatContainer>
        <ChatScreen chat={chat} messages={messages}></ChatScreen>
      </ChatContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;
  /* removing the scrollbar */

  ::-webkit-scrollbar {
    display: none;
  }

  -ms--ms-overflow-style: none; /* IE and edge */
  scrollbar-width: none; /* firefox */
`;

export async function getServerSideProps(context) {
  // getting reference to chat collection
  const ref = await db.collection("chats").doc(context.query.id);

  // PREPPING THE MESSAGES ON THE SERVER
  const chatResponse = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  const messages = chatResponse.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((messages) => ({
      ...messages,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  //  PREPPING THE MESSAGES
  const chatRes = await ref.get();
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

export default Chat;
