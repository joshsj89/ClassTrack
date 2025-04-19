import { useRef } from "react";
import styles from "./Toggle.module.css";

function Toggle({ label, onChange, backgroundColor }: { label: string; onChange: (checked: boolean) => void, backgroundColor?: string }) {
    const sliderRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={styles["toggle-row"]}>
            <label className={styles["switch"]}>
                <input 
                    type="checkbox" 
                    ref={inputRef} 
                    onChange={(e) => {
                        onChange(e.target.checked);

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