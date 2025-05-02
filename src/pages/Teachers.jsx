import React, { useEffect, useState } from "react";

const Teacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all teachers data from API
  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const response = await fetch("http://localhost:3500/api/v1/teachers");
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        setTeachers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachersData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Teachers List */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Teachers</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div
              key={teacher.teacher_id}
              className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={teacher.photo_url}
                  alt={`${teacher.first_name} ${teacher.last_name}`}
                  className="w-16 h-16 rounded-full border-2 border-primary"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {teacher.first_name} {teacher.last_name}
                  </h2>
                  <p className="text-gray-600">
                    {teacher.subjects_taught.join(", ")}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Experience:</span>{" "}
                  {teacher.years_of_experience} years
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {teacher.employment_status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teacher Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedTeacher.first_name} {selectedTeacher.last_name}
                </h2>
                <button
                  onClick={() => setSelectedTeacher(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Modal Content (Reuse the existing teacher profile layout) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Personal Information
                  </h3>
                  <InfoItem
                    label="Father's Name"
                    value={selectedTeacher.father_name}
                  />
                  <InfoItem label="CNIC" value={selectedTeacher.cnic} />
                  <InfoItem
                    label="Date of Birth"
                    value={formatDate(selectedTeacher.date_of_birth)}
                  />
                  <InfoItem
                    label="Blood Group"
                    value={selectedTeacher.blood_group}
                  />
                  <InfoItem label="Gender" value={selectedTeacher.gender} />
                  <InfoItem
                    label="Marital Status"
                    value={selectedTeacher.marital_status}
                  />
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Contact Information
                  </h3>
                  <InfoItem label="Email" value={selectedTeacher.email} />
                  <InfoItem label="Phone" value={selectedTeacher.phone} />
                  <InfoItem
                    label="Address"
                    value={`${selectedTeacher.address_line1}, ${selectedTeacher.address_line2}, ${selectedTeacher.city}, ${selectedTeacher.country} - ${selectedTeacher.postal_code}`}
                  />
                  <InfoItem
                    label="Emergency Contact"
                    value={`${selectedTeacher.emergency_contact_name} (${selectedTeacher.emergency_contact_phone})`}
                  />
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Professional Information
                  </h3>
                  <InfoItem
                    label="Experience"
                    value={`${selectedTeacher.years_of_experience} years`}
                  />
                  <InfoItem
                    label="Hire Date"
                    value={formatDate(selectedTeacher.hire_date)}
                  />
                  <InfoItem
                    label="Teaching License"
                    value={selectedTeacher.teaching_license_number}
                  />

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                      Education
                    </h4>
                    {selectedTeacher.educations.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <p className="text-gray-800 font-medium">
                          {edu.degree}
                        </p>
                        <p className="text-sm text-gray-600">
                          {edu.institution} ({edu.year})
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Subjects & Links */}
              <div className="mt-8">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    Subjects Taught
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.subjects_taught.map((subject, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Profile Created: {formatDate(selectedTeacher.created_at)}
                  </div>
                  <div className="flex gap-4">
                    <a
                      href={selectedTeacher.resume_url}
                      className="text-primary hover:text-primary/80 flex items-center gap-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>Download Resume</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                    </a>
                    <a
                      href={selectedTeacher.linkedin_url}
                      className="text-primary hover:text-primary/80 flex items-center gap-1"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>LinkedIn</span>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="mb-4">
    <dt className="text-sm text-gray-500">{label}</dt>
    <dd className="text-gray-800 font-medium break-words">{value}</dd>
  </div>
);

export default Teacher;
