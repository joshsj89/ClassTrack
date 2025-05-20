import React from 'react';
import { WorkdayCourseFormat } from '../types/course';

interface CourseSelectionModalProps {
  options: { label: string; value: WorkdayCourseFormat }[];
  onSelect: (selected: WorkdayCourseFormat) => void;
  onCancel: () => void;
}

const CourseSelectionModal: React.FC<CourseSelectionModalProps> = ({ options, onSelect, onCancel }) => {
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
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
      }}>
        <h2>Select a course</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {options.map((option, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>
              <button
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
                onClick={() => onSelect(option.value)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={onCancel} style={{ marginTop: '10px' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CourseSelectionModal;
