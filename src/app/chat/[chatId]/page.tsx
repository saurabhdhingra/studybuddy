import ChatComponent from "../../../components/ui/ChatComponent";
import ChatSideBar from "../../../components/ui/ChatSideBar";
import PDFViewer from "../../../components/ui/PDFViewer";
import { db } from "../../../lib/db";
import { chats } from "@/src/lib/db/schema";
import { checkSubscription } from "@/src/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    chatId: string;
  };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!_chats || _chats.length === 0) {
    return redirect("/");
  }

  if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
    return redirect("/");
  }

  const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
  const isPro = await checkSubscription();

  return (
    <div className="flex w-full h-screen"> 

      <div className="flex-[1] max-w-xs h-full"> 
        <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
      </div>

      <div className="p-4 overflow-y-auto flex-[5] h-full"> 
        <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
      </div>

      <div className="flex-[3] border-l-4 border-l-slate-200 h-full">
        <ChatComponent chatId={parseInt(chatId)} />
      </div>
    </div>
  );
};

export default ChatPage;