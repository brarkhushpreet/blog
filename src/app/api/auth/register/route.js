

import { NextResponse } from "next/server";
import { connectToDb } from "../../../../lib/utils";
import { User } from "../../../../lib/models";
import bcrypt from "bcryptjs"


export  async function POST(req, res) {
    const data= await req.json();
    const {username,email,password,Confirmpassword}=data;
    console.log(data);
    if(password!== Confirmpassword){
        return NextResponse.json({error:"Passwords do not match"})
    }
  try {
      connectToDb();
      const user= await User.findOne({username});
      if(user){
        return NextResponse.json({error:"Username already exists"});
      }
      const salt= await bcrypt.genSalt(10);
      const hashedPassword= await bcrypt.hash(password,salt);
      const newUser=new User({
        username,
        email,
        password:hashedPassword,


      });
      await newUser.save();
      console.log("saved to db");

      return NextResponse.json(null);

      
    
  } catch (error) {
     console.log(error);
    return NextResponse.json({error:"Something went wrong"});
     
  }
}
