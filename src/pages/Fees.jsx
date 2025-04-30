// Fees.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AllFee from "./AllFee";
import AddFee from "./AddFee";
import EditFeeType from "./EditFeeType";
import FeeVouchers from "./FeeVouchers";
import CreateVoucher from "../components/CreateVoucher";

const Fees = () => {
  return (
    <div className="fee-container">
      <Routes>
        <Route index element={<AllFee />} />
        <Route path="add" element={<AddFee />} />
        <Route path="edit/:id" element={<EditFeeType />} />
        <Route path="vouchers" element={<FeeVouchers />} />
        <Route path="vouchers/new/:studentId" element={<CreateVoucher />} />
      </Routes>
    </div>
  );
};

export default Fees;