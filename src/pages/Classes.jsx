import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AllClasses from './AllClasses';
import ClassForm from './ClassForm';

const Classes = () => {
  return (
    <Routes>
      <Route path="/" element={<AllClasses />} />
      <Route path="/add" element={<ClassForm />} />
      <Route path="/edit/:id" element={<ClassForm />} />
    </Routes>
  );
};

export default Classes;