import Image from "next/image";
import styles from "./singlePost.module.css";
import PostUser from "../../../components/postUser/postUser";
import { Suspense } from "react";
import { getPost } from "../../../lib/data";
import axios from "axios";

const getData =async(slug)=>{
  const res=await axios.get( `http://localhost:3000/api/blog/${slug}`);

  if(!res.data){
    throw new Error("Something went wrong")
  }
  return res.data;
}

const SinglePostPage = async ({params}) => {
  const {slug}=params;
  console.log(slug);
  const post= await getData(slug);
  
  // const post= await getPost(slug);
  console.log(post);
  return (
    <div className={styles.container}>
      {post.img && (
        <div className={styles.imgContainer}>
          <Image src={post.img} alt="" fill className={styles.img} />
        </div>
      )}
      <div className={styles.textContainer}>
        <h1 className={styles.title}>{post.title}</h1>
        <div className={styles.detail}>
          {post && (
            <Suspense fallback={<div>Loading...</div>}>
              <PostUser userId={post.userId} />
            </Suspense>
          )}
          <div className={styles.detailText}>
            <span className={styles.detailTitle}>Published</span>
            <span className={styles.detailValue}>
            {post.createdAt.toString().slice(0, 10)}
            </span>
          </div>
        </div>
        <div className={styles.content}>{post.desc}</div>
      </div>
    </div>
  )
}

export default SinglePostPage;