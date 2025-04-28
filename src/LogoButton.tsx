import styles from "./LogoButton.module.css";

function LogoButton({ text, onClick, logoSrc, alt, disabled, backgroundColor, textColor }: { text: string; onClick: () => void; logoSrc: string; alt: string, disabled?: boolean, backgroundColor?: string, textColor?: string }) {
    return (
        <button
            className={styles["icon-button"]}
            onClick={onClick}
            disabled={disabled}
            style={{
                backgroundColor: !disabled ? backgroundColor || "white" : "lightgray",
                color: textColor || "black",
            }}
        >
            {text}
            <img src={logoSrc} alt={alt} className={styles["icon"]} />
        </button>
    );
}

export default LogoButton;