import styles from "./footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.logo}>Creative Thoughts</div>
      <div className={styles.text}>
        
        Creative thoughts agency © All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
