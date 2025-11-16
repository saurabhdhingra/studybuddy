"use client";
import { DrizzleChat } from "@/src/lib/db/schema";
import Link from "next/link";
import React from "react";
import { Button } from "../../../components/ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import SubscriptionButton from "./SubscriptionButton";

type Props = {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="w-full h-full overflow-y-auto p-4 text-gray-200 bg-gray-900">
      
      {/* New Chat Button (Fixed at the top) */}
      <Link href="/">
        <Button className="w-full border-dashed border-white border mb-4">
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </Button>
      </Link>

      {/* Chat List Container */}
      <div className="flex flex-col gap-2">
        {chats.map((chat) => (
          <Link key={chat.id} href={`/chat/${chat.id}`}>
            <div
              className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}
            >
              <MessageCircle className="mr-2" />
              <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                {chat.pdfname}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Subscription Button/Status (Fixed at the bottom via layout) */}
      {/* <div className="absolute bottom-0 left-0 w-full p-4 bg-gray-900 border-t border-gray-700">
        <SubscriptionButton isPro={isPro} />
      </div> */}
    </div>
  );
};

export default ChatSideBar;