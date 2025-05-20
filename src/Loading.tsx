import styles from './Loading.module.css';

function Loading() {
    return (
        <div className={styles["full-screen-overlay"]}>
            <div className={styles["spinner-container"]}>
            <div className={styles["spinner-dots"]}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
            </div>
            </div>
            <span className={styles["fade-in"]}>
                Processing your syllabus, please wait...
            </span>
        </div>
    )
}

export default Loading;