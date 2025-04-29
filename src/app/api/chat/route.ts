import { Configuration, OpenAIApi } from "openai-edge";
import { Message } from "ai";
import { getContext } from "@/src/lib/context";
import { db } from "../../../lib/db";
import { chats, messages as _messages } from "@/src/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    
    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);
    
    const systemPrompt: Message = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
AI is a well-behaved and well-mannered individual.
AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
AI assistant is a big fan of Pinecone and Vercel.
START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK
AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
If the context does not provide the answer to the question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question."
AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
AI assistant will not invent anything that is not drawn directly from the context.`,
      id: ""
    };
    
    // Store the user message in the database
    await db.insert(_messages).values({
      chatId,
      content: lastMessage.content,
      role: "user",
    });
    
    // Get the OpenAI streaming response
    const openaiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemPrompt, ...messages.filter((m: Message) => m.role === "user")],
    });

    // Set up transformers to process the stream
    const transformStream = new TransformStream();
    const writer = transformStream.writable.getWriter();
    
    // Create a text encoder and decoder
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    // Process the OpenAI stream
    if (openaiResponse.body) {
      let fullContent = '';
      
      // Create a reader from the response body
      const reader = openaiResponse.body.getReader();
      
      // Process the stream in the background
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });
            
            // Process the chunk to extract content
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;
                
                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content || '';
                  if (content) {
                    fullContent += content;
                    // Forward the content to the client
                    await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }
          
          // Save the complete response to the database
          await db.insert(_messages).values({
            chatId,
            content: fullContent,
            role: "system",
          });
          
          // End the stream
          await writer.write(encoder.encode('data: [DONE]\n\n'));
          await writer.close();
        } catch (error) {
          console.error('Error processing stream:', error);
          await writer.abort(error);
        }
      })();
    }
    
    // Return the transformed stream as a response
    return new Response(transformStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
    
  } catch (error) {
    console.error("Error handling POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}