import styles from "./LogoButton.module.css";

function LogoButton({ text, onClick, logoSrc, alt }: { text: string; onClick: () => void; logoSrc: string; alt: string }) {
    return (
        <button className={styles["icon-button"]}>
            {text}
            <img src={logoSrc} alt={alt} className={styles["icon"]} />
        </button>
    );
}

export default LogoButton;