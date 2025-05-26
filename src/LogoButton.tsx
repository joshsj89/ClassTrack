import styles from "./LogoButton.module.css";

type LogoButtonProps = {
    text: string; 
    onClick: () => void; 
    onMouseEnter?: () => void; 
    onMouseLeave?: () => void; 
    logoSrc: string; 
    alt: string; 
    disabled?: boolean; 
    backgroundColor?: string; 
    textColor?: string;
};

function LogoButton({ text, onClick, onMouseEnter, onMouseLeave, logoSrc, alt, disabled, backgroundColor, textColor }: LogoButtonProps) {
    return (
        <button
            className={styles["icon-button"]}
            onClick={onClick}
            disabled={disabled}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
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