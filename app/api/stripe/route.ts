import { userSubscriptions } from "@/lib/db/schema";
import { useAuth, useUser} from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(){
  try{ 
    const {userId} = await useAuth();
    const user = await useUser();

    if(!userId){
      return new NextResponse('unauthorized', {status: 401})
    }

    const _userSubscriptions = await db.select().from(userSubscriptions).where(eq(userSubscriptions.userId, userId)).run()

  }catch (error){

  }
}