import React from 'react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="Dash-Footer">
         <div className="Large-container">
      <p>© <span className="year">{currentYear}</span> CMVP</p>
      </div>
    </div>
  );
};

export default AdminFooter;
