"use client";

import { useEffect, useState } from "react";
import Talk from "talkjs";

export default function ChatComponent() {
  const [ready, setReady] = useState(false);
  const [params, setParams] = useState<{ userId: string; name: string; role: string; peerId: string; peerName: string; peerRole: string } | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("userId");
    const name = searchParams.get("name");
    const role = searchParams.get("role");
    const peerId = searchParams.get("peerId");
    const peerName = searchParams.get("peerName");
    const peerRole = searchParams.get("peerRole");

    if (userId && name && role && peerId && peerName && peerRole) {
      setParams({ userId, name, role, peerId, peerName, peerRole });
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || !params) return;

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: params.userId,
        name: params.name,
        role: params.role,
      });

      const other = new Talk.User({
        id: params.peerId,
        name: params.peerName,
        role: params.peerRole,
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
  }, [ready, params]);

  if (!ready) return <div style={{ padding: "2rem", textAlign: "center" }}>Loading chat...</div>;

  return <div id="chatbox" style={{ height: "100vh" }} />;
}
