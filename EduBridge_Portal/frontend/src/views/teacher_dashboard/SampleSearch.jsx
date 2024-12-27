import React from 'react';

const SampleSearch = ({ searchTerm, onSearchChange, onSearchSubmit }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by sample name..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button onClick={onSearchSubmit}>Search</button>
    </div>
  );
};

export default SampleSearch;
