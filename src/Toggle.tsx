import styles from "./Toggle.module.css";

function Toggle({ 
    label, 
    onChange, 
    checked, 
    backgroundColor 
}: { label: string, 
    onChange: (checked: boolean) => void, 
    checked?: boolean, 
    backgroundColor?: string 
}) {
    return (
        <div className={styles["toggle-row"]}>
            <label className={styles["switch"]}>
                <input 
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span 
                    className={styles["slider"]}
                    style={{
                        backgroundColor: checked ? backgroundColor || "#FF5652" : "#CCC",
                    }}
                ></span>
            </label>
            <label htmlFor={label}>{label}</label>
        </div>
    );
}

export default Toggle;