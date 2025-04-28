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
    const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);

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

    // Link Google Account
    const linkGoogleAccount = async () => {
        try {
            const token: string = await new Promise<string>((resolve, reject) => {
                chrome.identity.getAuthToken({ interactive: true }, (token) => { // Request an auth token
                    if (chrome.runtime.lastError || !token) { // Check for errors
                        reject(chrome.runtime.lastError);
                        return;
                    }

                    resolve(token as string); // Resolve the promise with the token
                });
            });

            console.log("Google access token:", token);

            // Fetch calendar events using the token
            await fetchCalendarEvents(token);
            await createDriveFolder(token, "ClassTrack Drive Test"); // Create a folder in Google Drive
        } catch (error) {
            console.error("Error linking Google account:", error);
        }
    }

    // Handle Google Link button click
    const handleGoogleLink = () => {
        if (isGoogleLinked) return;

        linkGoogleAccount().then(() => {
            setIsGoogleLinked(true);
            console.log("Google account linked successfully.");
        }).catch((error) => {
            console.error("Error linking Google account:", error);
        });
    }

    // Fetch calendar events from Google Calendar API
    const fetchCalendarEvents = async (token: string) => {
        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching calendar events: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Calendar events:", data); // Log the calendar events
    }

    const createDriveFolder = async (token: string, folderName: string) => {
        const response = await fetch('https://www.googleapis.com/drive/v3/files', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            }),
        });

        if (!response.ok) {
            throw new Error(`Error creating folder: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Folder created:", data);
    }

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
                        onClick={(() => console.log("Canvas Connected"))}
                        logoSrc="images/canvas-logo.png"
                        alt="Canvas"
                        backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                        textColor={darkMode ? "white" : "black"}
                    />
                    <LogoButton
                        text={isGoogleLinked ? "Google Linked" : "Link to Google Account"}
                        onClick={handleGoogleLink}
                        logoSrc="images/google-logo.png"
                        alt="Google"
                        disabled={isGoogleLinked}
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
