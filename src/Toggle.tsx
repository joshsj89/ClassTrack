import { useRef } from "react";
import styles from "./Toggle.module.css";

function Toggle({ label, onChange, backgroundColor }: { label: string; onChange: (checked: boolean) => void, backgroundColor?: string }) {
    const sliderRef = useRef<HTMLSpanElement>(null);

    return (
        <div className={styles["toggle-row"]}>
            <label className={styles["switch"]}>
                <input 
                    type="checkbox"
                    onChange={(e) => {
                        onChange(e.target.checked);

                        // Change the background color of the slider based on the checked state
                        if (sliderRef.current) {
                            sliderRef.current.style.backgroundColor = e.target.checked ? backgroundColor || "#FF5652" : "#CCC";
                        }
                    }}
                />
                <span className={styles["slider"]} ref={sliderRef}></span>
            </label>
            <label htmlFor={label}>{label}</label>
        </div>
    );
}

export default Toggle;