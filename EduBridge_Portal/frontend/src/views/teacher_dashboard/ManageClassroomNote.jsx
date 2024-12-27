import React from 'react';

const ImportantNote = ({ onDismiss }) => {
  return (
    <div className="important-note">
      <p>Congrats on creating a classroom! You must create a sample to make the student attend your classroom. You can create a sample by clicking on the "View Samples" button.</p>
      <button onClick={onDismiss}>OK</button>
    </div>
  );
};

export default ImportantNote;
