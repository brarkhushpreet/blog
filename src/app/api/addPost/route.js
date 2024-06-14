// pages/api/addPost.js
import { connectToDb } from "../../../lib/utils";
import { Post } from "../../../lib/models";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export  async function POST(req, res) {
  
  try {
    
    const data= await  req.json();
    console.log(data);
   //Connect to the database
    connectToDb();
   
    // Create a new Post instance
    const newPost = new Post(data);

    // Save the new post to the database
    await newPost.save();
     //
     revalidatePath("/blog");
    revalidatePath("/admin");
    // Respond with success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in addPost API route:', error.message);
    return NextResponse.json({ success: false, error: 'Something went wrong!' });
  }
}
