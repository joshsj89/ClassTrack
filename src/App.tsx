import styles from './App.module.css';
import IconButton from './IconButton';
import LogoButton from './LogoButton';
import Toggle from './Toggle';
import { useDarkMode } from './darkModeContext'; 
import { DarkModeProvider } from './darkModeContext';
import { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import { Course, WorkdayCourseFormat, CourseAvailCourseFormat } from '../types/course';
import { Term, TermMappings } from '../types/term';
import termMappingsJson from './json/term_mappings.json'; // Import the JSON file directly
import { convertMDYToDate, convertMDYToYYYYMMDD, convertDayToDayAbbrev } from './helper/date';
import { calendar_v3 } from 'googleapis';
import { EventColor, EventColorHex } from './helper/color';

type Event = calendar_v3.Schema$Event;

function App() {
    console.log(chrome);
    // Initialize state with a default value

    const [startTime, setStartTime] = useState<string>('20:00');
    const [endTime, setEndTime] = useState<string>('08:00');
    

    const [selectedColor, setSelectedColor] = useState<EventColor[]>([EventColor.Peacock, EventColor.PaleGreen, EventColor.Mauve, EventColor.PaleRed]);

    const [isLectures, setIsLectures] = useState<boolean>(false);
    const [isLabs, setIsLabs] = useState<boolean>(false);
    const [isAssignments, setIsAssignments] = useState<boolean>(false);
    const [isMidterms, setIsMidterms] = useState<boolean>(false);
    const [isFinals, setIsFinals] = useState<boolean>(false);
    const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);
    const [isDarkModeScheduled, setIsDarkModeScheduled] = useState<boolean>(false);
    const [darkMode, toggleDarkMode] = useState<boolean>(false);
    const [organizeDrive, setOrganizeDrive] = useState<boolean>(false);
    const [createFiles, setCreateFiles] = useState<boolean>(false);
    const [includeLectureName, setIncludeLectureName] = useState<boolean>(false);
    const [includeAssignment, setIncludeAssignment] = useState<boolean>(false);
    const [linkToCalendar, setLinkToCalendar] = useState<boolean>(false);

    const [isInitialized, setIsInitialized] = useState(false);

    // Define chrome.storage.sync functions
    const getStoredState = (key: string, defaultValue: any) => {
        return new Promise<any>((resolve) => {
            chrome.storage.sync.get([key], (result) => {
                const storedValue = result[key];
                resolve(storedValue === undefined ? defaultValue : storedValue);
                console.log(`${key} retrieved with value ${storedValue !== undefined ? storedValue : defaultValue}`);
            });
        });
    };

    // Save state to chrome.storage.sync whenever it changes
    useEffect(() => {
        if (!isInitialized) return;

        chrome.storage.sync.set({
            startTime,
            endTime,
            selectedColor,
            isLectures,
            isLabs,
            isAssignments,
            isMidterms,
            isFinals,
            isDarkModeScheduled,
            darkMode,
            organizeDrive,
            createFiles,
            includeLectureName,
            includeAssignment,
            linkToCalendar,
        }, () => {
            console.log("All settings saved to chrome.storage.sync");
        }); 
    }, [
        startTime, 
        endTime, 
        selectedColor,
        isLectures, 
        isLabs, 
        isAssignments, 
        isMidterms, 
        isFinals, 
        darkMode, 
        isDarkModeScheduled,
        organizeDrive, 
        createFiles, 
        includeLectureName, 
        includeAssignment, 
        linkToCalendar,
    ]);
    
    // Use useEffect to asynchronously load stored values
    useEffect(() => {
        const loadStoredState = async () => {
            console.log("Loading stored state...");
            const storedStartTime = await getStoredState('startTime', '20:00');
            const storedEndTime = await getStoredState('endTime', '08:00');
            const storedSelectedColor = await getStoredState('selectedColor', ['#7986CB', '#7986CB', '#7986CB']);
            const storedIsLectures = await getStoredState('isLectures', false);
            const storedIsLabs = await getStoredState('isLabs', false);
            const storedIsAssignments = await getStoredState('isAssignments', false);
            const storedIsMidterms = await getStoredState('isMidterms', false);
            const storedIsFinals = await getStoredState('isFinals', false);
            const storedIsDarkModeScheduled = await getStoredState('isDarkModeScheduled', false);
            const storedDarkMode = await getStoredState('darkMode', false);
            const storedOrganizeDrive = await getStoredState('organizeDrive', false);
            const storedCreateFiles = await getStoredState('createFiles', false);
            const storedIncludeLectureName = await getStoredState('includeLectureName', false);
            const storedIncludeAssignment = await getStoredState('includeAssignment', false);
            const storedLinkToCalendar = await getStoredState('linkToCalendar', false);
            

            // Set state with the stored values
            console.log("Setting state with loaded values...");
            setStartTime(storedStartTime);
            setEndTime(storedEndTime);
            setSelectedColor(storedSelectedColor);
            setIsLectures(storedIsLectures);
            setIsLabs(storedIsLabs);
            setIsAssignments(storedIsAssignments);
            setIsMidterms(storedIsMidterms);
            setIsFinals(storedIsFinals);
            setIsDarkModeScheduled(storedIsDarkModeScheduled);
            toggleDarkMode(storedDarkMode);
            setOrganizeDrive(storedOrganizeDrive);
            setCreateFiles(storedCreateFiles);
            setIncludeLectureName(storedIncludeLectureName);
            setIncludeAssignment(storedIncludeAssignment);
            setLinkToCalendar(storedLinkToCalendar);

            setIsInitialized(true);
        };

        loadStoredState(); // Call the function to load data
    }, []);

  

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
    }, [startTime, endTime, isDarkModeScheduled]);

    // 
    useEffect(() => {
        if (isDarkModeScheduled) {
            checkScheduledDarkMode(); // Check the scheduled dark mode state immediately
        }
    }, [startTime, endTime, isDarkModeScheduled]);

    const getGoogleToken = async () : Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, (token) => {
                if (chrome.runtime.lastError || !token) { // Check for errors
                    reject(new Error("Failed to retrieve Google token: " + chrome.runtime.lastError));
                } else {
                    resolve(token as string);
                }
            });
        })
    }

    // Link Google Account
    const linkGoogleAccount = async (): Promise<boolean> => {
        try {
            const token = await getGoogleToken();
            await chrome.storage.local.set({ googleToken: token });

            // Fetch calendar events using the token
            // await fetchCalendarEvents(token);
            // await createDriveFolder(token, "ClassTrack Drive Test"); // Create a folder in Google Drive

            return true; // Return true if the account is linked successfully
        } catch (error) {
            console.error("Error linking Google account:", error);

            return false; // Return false if there's an error
        }
    }

    // Handle Google Link button click
    const handleGoogleLink = async () => {
        if (isGoogleLinked) return;

        try {
            const isConnected = await linkGoogleAccount()
            setIsGoogleLinked(isConnected);
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

    // Upload syllabus and extract data from back end
    const uploadSyllabus = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file); // Append the file to the form data

        try {
            const response = await fetch('https://starfish-calm-burro.ngrok-free.app/parsefile', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error uploading syllabus: ${response.statusText}`);
            }

            const data: Course = await response.json();
            console.log("Syllabus data:", data); // Log the extracted data

            const courseData = await checkCourse(data); // Check the course data

            if (courseData) {
                console.log("Course data found:", courseData); // Log the course data

                if (linkToCalendar && isLectures) {
                    await addClassToCalendar(courseData); // Add the course lectures to Google Calendar
                }
            } else {
                console.error("Course data not found.");
            }
        } catch (error) {
            console.error("Error uploading syllabus:", error);
        }
    }

    const checkCourse = async (course: Course): Promise<WorkdayCourseFormat | null> => {
        const term = `${course["Quarter/Semester"]} ${course["Year"]}`;
        const term2 = `${course["Quarter/Semester"].toLowerCase()}${course["Year"]}`;

        // const termMappingsResponse = await fetch('../json/term_mappings.json');
        // const termMappings: TermMappings = await termMappingsResponse.json();
        const termMappings: TermMappings = termMappingsJson as TermMappings; // Use the imported JSON directly
        const termMapping: Term = termMappings[term];

        if (!termMapping) {
            console.error(`No term mapping found for ${term}`);
            return null;
        }

        // const allCoursesResponse = await fetch(`./json/courses_${term2}.json`);
        // const allCourses: Array<WorkdayCourseFormat> = await allCoursesResponse.json();
        const allCoursesJson = await import(`./json/courses/courses_${term2}.json`, {
            assert: { type: 'json' },
        });
        const allCourses: Array<WorkdayCourseFormat> = allCoursesJson.default as Array<WorkdayCourseFormat>; // Use the imported JSON directly

        let courseFound = false;
        let courseData: WorkdayCourseFormat | null = null;

        for (const courseItem of allCourses) {
            if (course["CourseCode"] === courseItem["Course Section"].split(" - ")[0].split("-")[0]) {
                
                for (const scheduleEvent of course["Schedule"]) {
                    if (scheduleEvent["Type"] !== "Class") continue; // Skip if the type is not "Class"

                    const weekday = scheduleEvent["Weekday"];

                    const meetingPatterns = courseItem["Meeting Patterns"].split(" | ");

                    if (meetingPatterns.length === 0) continue; // Skip if there are no meeting patterns

                    if (weekday !== meetingPatterns[0].trim()) continue; // Skip if the weekday doesn't match

                    // Get start time (H:MM am/pm) (e.g., 3:50 pm)
                    const startTime = scheduleEvent["Start Time"].toUpperCase();
                    if (startTime !== meetingPatterns[1].split(" - ")[0].trim()) continue; // Skip if the start time doesn't match

                    // Get end time (H:MM am/pm) (e.g., 5:30 pm)
                    const endTime = scheduleEvent["End Time"].toUpperCase();
                    if (endTime !== meetingPatterns[1].split(" - ")[1].trim()) continue; // Skip if the end time doesn't match

                    courseFound = true;
                    return courseItem;
                }
            }
        }

        return courseFound ? courseData : null;
    }

    const addClassToCalendar = async (course: WorkdayCourseFormat) => {
        // const token = await chrome.storage.local.get('googleToken');
        const token = await getGoogleToken();

        if (!token) {
            throw new Error("Google token not found");
        }

        const calendarId = 'primary'; // Use the primary calendar

        const event: Event = {
            summary: course["Course Section"],
            start: {
                dateTime: convertMDYToDate(course["Start Date"], course["Meeting Patterns"])["startTime"].toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: convertMDYToDate(course["Start Date"], course["Meeting Patterns"])["endTime"].toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            description: course["All Instructors"],
            location: course["Locations"],
            // course["Meeting Patterns"] = "T Th | 3:50 PM - 5:30 PM" -> Repeat every week on T and Th until course["End Date"]
            recurrence: [
                `RRULE:FREQ=WEEKLY;BYDAY=${course["Meeting Patterns"].split(" | ")[0].trim().split(" ").map((dayString) => convertDayToDayAbbrev(dayString)).toString()};UNTIL=${convertMDYToYYYYMMDD(course["End Date"])}T235959Z`,
            ],
            colorId: selectedColor[0], // Use the selected color for the event
        };

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event),
        });

        if (!response.ok) {
            throw new Error(`Error adding event to calendar: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Event added to calendar:", data); // Log the added event
        return data; // Return the added event data
    }

    const addCalendarEvents = async (course: WorkdayCourseFormat) => {

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
                        onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.pdf, .docx, .txt'; // Accept PDF, DOCX, and TXT files
                            input.onchange = (event) => {
                                const file = (event.target as HTMLInputElement).files?.[0];
                                if (file) {
                                    uploadSyllabus(file); // Call the upload function with the selected file
                                }
                            };
                            input.click(); // Trigger the file input click
                        }}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <ColorPicker
                                label='Lectures'
                                selectedColor={selectedColor[0]}
                                onColorChange={(newColor: EventColor) => {
                                    const updatedColors = [...selectedColor];
                                    updatedColors[0] = newColor;
                                    setSelectedColor(updatedColors);
                                }}
                            />
                            <ColorPicker
                                label='Events'
                                selectedColor={selectedColor[1]}
                                onColorChange={(newColor: EventColor) => {
                                    const updatedColors = [...selectedColor];
                                    updatedColors[1] = newColor;
                                    setSelectedColor(updatedColors);
                                }}
                            />
                            <ColorPicker
                                label='Tasks'
                                selectedColor={selectedColor[2]}
                                onColorChange={(newColor: EventColor) => {
                                    const updatedColors = [...selectedColor];
                                    updatedColors[2] = newColor;
                                    setSelectedColor(updatedColors);
                                }}
                            />
                            <ColorPicker
                                label='Exams'
                                selectedColor={selectedColor[3]}
                                onColorChange={(newColor: EventColor) => {
                                    const updatedColors = [...selectedColor];
                                    updatedColors[3] = newColor;
                                    setSelectedColor(updatedColors);
                                }}
                            />
                        </div>
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
