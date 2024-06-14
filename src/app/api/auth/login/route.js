

import { NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export  async function POST(req, res) {
  
  try {
    
    const data= await  req.json();
    console.log(data);
   await signIn("credentials",data );
    
    return NextResponse.json({ success: true });
     
  } catch (error) {
   
     if(error.message.includes("CredentialsSignin")){
        return NextResponse.json({error:"Invalid username or password"})
     }
     if(error.message.includes("REDIRECT")){
      console.log("working")
      throw error;
     }
     return NextResponse.json({error:"Something went wrong"});
  }
}
