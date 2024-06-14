import PostCard from "../../components/postCard/postCard"
import axios from "axios"
import styles from "./blog.module.css";
// import { getPosts } from "@/lib/data";
const getData =async ()=>{
  const res = await axios.get("http://localhost:3000/api/blog",{next:{revalidate:3600}});

  if(!res.data){
    throw new Error("Something went wrong");
   }
   return res.data;
};


const BlogPage = async () => {
  const posts= await getData();
  // const posts= await getPosts();
  console.log(posts);
  return (
    <div className={styles.container}>
    {posts.map((post) => (
      <div className={styles.post} key={post.id}>
        <PostCard post={post} />
      </div>
    ))}
  </div>
  )
}

export default BlogPage;