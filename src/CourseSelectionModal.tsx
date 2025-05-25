import React, { useState } from 'react';
import { WorkdayCourseFormat } from '../types/course';

interface CourseSelectionModalProps {
  options: { label: string; value: WorkdayCourseFormat }[];
  onSelect: (selected: WorkdayCourseFormat) => void;
  onCancel: () => void;
}

const CourseSelectionModal: React.FC<CourseSelectionModalProps> = ({ options, onSelect, onCancel }) => {

  const [selected, setSelected] = useState<WorkdayCourseFormat | null>(null);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: 'white',
        padding: '20px',
        width: '70%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      }}>
       <h2 style={{ marginBottom: '16px', fontSize: '1.25rem', color: 'black'}}>Select a Section</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginBottom: '16px' }}>
          {options.map((option, idx) => {
            const isSelected = selected === option.value;
            return (
              <li key={idx} style={{ marginBottom: '10px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: isSelected ? '#ff5652' : '#f5f5f5',
                    color: isSelected ? '#fff' : '#333',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={() => setSelected(option.value)}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 16px',
              background: '#e0e0e0',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => selected && onSelect(selected)}
            disabled={!selected}
            style={{
              padding: '10px 16px',
              background: selected ? '#ff5652' : '#e0e0e0',
              color: 'white',
              borderRadius: '6px',
              border: 'none',
              cursor: selected ? 'pointer' : 'not-allowed',
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseSelectionModal;