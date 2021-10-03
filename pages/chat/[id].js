import styled from "styled-components";
import Head from "next/head";

function Chat() {
  return (
    <Container>
      <Head>
        <title>Chat</title>
      </Head>

      <h1>This is a chat</h1>
    </Container>
  );
}

const Container = styled.div``;

export default Chat;
