import styles from './App.module.css';
import IconButton from './IconButton';
import LogoButton from './LogoButton';
import Toggle from './Toggle';
import { useDarkMode } from './darkModeContext'; 
import { DarkModeProvider } from './darkModeContext';
import { useState, useEffect, useRef } from 'react';
import ColorPicker from './ColorPicker';
import { ScheduleEvent, Course, WorkdayCourseFormat } from '../types/course';
import { Term, TermMappings } from '../types/term';
import termMappingsJson from './json/term_mappings.json'; // Import the JSON file directly
import { convertMDYToDate, convertMDYToYYYYMMDD, convertDayToDayAbbrev, convertscheduleEventToDate } from './helper/date';
import { calendar_v3 } from 'googleapis';
import { EventColor } from './helper/color';
import CourseSelectionModal from './CourseSelectionModal';
import Loading from './Loading';

type Event = calendar_v3.Schema$Event;

function App() {
    // Initialize state with a default value

    const [isLoading, setIsLoading] = useState(false);

    const [email, setEmail] = useState("");

    const [selectionOptions, setSelectionOptions] = useState<{ label: string, value: WorkdayCourseFormat }[] | null>(null);
    // const [onSelectCourse, setOnSelectCourse] = useState<((selected: WorkdayCourseFormat | null) => void) | null>(null);
    const onSelectCourseRef = useRef<((selected: WorkdayCourseFormat | null) => void)>(null);


    const [startTime, setStartTime] = useState<string>('20:00');
    const [endTime, setEndTime] = useState<string>('08:00');

    const [selectedColor, setSelectedColor] = useState<EventColor[]>([EventColor.Peacock, EventColor.PaleGreen, EventColor.Mauve, EventColor.PaleRed]);

    const [isLectures, setIsLectures] = useState<boolean>(false);
    const [isLabs, setIsLabs] = useState<boolean>(false);
    const [isAssignments, setIsAssignments] = useState<boolean>(false);
    const [isOfficeHours, setIsOfficeHours] = useState<boolean>(false);
    const [isExams, setIsExams] = useState<boolean>(false);
    const [isGoogleLinked, setIsGoogleLinked] = useState<boolean>(false);
    const [isDarkModeScheduled, setIsDarkModeScheduled] = useState<boolean>(false);
    const [darkMode, toggleDarkMode] = useState<boolean>(false);
    const [organizeDrive, setOrganizeDrive] = useState<boolean>(false);
    const [createFiles, setCreateFiles] = useState<boolean>(false);
    const [includeLectureName, setIncludeLectureName] = useState<boolean>(false);
    const [includeAssignment, setIncludeAssignment] = useState<boolean>(false);

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
            isOfficeHours,
            isExams,
            isGoogleLinked,
            isDarkModeScheduled,
            darkMode,
            organizeDrive,
            createFiles,
            includeLectureName,
            includeAssignment,
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
        isOfficeHours, 
        isExams,
        isGoogleLinked,
        darkMode, 
        isDarkModeScheduled,
        organizeDrive, 
        createFiles, 
        includeLectureName, 
        includeAssignment, 
    ]);
    
    // Use useEffect to asynchronously load stored values
    useEffect(() => {
        const loadStoredState = async () => {
            console.log("Loading stored state...");
            const storedStartTime = await getStoredState('startTime', '20:00');
            const storedEndTime = await getStoredState('endTime', '08:00');
            const storedSelectedColor = await getStoredState('selectedColor', [EventColor.Peacock, EventColor.PaleGreen, EventColor.Mauve, EventColor.PaleRed]);
            const storedIsLectures = await getStoredState('isLectures', false);
            const storedIsLabs = await getStoredState('isLabs', false);
            const storedIsAssignments = await getStoredState('isAssignments', false);
            const storedisOfficeHours = await getStoredState('isOfficeHours', false);
            const storedIsExams = await getStoredState('IsExams', false);
            const storedisGoogleLinked = await getStoredState('isGoogleLinked', false);
            const storedIsDarkModeScheduled = await getStoredState('isDarkModeScheduled', false);
            const storedDarkMode = await getStoredState('darkMode', false);
            const storedOrganizeDrive = await getStoredState('organizeDrive', false);
            const storedCreateFiles = await getStoredState('createFiles', false);
            const storedIncludeLectureName = await getStoredState('includeLectureName', false);
            const storedIncludeAssignment = await getStoredState('includeAssignment', false);
            

            // Set state with the stored values
            console.log("Setting state with loaded values...");
            setStartTime(storedStartTime);
            setEndTime(storedEndTime);
            setSelectedColor(storedSelectedColor);
            setIsLectures(storedIsLectures);
            setIsLabs(storedIsLabs);
            setIsAssignments(storedIsAssignments);
            setIsOfficeHours(storedisOfficeHours);
            setIsExams(storedIsExams);
            setIsGoogleLinked(storedisGoogleLinked);
            setIsDarkModeScheduled(storedIsDarkModeScheduled);
            toggleDarkMode(storedDarkMode);
            setOrganizeDrive(storedOrganizeDrive);
            setCreateFiles(storedCreateFiles);
            setIncludeLectureName(storedIncludeLectureName);
            setIncludeAssignment(storedIncludeAssignment);

            setIsInitialized(true);
        };

        loadStoredState(); // Call the function to load data
    }, []);

    useEffect(() => {
        const getToken = async () => {
            try {
                if (!isGoogleLinked) return; // If the Google account is not linked, do nothing

                const token = await getGoogleToken(false); // Get the Google token without prompting the user

                if (token) {
                    await handleGoogleLink(); // Link the Google account if the token is available
                }
            } catch (error) {
                console.error("Error retrieving Google token:", error);
                return null;
            }
        }

        getToken();
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

    const getGoogleToken = async (prompt: boolean = true) : Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: prompt }, (token) => {
                if (chrome.runtime.lastError) { // Check for errors
                    console.log("Failed to retrieve Google token: " + chrome.runtime.lastError.message);
                    resolve("");
                } else if (!token) {
                    console.log("Prompt exited without a token.");
                    resolve("");
                } else {
                    resolve(token as string);
                }
            });
        })
    }

    const revokeGoogleToken = async () => {
        await chrome.identity.clearAllCachedAuthTokens();
        setIsGoogleLinked(false); // Reset the state
        setEmail(''); // Clear the email

        console.log("Google token revoked successfully.");
    }

    // Link Google Account
    const linkGoogleAccount = async (): Promise<boolean> => {
        try {
            const token = await getGoogleToken();

            if (!token) {
                return false;
            }

            setEmail((await chrome.identity.getProfileUserInfo({ accountStatus: 'ANY'})).email); // Get the user's email

            if ((await chrome.storage.sync.get('courseCalendarId')).courseCalendarId === undefined) {
                await createCourseCalendar(); // Create a course calendar
            }

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

    const handleUploadClick = () => {
        if (!isGoogleLinked) {
            alert("Please link your Google account first.");
            return;
        }
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf, .docx, .txt'; // Accept PDF, DOCX, and TXT files
        input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                uploadFile(file); // Call the upload function with the selected file
            }
        };
        input.click(); // Trigger the file input click
    }

    const handlePasteTextClick = () => {
        if (!isGoogleLinked) {
            alert("Please link your Google account first.");
            return;
        }

        const input = document.createElement('input');
        input.type = 'text';

        const plainText = window.prompt("Paste the text here:");

        if (plainText) {
            uploadText(plainText); // Call the upload function with the pasted text
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

    const createCourseCalendar = async () => {
        const token = await getGoogleToken();

        if (!token) {
            throw new Error("Google token not found");
        }

        const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                summary: "ClassTrack",
                timeZone: "America/Los_Angeles",
            }),
        });
    
        if (!response.ok) {
            throw new Error(`Error creating calendar: ${response.statusText}`);
        }
    
        const data = await response.json();

        chrome.storage.sync.set({ courseCalendarId: data.id }, () => {
            console.log("Course calendar ID saved to storage:", data.id);
        });
        
        return data.id;
    };

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

    // Upload syllabus file to the back end
    const uploadFile = async (file: File) => {
        setIsLoading(true);
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

            await processSyllabus(data);
        } catch (error) {
            console.error("Error uploading syllabus:", error);
        } finally {
            setIsLoading(false);
        }
        
    }

    // Upload plain text to the back end
    const uploadText = async (text: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('https://starfish-calm-burro.ngrok-free.app/parsetext', {
                method: 'POST',
                body: text,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
    
            if (!response.ok) {
                throw new Error(`Error uploading text: ${response.statusText}`);
            }
    
            const data: Course = await response.json();
            console.log("Syllabus data:", data); // Log the extracted data
    
            await processSyllabus(data);
        } catch (error) {
            console.error("Error uploading syllabus:", error);
        } finally{
            setIsLoading(false);
        }
    }

    // Extract course data and add it to Google Calendar
    const processSyllabus = async (data: Course) => {
        const courseData = await checkCourse(data); // Check the course data

        if (courseData) {
            console.log("Course data found:", courseData); // Log the course data

            if (isLectures) {
                // If there's only one lecture, add it to the calendar
                if (courseData.length === 1) {
                    await addWorkdayClassToCalendar(courseData[0]); // Add the course lecture to Google Calendar
                } else if (courseData.length > 1) { // If there are multiple lectures, have the user select which one to add
                    const courseOptions = courseData.map((course) => ({
                        label: `${course["Course Section"]} - ${course["Meeting Patterns"]}`,
                        value: course,
                    }));

                    const selectedCourse = await new Promise<WorkdayCourseFormat | null>((resolve) => {
                        setSelectionOptions(courseOptions);

                        onSelectCourseRef.current = resolve; // Use the ref to set the callback
                    });

                    if (selectedCourse) {
                        await addWorkdayClassToCalendar(selectedCourse); // Add the selected lecture to Google Calendar
                    }
                }
            }

            if (isLabs) {
                const labData = await checkLabs(data); // Check the lab data

                // If there's only one lab, add it to the calendar
                if (labData.length === 1) {
                    await addWorkdayClassToCalendar(labData[0]); // Add the lab to Google Calendar
                } else if (labData.length > 1) {// If there are multiple labs, have the user select which one to add
                    const labOptions = labData.map((lab) => ({
                        label: `${lab["Course Section"]} - ${lab["Meeting Patterns"]}`,
                        value: lab,
                    }));

                    const selectedLab = await new Promise<WorkdayCourseFormat | null>((resolve) => {
                        setSelectionOptions(labOptions);

                        onSelectCourseRef.current = resolve; // Use the ref to set the callback
                    });

                    if (selectedLab) {
                        await addWorkdayClassToCalendar(selectedLab); // Add the selected lab to Google Calendar
                    }
                }
    
                if (isOfficeHours) {
                    const officeHoursData = await checkOfficeHours(data); // Check the office hours data

                    for (const officeHour of officeHoursData) {
                        await addScheduleEventToCalendar(data, officeHour); // Add the office hours to Google Calendar
                    }
                }
            } else {
                console.error("Course data not found.");
            }
        }
    
    }
    

    const checkCourse = async (course: Course): Promise<Array<WorkdayCourseFormat>> => {
        const term = `${course["Quarter/Semester"]} ${course["Year"]}`;
        const term2 = `${course["Quarter/Semester"].toLowerCase()}${course["Year"]}`;

        const termMappings: TermMappings = termMappingsJson as TermMappings; // Use the imported JSON directly
        const termMapping: Term = termMappings[term];

        if (!termMapping) {
            console.error(`No term mapping found for ${term}`);
            return [];
        }

        const allCoursesJson = await import(`./json/courses/courses_${term2}.json`, {
            assert: { type: 'json' },
        });
        const allCourses: Array<WorkdayCourseFormat> = allCoursesJson.default as Array<WorkdayCourseFormat>; // Use the imported JSON directly

        let courseFound = false;
        let courseData: Array<WorkdayCourseFormat> = [];

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
                    courseData.push(courseItem);
                }
            }
        }

        return courseFound ? courseData : [];
    }

    const checkLabs = async (course: Course) : Promise<Array<WorkdayCourseFormat>> => {
        const term = `${course["Quarter/Semester"]} ${course["Year"]}`;
        const term2 = `${course["Quarter/Semester"].toLowerCase()}${course["Year"]}`;

        const termMappings: TermMappings = termMappingsJson as TermMappings; // Use the imported JSON directly
        const termMapping: Term = termMappings[term];

        if (!termMapping) {
            console.error(`No term mapping found for ${term}`);
            return [];
        }

        const allCoursesJson = await import(`./json/courses/courses_${term2}.json`, {
            assert: { type: 'json' },
        });
        const allCourses: Array<WorkdayCourseFormat> = allCoursesJson.default as Array<WorkdayCourseFormat>; // Use the imported JSON directly

        let courseFound = false;
        let courseData: Array<WorkdayCourseFormat> = [];

        for (const courseItem of allCourses) {
            if (`${course["CourseCode"]}L` === courseItem["Course Section"].split(" - ")[0].split("-")[0]) {
                courseFound = true;
                courseData.push(courseItem);
            }
        }

        return courseFound ? courseData : [];
    }

    const checkOfficeHours = async (course: Course) : Promise<Array<ScheduleEvent>> => {
        const term = `${course["Quarter/Semester"]} ${course["Year"]}`;

        const termMappings: TermMappings = termMappingsJson as TermMappings; // Use the imported JSON directly
        const termMapping: Term = termMappings[term];

        if (!termMapping) {
            console.error(`No term mapping found for ${term}`);
            return [];
        }
        
        let courseData: Array<ScheduleEvent> = [];

        for (const scheduleEvent of course["Schedule"]) {
            if (scheduleEvent["Type"] !== "Office Hour") continue; // Skip if the type is not "Office Hours"

            courseData.push(scheduleEvent);
        }

        return courseData;
    }

    const addWorkdayClassToCalendar = async (course: WorkdayCourseFormat) => {
        const token = await getGoogleToken();

        if (!token) {
            throw new Error("Google token not found");
        }

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
            recurrence: [
                `RRULE:FREQ=WEEKLY;BYDAY=${course["Meeting Patterns"].split(" | ")[0].trim().split(" ").map((dayString) => convertDayToDayAbbrev(dayString)).toString()};UNTIL=${convertMDYToYYYYMMDD(course["End Date"])}T235959Z`,
            ],
            colorId: selectedColor[0],
        };

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
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

    const addScheduleEventToCalendar = async (course: Course, scheduleEvent: ScheduleEvent) => {
        const token = await getGoogleToken();

        if (!token) {
            throw new Error("Google token not found");
        }

        const term = `${course["Quarter/Semester"]} ${course["Year"]}`;

        const termMappings: TermMappings = termMappingsJson as TermMappings; // Use the imported JSON directly
        const termMapping: Term = termMappings[term];
        const endDate = termMapping.endDate;

        if (!termMapping) {
            console.error(`No term mapping found for ${term}`);
            return [];
        }

        const eventTimes = convertscheduleEventToDate(termMapping, scheduleEvent);

        const event: Event = {
            summary: `${course["CourseCode"]} - ${scheduleEvent["Type"]}`,
            start: {
                dateTime: eventTimes["startTime"].toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            end: {
                dateTime: eventTimes["endTime"].toISOString(),
                timeZone: 'America/Los_Angeles',
            },
            location: scheduleEvent["Location"],
            recurrence: [
                `RRULE:FREQ=WEEKLY;BYDAY=${scheduleEvent["Weekday"].split(" ").map((dayString) => convertDayToDayAbbrev(dayString)).toString()};UNTIL=${endDate.replaceAll("-", "")}T235959Z`,
            ],
            colorId: selectedColor[1],
        };

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, {
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
      

    const dotStyle = (delay: number) => ({
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: 'white',
        animation: 'bounce 1s infinite',
        animationDelay: `${delay}s`
      });
      

    
    return (
        <>
            {isLoading && <Loading />}

            <div className={`${styles["App"]} ${darkMode ? styles["dark"] : ""}`}>
                {/* Title Bar */}
                <div className={styles["title"]}>
                    <h1>ClassTrack</h1>
                </div>

                {/* Main Container */}
                <div className={styles["main"]}>
                    {/* Row 1 */}
                    <div className={`${styles["row"]} ${styles["row-1"]}`}>
                        {/*<LogoButton
                            text="Connect to Canvas"
                            onClick={(() => console.log("Canvas Connected"))}
                            logoSrc="images/canvas-logo.png"
                            alt="Canvas"
                            backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                            textColor={darkMode ? "white" : "black"}
                        />*/}
                        <LogoButton
                            text={isGoogleLinked ? `Google Linked (${email})` : "Link to Google Account"}
                            onClick={isGoogleLinked ? revokeGoogleToken : handleGoogleLink}
                            logoSrc="images/google-logo.png"
                            alt="Google"
                            // disabled={isGoogleLinked}
                            backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                            textColor={darkMode ? "white" : "black"}
                        />
                    </div>

                    {/* Row 2 */}
                    <div className={`${styles["row"]} ${styles["row-2"]}`}>
                        <IconButton
                            text="Upload"
                            onClick={handleUploadClick}
                            iconSrc="images/upload-icon.png"
                            alt="Upload"
                            backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                            textColor={darkMode ? "white" : "black"}
                        />
                        <IconButton
                            text="Paste Text"
                            onClick={handlePasteTextClick}
                            iconSrc="images/paste-icon.png"
                            alt="Paste"
                            backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                            textColor={darkMode ? "white" : "black"}
                        />
                        {/*}
                        <IconButton
                            text="Sync"
                            onClick={() => console.log("Sync clicked")}
                            iconSrc="images/sync-icon.png"
                            alt="Sync"
                            backgroundColor={darkMode ? "#FFFFFF0D" : "white"}
                            textColor={darkMode ? "white" : "black"}
                        />
                        */}
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
                                key="Office Hours"
                                label="Office Hours"
                                checked={isOfficeHours}
                                onChange={(checked) => setIsOfficeHours(checked)}
                            />
                            <Toggle
                                key="Exams"
                                label="Exams"
                                checked={isExams}
                                onChange={(checked) => setIsExams(checked)}
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
                        </div>
                    </div>
                </div>

                {selectionOptions && (
                    <CourseSelectionModal
                        options={selectionOptions}
                        onSelect={(selected) => {
                            setSelectionOptions(null);
                            onSelectCourseRef.current?.(selected); // Call the callback with the selected course
                        }}
                        onCancel={() => {
                            setSelectionOptions(null);
                            onSelectCourseRef.current?.(null); // Call the callback with null
                        }}
                    />
                )}

                {/* Footer */}
                <div className={styles["footer"]}>
                    <p>&copy; {year} ClassTrack. All rights reserved.</p>
                </div>
            </div>
        </>
    );
};


const AppWrapper = () => {
    return (
        <DarkModeProvider>
            <App />
        </DarkModeProvider>
    );
};

export default AppWrapper;
