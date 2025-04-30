// Fee.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllFee from './AllFee';
import AddFee from './AddFee';
import EditFeeType from './EditFeeType';


const Fees = () => {
  return (
    <div className="fee-container">
      <Routes>
        <Route path="/" element={<AllFee />} />
        <Route path="/add" element={<AddFee />} />
        <Route path="/edit/:id" element={<EditFeeType />} />
      </Routes>
    </div>
  );
};

export default Fees;