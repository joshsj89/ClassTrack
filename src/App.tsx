import styles from './App.module.css';
import IconButton from './IconButton';
import LogoButton from './LogoButton';
import Toggle from './Toggle';

function App() {
    const year = new Date().getFullYear();

    return (
        <div className={styles["App"]}>
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
                    />
                    <LogoButton
                        text="Link to Google Account"
                        onClick={() => console.log("Google Linked")}
                        logoSrc="images/google-logo.png"
                        alt="Google"
                    />
                </div>

                {/* Row 2 */}
                <div className={`${styles["row"]} ${styles["row-2"]}`}>
                    <IconButton
                        text="Upload"
                        onClick={() => console.log("Upload clicked")}
                        iconSrc="images/upload-icon.png"
                        alt="Upload"
                    />
                    <IconButton
                        text="Paste Text"
                        onClick={() => console.log("Paste Text clicked")}
                        iconSrc="images/paste-icon.png"
                        alt="Paste"
                    />
                    <IconButton
                        text="Sync"
                        onClick={() => console.log("Sync clicked")}
                        iconSrc="images/sync-icon.png"
                        alt="Sync"
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

                {/* Row 4 */}
                <div className={`${styles["row"]} ${styles["row-4"]}`}>
                    <div className={styles["toggle-container"]}>
                        {["Dark Mode", "Scheduled Dark Mode", "Toggle 3", "Toggle 4", "Toggle 5"].map(label => (
                            <Toggle
                                key={label}
                                label={label}
                                onChange={(checked) => console.log(`${label} toggled: ${checked}`)}
                            />
                        ))}
                    </div>
                    <div className={styles["toggle-container"]}>
                        {["Organize Drive", "Create Files", "Include Lecure Name", "Include Assignment", "Link to Calendar"].map(label => (
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

export default App;
