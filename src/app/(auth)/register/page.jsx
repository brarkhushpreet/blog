import styles from "./register.module.css"
import RegisterForm from "../../../components/registerForm/registerform"

const register = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <RegisterForm/>
      </div>
    </div>
  )
}

export default register