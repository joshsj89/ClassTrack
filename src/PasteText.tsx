import { useState } from 'react';
import styles from './PasteText.module.css';

function PasteText({ uploadText }: { uploadText: (text: string) => void }) {
    const [text, setText] = useState("");

    const completedPaste = () => {
        uploadText(text); 
    };

    return (
        <div className={styles["full-screen-overlay"]}>
            <div className={styles["text-entry-field"]}>
                <span className={styles["fade-in"]}>
                    <textarea
                        rows={10}
                        cols={50}
                        placeholder="Paste your syllabus here..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </span>
            </div>
            <button onClick={completedPaste} className={styles["button"]}>
                Generate My Calendar
            </button>
        </div>
    );
}

export default PasteText;
