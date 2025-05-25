import styles from './Complete.module.css';

function Complete() {
    const openGoogleCalendar = () => {
        window.open('https://calendar.google.com', '_blank');
    };
    const reopenClassTrack = () => {
        window.location.href = 'index.html';
    };

    return (
        <div className={styles["full-screen-overlay"]}>
            <span className={styles["fade-in"]}>
                Your calendar has been updated!
            </span>
            <button onClick={openGoogleCalendar} className={styles["calendar-button"]}>
                Go to Google Calendar
            </button>
            <button onClick={reopenClassTrack} className={styles["calendar-button"]}>
                Return to ClassTrack
            </button>
        </div>
    );
}

export default Complete;
