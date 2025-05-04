import React, { useState } from 'react';
import styles from './ColorPicker.module.css';

type ColorPickerProps = {
  selectedColor: string;
  onColorChange: (color: string) => void;
};

const googleCalendarColors = [
  '#7986CB', '#33B679', '#8E24AA', '#E67C73', '#F6BF26',
  '#F4511E', '#039BE5', '#616161', '#3F51B5', '#0B8043'
];

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles["color-picker-container"]}>
      <div
        className={styles["color-swatch"]}
        style={{ backgroundColor: selectedColor }}
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
                border: color === selectedColor ? '2px solid black' : 'none',
              }}
              onClick={() => {
                onColorChange(color);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
