import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StudentList from './StudentsList';
import AddStudent from './AddStudent';

const Students = () => {
    return (
      <Routes>
        <Route path="/" element={<StudentList />} />
        <Route path="/add" element={<AddStudent />} />
        {/* <Route path="/edit/:id" element={<ClassForm />} /> */}
      </Routes>
    );
  };
  
  export default Students;