import styles from './App.module.css';
import IconButton from './IconButton';
import LogoButton from './LogoButton';
import Toggle from './Toggle';
import { useDarkMode } from './darkModeContext'; 
import { DarkModeProvider } from './darkModeContext';
import { useState, useEffect } from 'react';

function App() {
    const { darkMode, toggleDarkMode } = useDarkMode();
    const [startTime, setStartTime] = useState<string>('00:00'); // 7:00 PM
    const [endTime, setEndTime] = useState<string>('00:00'); // 7:00 AM
    const year = new Date().getFullYear();


    // Toggle dark mode based on the time
    const checkScheduledDarkMode = () => {
        const currentTime = new Date();
        const currentHours = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        
        const [startHours, startMinutes] = startTime.split(':').map(num => parseInt(num));
        const [endHours, endMinutes] = endTime.split(':').map(num => parseInt(num));
        
        const startDate = new Date(currentTime);
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date(currentTime);
        endDate.setHours(endHours, endMinutes, 0, 0);

        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1); // Adjust end time to the next day
        }

        if (currentTime >= startDate && currentTime <= endDate) {
            toggleDarkMode(true);
        } else {
            toggleDarkMode(false);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(checkScheduledDarkMode, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, [startTime, endTime]);

    return (
        <div className={`${styles["App"]} ${darkMode ? styles["dark"] : ""}`}>
            {/* Title Bar */}
            <div className={styles["title"]}>
                <h1>ClassTrack</h1>
            </div>

            {/* Main Container */}
            <div className={styles["main"]}>
                {/* Row 1 */}
                <div className={`${styles["row"]} ${styles["row-1"]}`}>
                    <LogoButton
                        text="Connect to Canvas"
                        onClick={() => console.log("Canvas Connected")}
                        logoSrc="images/canvas-logo.png"
                        alt="Canvas"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                    <LogoButton
                        text="Link to Google Account"
                        onClick={() => console.log("Google Linked")}
                        logoSrc="images/google-logo.png"
                        alt="Google"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                </div>

                {/* Row 2 */}
                <div className={`${styles["row"]} ${styles["row-2"]}`}>
                    <IconButton
                        text="Upload"
                        onClick={() => console.log("Upload clicked")}
                        iconSrc="images/upload-icon.png"
                        alt="Upload"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                    <IconButton
                        text="Paste Text"
                        onClick={() => console.log("Paste Text clicked")}
                        iconSrc="images/paste-icon.png"
                        alt="Paste"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                    <IconButton
                        text="Sync"
                        onClick={() => console.log("Sync clicked")}
                        iconSrc="images/sync-icon.png"
                        alt="Sync"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                </div>

                {/* Row 3 */}
                <div className={`${styles["row"]} ${styles["row-3"]}`}>
                    <div className={styles["toggle-container"]}>
                        {["Lecture/Lab", "Extracurricular", "Work", "Personal", "Tasks"].map(label => (
                            <Toggle
                                key={label}
                                label={label}
                                backgroundColor='#4CAF50'
                                onChange={(checked) => console.log(`${label} toggled: ${checked}`)}
                            />
                        ))}
                    </div>
                    <div className={styles["toggle-container"]}>
                        {["Lectures", "Labs", "Assignments", "Midterms", "Finals"].map(label => (
                            <Toggle
                                key={label}
                                label={label}
                                onChange={(checked) => console.log(`${label} toggled: ${checked}`)}
                            />
                        ))}
                    </div>
                </div>

                {/* Row 4 (updated) */}
                <div className={`${styles["row"]} ${styles["row-4"]}`}>
                    <div className={styles["toggle-container"]}>
                        <Toggle
                            key="Dark Mode"
                            label="Dark Mode"
                            onChange={(checked) => {
                                toggleDarkMode(checked);
                                
                                console.log(`Dark Mode toggled: ${checked}`);
                            }}
                        />
                        <Toggle
                            key="Scheduled Dark Mode"
                            label="Scheduled Dark Mode"
                            onChange={(checked) => {
                                console.log(`Scheduled Dark Mode toggled: ${checked}`);
                                checkScheduledDarkMode(); // Check the scheduled dark mode state
                            }}
                        />
                        <div>
                            <label>Start Time: </label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>End Time: </label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles["toggle-container"]}>
                        {["Organize Drive", "Create Files", "Include Lecture Name", "Include Assignment", "Link to Calendar"].map(label => (
                            <Toggle
                                key={label}
                                label={label}
                                onChange={(checked) => console.log(`${label} toggled: ${checked}`)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className={styles["footer"]}>
                <p>&copy; {year} ClassTrack. All rights reserved.</p>
            </div>
        </div>
    );
}

const AppWrapper = () => {
    return (
        <DarkModeProvider>
            <App />
        </DarkModeProvider>
    );
};

export default AppWrapper;
