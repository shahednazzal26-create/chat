"use client";

import dynamic from "next/dynamic";

const ChatComponent = dynamic(() => import("../components/ChatComponent"), { ssr: false });

export default function ChatPage() {
  return <ChatComponent />;
}

