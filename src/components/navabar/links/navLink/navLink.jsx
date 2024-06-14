"use client";
import styles from "./navLink.module.css"
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavLink = ({item:link}) => {
    const pathName=usePathname();
  return (
   <Link href={link.path} className={`${styles.container} ${pathName===link.path && styles.active}`}>{link.title}</Link>
  );
};

export default NavLink;