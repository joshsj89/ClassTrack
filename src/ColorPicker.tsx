import { useState } from 'react';
import styles from './ColorPicker.module.css';
import { ColorPickerProps, EventColorHex, getHexFromEventColor, getEventColorFromHex } from './helper/color';

const googleCalendarColors = [
  EventColorHex.PaleBlue,
  EventColorHex.PaleGreen,
  EventColorHex.Mauve,
  EventColorHex.PaleRed,
  EventColorHex.Yellow,
  EventColorHex.Orange,
  EventColorHex.Cyan,
  EventColorHex.Gray,
  EventColorHex.Blue,
  EventColorHex.Green,
  EventColorHex.Red,
];

const ColorPicker = ({ label, selectedColor, onColorChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className={styles["color-picker-container"]}>
        <div
          className={styles["color-swatch"]}
          style={{ backgroundColor: getHexFromEventColor(selectedColor) }}
          onClick={() => setIsOpen(!isOpen)}
        />
        {isOpen && (
          <div className={styles["color-options"]}>
            {googleCalendarColors.map((color) => (
              <div
                key={color}
                className={styles["color-swatch"]}
                style={{
                  backgroundColor: color,
                  border: color === getHexFromEventColor(selectedColor) ? '2px solid black' : 'none',
                }}
                onClick={() => {
                  onColorChange(getEventColorFromHex(color) || selectedColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>
      <p style={{ margin: 0 }}>{label}</p>
    </div>
  );
};

export default ColorPicker;
