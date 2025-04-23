import React from 'react';

const bodyParts = [
  'Head', 'Neck', 'Chest', 'Abdomen', 'Left Arm', 'Right Arm',
  'Left Leg', 'Right Leg', 'Feet', 'Hands'
];

const partPosition = {
  Head: { top: '5%', left: '48%' },
  Neck: { top: '15%', left: '48%' },
  Chest: { top: '25%', left: '46%' },
  Abdomen: { top: '40%', left: '47%' },
  'Left Arm': { top: '28%', left: '30%' },
  'Right Arm': { top: '28%', left: '64%' },
  'Left Leg': { top: '60%', left: '43%' },
  'Right Leg': { top: '60%', left: '51%' },
  Feet: { top: '85%', left: '47%' },
  Hands: { top: '42%', left: '20%' },
};

function HumanBodyDiagram({ findings = {} }) {
  return (
    <div className="human-body-diagram">
      <div className="body-outline">
        {bodyParts.map(part => {
          const status = findings[part]?.status;
          const note = findings[part]?.note;
          let color = '#ccc';
          if (status === 'A') color = 'red';
          if (status === 'N') color = 'green';
          if (status === 'NA') color = 'gray';

          return (
            <div
              key={part}
              className="body-part-dot"
              style={{
                top: partPosition[part].top,
                left: partPosition[part].left,
                backgroundColor: color,
              }}
              title={`${part}: ${status || 'NA'}${note ? ' - ' + note : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default HumanBodyDiagram;
