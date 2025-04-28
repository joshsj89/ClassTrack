import styles from "./IconButton.module.css";

function IconButton({ text, onClick, iconSrc, alt, backgroundColor, textColor }: { text: string; onClick: () => void; iconSrc: string; alt: string, backgroundColor?: string, textColor?: string }) {
    return (
        <button 
            className={styles["tall-button"]}
            onClick={onClick}
            style={{ 
                backgroundColor: backgroundColor || "white",
                color: textColor || "black",
            }}
        >
            {text}<br />
            <img 
                src={iconSrc}
                alt={alt}
                className={styles["tall-icon"]} 
                style={{ 
                    filter: textColor === "white" ? "invert(100%)" : "none",
                }}
            />
        </button>
    );
}

export default IconButton;