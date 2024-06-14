"use client";
import NavLink from "./navLink/navLink"
import styles from "./links.module.css"
import Image from "next/image";
import { useState } from "react";
import { handleLogout } from "@/lib/action";

const links=[
    {
        title:"Homepage",
        path:"/",
    },
    {
        title:"About",
        path:"/about",
    },
    {
        title:"Contact",
        path:"/contact",
    },
    {
        title:"Blog",
        path:"/blog",
    }
];
const Links = ({session})=> {
  const [open,setOpen] =useState(false);
// const isAdmin=true;
//  const session=true;
console.log(session,"from links");


  return (
    <div className={styles.container}>
        <div className={styles.links}>
            {links.map((link)=>(
                <NavLink item={link} key={link.title}/>
            ))}
            {session?.user ?(
                <>
              {session.user?.isAdmin && <NavLink item={{title:"Admin",path:"/admin"}}/>}
              <form action={handleLogout}>
                <button className={styles.logout}>Logout</button>
              </form>
                </>
            ):(
                <NavLink item={{title:"Login",path:"/login"}}/>
            )}
        </div>
        <Image
        className={styles.menuButton}
        src="/menu.png"
        alt="menu button"
        width={30}
        height={30}
        onClick={() => setOpen((prev) => !prev)}
        />
        {open &&(
            <div className={styles.mobileLinks}>
                {links.map((item) =>(
                    <NavLink item={item} key={item.title}/>
                ))}
                {session?.user ?(
                <>
              {session.user?.isAdmin && <NavLink item={{title:"Admin",path:"/admin"}}/>}
              <form action="">
                <button className={styles.logout}>Logout</button>
              </form>
                </>
            ):(
                <NavLink item={{title:"Login",path:"/login"}}/>
            )}
            </div>
        )}
    </div>
  )
}

export default Links