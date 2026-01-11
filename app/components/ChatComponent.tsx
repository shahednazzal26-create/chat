"use client";

import { useEffect, useState } from "react";
import Talk from "talkjs";

export default function ChatComponent() {
  const [params, setParams] = useState<URLSearchParams | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setParams(searchParams);
  }, []);

  useEffect(() => {
    if (!params) return;

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: params.get("userId")!,
        name: params.get("name")!,
        role: params.get("role")!
      });

      const other = new Talk.User({
        id: params.get("peerId")!,
        name: params.get("peerName")!,
        role: params.get("peerRole")!
      });

      const session = new Talk.Session({
        appId: process.env.NEXT_PUBLIC_TALKJS_APP_ID!,
        me,
      });

      const conversation = session.getOrCreateConversation(
        Talk.oneOnOneId(me, other)
      );

      conversation.setParticipant(me);
      conversation.setParticipant(other);

      const inbox = session.createInbox({ selected: conversation });
      inbox.mount(document.getElementById("chatbox"));
    });
  }, [params]);

  return <div id="chatbox" style={{ height: "100vh" }} />;
}
