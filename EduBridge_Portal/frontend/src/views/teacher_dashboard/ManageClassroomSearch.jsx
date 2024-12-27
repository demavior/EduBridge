import React from 'react';

const ClassroomSearch = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by classroom name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={onSearchSubmit}>Search</button>
    </div>
  );
};

export default ClassroomSearch;
