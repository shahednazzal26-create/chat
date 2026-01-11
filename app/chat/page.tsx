"use client";
import { useEffect } from "react";
import Talk from "talkjs";
import { useSearchParams } from "next/navigation";

export default function ChatPage() {
  const params = useSearchParams();

  useEffect(() => {
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
  }, []);

  return <div id="chatbox" style={{ height: "100vh" }} />;
}
