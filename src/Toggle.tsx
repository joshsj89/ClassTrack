import styles from "./Toggle.module.css";

function Toggle({ label, onChange }: { label: string; onChange: (checked: boolean) => void }) {
    return (
        <div className={styles["toggle-row"]}>
            <label className={styles["switch"]}>
                <input type="checkbox" onChange={(e) => onChange(e.target.checked)} />
                <span className={styles["slider"]}></span>
            </label>
            <label htmlFor={label}>{label}</label>
        </div>
    );
}

export default Toggle;