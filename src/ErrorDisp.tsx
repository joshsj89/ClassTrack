import styles from './ErrorDisp.module.css';

function ErrorDisp() {
    const reopenClassTrack = () => {
        window.location.href = 'index.html';
    };

    return (
        <div className={styles["full-screen-overlay"]}>
            <span className={styles["fade-in"]}>
                Error generating your calendar. Please retry.
            </span>
            <button onClick={reopenClassTrack} className={styles["button"]}>
                Return to ClassTrack
            </button>
        </div>
    );
}

export default ErrorDisp;
