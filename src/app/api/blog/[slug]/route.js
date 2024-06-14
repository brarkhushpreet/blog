import { Post } from "../../../../lib/models";
import { connectToDb } from "../../../../lib/utils"
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export const GET= async(req,{params})=>{
    const {slug}= params;
    console.log(slug);
    try {
        connectToDb();
        const post= await Post.findOne({slug});
        return NextResponse.json(post);

    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch post!")
        
    }
}

export const  DELETE =async(req,{params})=>{
    //only admins can delete the posts
    const {slug}=params;
    try {
        const userId=slug;
        console.log({userId});
        connectToDb();
        await Post.deleteOne({userId});
        revalidatePath("/blog");
        revalidatePath("/admin");
        return NextResponse.json({msg:"Deleted one post"});
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete the post!")
        
    }


}