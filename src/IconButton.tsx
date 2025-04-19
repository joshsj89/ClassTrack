import styles from "./IconButton.module.css";

function IconButton({ text, onClick, iconSrc, alt }: { text: string; onClick: () => void; iconSrc: string; alt: string }) {
    return (
        <button className={styles["tall-button"]} onClick={onClick}>
            {text}<br />
            <img src={iconSrc} alt={alt} className={styles["tall-icon"]} />
        </button>
    );
}

export default IconButton;