import React from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";

import { getRecipientEmail } from "../utils/utils";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

function Chat({ id, users }) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const recipientEmail = getRecipientEmail(users, user);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", recipientEmail)
  );

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const enterChat = async () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient && recipient.photoURL ? (
        <UserAvatar src={recipient.photoURL}> </UserAvatar>
      ) : (
        <UserAvatar>{recipientEmail[0]}</UserAvatar>
      )}
      <h1> {recipientEmail}</h1>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  word-break: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;

const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
  color: red;

  :hover {
    opacity: 0.6;
  }
`;

export default Chat;
