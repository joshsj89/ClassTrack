import styles from './App.module.css';
import IconButton from './IconButton';
import LogoButton from './LogoButton';
import Toggle from './Toggle';
import { useDarkMode } from './darkModeContext'; 
import { DarkModeProvider } from './darkModeContext';
import { useState, useEffect } from 'react';

function App() {
    const [startTime, setStartTime] = useState<string>('20:00'); // 8:00 PM
    const [endTime, setEndTime] = useState<string>('08:00'); // 8:00 AM

    const [isCustomizable1, setisCustomizable1] = useState<boolean>(false);
    const [isCustomizable2, setisCustomizable2] = useState<boolean>(false);
    const [isCustomizable3, setisCustomizable3] = useState<boolean>(false);
    const [isCustomizable4, setisCustomizable4] = useState<boolean>(false);
    const [isCustomizable5, setisCustomizable5] = useState<boolean>(false);

    const [isLectures, setIsLectures] = useState<boolean>(false);
    const [isLabs, setIsLabs] = useState<boolean>(false);
    const [isAssignments, setIsAssignments] = useState<boolean>(false);
    const [isMidterms, setIsMidterms] = useState<boolean>(false);
    const [isFinals, setIsFinals] = useState<boolean>(false);

    const { darkMode, toggleDarkMode } = useDarkMode();
    const [isDarkModeScheduled, setIsDarkModeScheduled] = useState<boolean>(false);

    const [organizeDrive, setOrganizeDrive] = useState<boolean>(false);
    const [createFiles, setCreateFiles] = useState<boolean>(false);
    const [includeLectureName, setIncludeLectureName] = useState<boolean>(false);
    const [includeAssignment, setIncludeAssignment] = useState<boolean>(false);
    const [linkToCalendar, setLinkToCalendar] = useState<boolean>(false);

    const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);

    const year = new Date().getFullYear();

    // Toggle dark mode based on the time
    const checkScheduledDarkMode = () => {
        if (!isDarkModeScheduled) return; // If scheduled dark mode is not enabled, do nothing
        
        const currentTime = new Date();
        
        const [startHours, startMinutes] = startTime.split(':').map(num => parseInt(num));
        const [endHours, endMinutes] = endTime.split(':').map(num => parseInt(num));
        
        const startDate = new Date();
        startDate.setHours(startHours, startMinutes, 0, 0);
        const endDate = new Date();
        endDate.setHours(endHours, endMinutes, 0, 0);

        // If end time is less than start time, it means the end time is on the next day
        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }

        // Check if the current time is within the scheduled dark mode time
        if (currentTime >= startDate && currentTime <= endDate) {
            toggleDarkMode(true);
        } else {
            toggleDarkMode(false);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(checkScheduledDarkMode, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, [startTime, endTime]);

    // 
    useEffect(() => {
        if (isDarkModeScheduled) {
            checkScheduledDarkMode(); // Check the scheduled dark mode state immediately
        }
    }, [isDarkModeScheduled]);

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
    const handleGoogleLink = async () => {
        if (isGoogleLinked) return;

        try {
            await linkGoogleAccount()
            setIsGoogleLinked(true);
            console.log("Google account linked successfully.");
        } catch (error) {
            console.error("Error linking Google account:", error);
            setIsGoogleLinked(false); // Reset the state if there's an error
        }
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
                        <Toggle
                            key="Customizable 1"
                            label="Customizable 1"
                            checked={isCustomizable1}
                            backgroundColor='#4CAF50'
                            onChange={(checked) => setisCustomizable1(checked)}
                        />
                        <Toggle
                            key="Customizable 2"
                            label="Customizable 2"
                            checked={isCustomizable2}
                            backgroundColor='#4CAF50'
                            onChange={(checked) => setisCustomizable2(checked)}
                        />
                        <Toggle
                            key="Customizable 3"
                            label="Customizable 3"
                            checked={isCustomizable3}
                            backgroundColor='#4CAF50'
                            onChange={(checked) => setisCustomizable3(checked)}
                        />
                        <Toggle
                            key="Customizable 4"
                            label="Customizable 4"
                            checked={isCustomizable4}
                            backgroundColor='#4CAF50'
                            onChange={(checked) => setisCustomizable4(checked)}
                        />
                        <Toggle
                            key="Customizable 5"
                            label="Customizable 5"
                            checked={isCustomizable5}
                            backgroundColor='#4CAF50'
                            onChange={(checked) => setisCustomizable5(checked)}
                        />
                    </div>
                    <div className={styles["toggle-container"]}>
                        <Toggle
                            key="Lectures"
                            label="Lectures"
                            checked={isLectures}
                            onChange={(checked) => setIsLectures(checked)}
                        />
                        <Toggle
                            key="Labs"
                            label="Labs"
                            checked={isLabs}
                            onChange={(checked) => setIsLabs(checked)}
                        />
                        <Toggle
                            key="Assignments"
                            label="Assignments"
                            checked={isAssignments}
                            onChange={(checked) => setIsAssignments(checked)}
                        />
                        <Toggle
                            key="Midterms"
                            label="Midterms"
                            checked={isMidterms}
                            onChange={(checked) => setIsMidterms(checked)}
                        />
                        <Toggle
                            key="Finals"
                            label="Finals"
                            checked={isFinals}
                            onChange={(checked) => setIsFinals(checked)}
                        />
                    </div>
                </div>

                {/* Row 4 (updated) */}
                <div className={`${styles["row"]} ${styles["row-4"]}`}>
                    <div className={styles["toggle-container"]}>
                        <Toggle
                            key="Dark Mode"
                            label="Dark Mode"
                            checked={darkMode}
                            onChange={(checked) => toggleDarkMode(checked)}
                        />
                        <Toggle
                            key="Scheduled Dark Mode"
                            label="Scheduled Dark Mode"
                            checked={isDarkModeScheduled}
                            onChange={(checked) => {
                                console.log(`Scheduled Dark Mode toggled: ${checked}`);
                                setIsDarkModeScheduled(checked);

                                if (checked) {
                                    checkScheduledDarkMode(); // Check the scheduled dark mode state immediately
                                } else {
                                    toggleDarkMode(false); // Turn off dark mode if scheduled is disabled
                                }
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
                        <Toggle
                            key="Organize Drive"
                            label="Organize Drive"
                            checked={organizeDrive}
                            onChange={(checked) => setOrganizeDrive(checked)}
                        />
                        <Toggle
                            key="Create Files"
                            label="Create Files"
                            checked={createFiles}
                            onChange={(checked) => setCreateFiles(checked)}
                        />
                        <Toggle
                            key="Include Lecture Name"
                            label="Include Lecture Name"
                            checked={includeLectureName}
                            onChange={(checked) => setIncludeLectureName(checked)}
                        />
                        <Toggle
                            key="Include Assignment"
                            label="Include Assignment"
                            checked={includeAssignment}
                            onChange={(checked) => setIncludeAssignment(checked)}
                        />
                        <Toggle
                            key="Link to Calendar"
                            label="Link to Calendar"
                            checked={linkToCalendar}
                            onChange={(checked) => setLinkToCalendar(checked)}
                        />
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
