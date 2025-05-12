import { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiUploadCloud,
  FiUser,
  FiMail,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiBook,
  FiLock,
  FiUserPlus,
  FiHome,
  FiFlag,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import Loader from "./Loader";
import { Switch } from "@headlessui/react";

// Zod Schema Definition
const studentSchema = z.object({
  class_id: z.number().min(1, "Class is required"),
  section_id: z.number().optional(),
  roll_number: z.string().optional(),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  dob: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
  whatsapp_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  cell_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  address: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  academic_session: z.string().optional(),
  admission_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")
    .optional(),
  b_form_number: z.string().length(13, "Must be 13 digits").optional(),
  city: z.string().optional(),
  cnic_number: z.string().length(13, "Must be 13 digits").optional(),
  disability: z.boolean().default(false),
  district: z.string().optional(),
  emergency_contact: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .optional(),
  guardian_cnic: z.string().length(13, "Must be 13 digits").optional(),
  guardian_name: z.string().optional(),
  guardian_occupation: z.string().optional(),
  guardian_relationship: z.string().optional(),
  nationality: z.string().optional(),
  postal_code: z.string().optional(),
  previous_school: z.string().optional(),
  province: z.string().optional(),
  religion: z.string().optional(),
  student_status: z.enum(["active", "inactive", "suspended"]).default("active"),
});

// Predefined options
const districts = [
  { value: "", label: "Select District" },
  { value: "Lahore", label: "Lahore" },
  { value: "Karachi", label: "Karachi" },
  { value: "Islamabad", label: "Islamabad" },
  { value: "Rawalpindi", label: "Rawalpindi" },
  { value: "Faisalabad", label: "Faisalabad" },
  { value: "Multan", label: "Multan" },
  { value: "Peshawar", label: "Peshawar" },
  { value: "Quetta", label: "Quetta" },
];
const provinces = [
  { value: "", label: "Select Province" },
  { value: "Punjab", label: "Punjab" },
  { value: "Sindh", label: "Sindh" },
  { value: "Khyber Pakhtunkhwa", label: "Khyber Pakhtunkhwa" },
  { value: "Balochistan", label: "Balochistan" },
  { value: "Azad Kashmir", label: "Azad Kashmir" },
  { value: "Gilgit-Baltistan", label: "Gilgit-Baltistan" },
];

const countries = [
  { value: "", label: "Select Country" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "India", label: "India" },
  { value: "United States", label: "United States" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "China", label: "China" },
];

const nationalities = [
  { value: "", label: "Select Nationality" },
  { value: "Pakistani", label: "Pakistani" },
  { value: "Indian", label: "Indian" },
  { value: "American", label: "American" },
  { value: "British", label: "British" },
  { value: "Chinese", label: "Chinese" },
];

const religions = [
  { value: "", label: "Select Religion" },
  { value: "Islam", label: "Islam" },
  { value: "Christianity", label: "Christianity" },
  { value: "Hinduism", label: "Hinduism" },
  { value: "Sikhism", label: "Sikhism" },
  { value: "Other", label: "Other" },
];

const AddStudent = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    class_id: "",
    section_id: "",
    roll_number: "",
    first_name: "",
    last_name: "",
    email: "",
    dob: "",
    whatsapp_number: "",
    cell_number: "",
    address: "",
    gender: "",
    academic_session: "",
    admission_date: "",
    b_form_number: "",
    city: "",
    cnic_number: "",
    disability: false,
    district: "",
    emergency_contact: "",
    guardian_cnic: "",
    guardian_name: "",
    guardian_occupation: "",
    guardian_relationship: "",
    nationality: "",
    postal_code: "",
    previous_school: "",
    province: "",
    religion: "",
    student_status: "active",
  });
  const [imageFile, setImageFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [fetchError, setFetchError] = useState(null);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "https://sms-backend-five.vercel.app/api/v1/classes",
        );
        setClasses(response.data.data);
      } catch (error) {
        const message =
          error.response?.data?.message || "Failed to fetch classes";
        setFetchError(message);
        toast.error(message, { theme: theme === "dark" ? "dark" : "light" });
      }
    };
    fetchClasses();
  }, []);

  // Update sections when class_id changes
  useEffect(() => {
    if (formData.class_id) {
      const selectedClass = classes.find(
        (cls) => cls.id === parseInt(formData.class_id)
      );
      setSections(selectedClass ? selectedClass.sections : []);
      setFormData((prev) => ({ ...prev, section_id: "" })); // Reset section_id
    } else {
      setSections([]);
      setFormData((prev) => ({ ...prev, section_id: "" }));
    }
  }, [formData.class_id, classes]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "class_id" || name === "section_id"
          ? parseInt(value) || ""
          : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Please upload an image file", {
        theme: theme === "dark" ? "dark" : "light",
      });
      return;
    }
    if (type === "pdf" && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file", {
        theme: theme === "dark" ? "dark" : "light",
      });
      return;
    }
    if (type === "image") setImageFile(file);
    else if (type === "pdf") setPdfFile(file);
  };

  const handleDisabilityChange = (checked) => {
    setFormData((prev) => ({ ...prev, disability: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Zod validation
      await studentSchema.parseAsync(formData);
      setErrors({});

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== false) data.append(key, value);
      });

      if (imageFile) data.append("image", imageFile);
      if (pdfFile) data.append("pdf", pdfFile);

      const response = await axios.post(
        "https://sms-backend-five.vercel.app/api/v1/students",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        const className =
          classes.find((cls) => cls.id === formData.class_id)?.class_name ||
          "Class";
        toast.success(
          `Student ${formData.first_name} ${formData.last_name} added to ${className} successfully!`,
          { theme: theme === "dark" ? "dark" : "light" }
        );
        resetForm();
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors = error.flatten().fieldErrors;
        const formattedErrors = Object.entries(zodErrors).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value?.[0],
          }),
          {}
        );
        setErrors(formattedErrors);
        toast.error("Please fix the validation errors", {
          theme: theme === "dark" ? "dark" : "light",
        });
      } else {
        const message =
          error.response?.data?.message || "Failed to create student";
        toast.error(message, { theme: theme === "dark" ? "dark" : "light" });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      class_id: "",
      section_id: "",
      roll_number: "",
      first_name: "",
      last_name: "",
      email: "",
      dob: "",
      whatsapp_number: "",
      cell_number: "",
      address: "",
      gender: "",
      academic_session: "",
      admission_date: "",
      b_form_number: "",
      city: "",
      cnic_number: "",
      disability: false,
      district: "",
      emergency_contact: "",
      guardian_cnic: "",
      guardian_name: "",
      guardian_occupation: "",
      guardian_relationship: "",
      nationality: "",
      postal_code: "",
      previous_school: "",
      province: "",
      religion: "",
      student_status: "active",
    });
    setImageFile(null);
    setPdfFile(null);
    setErrors({});
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme}
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Student Registration</h1>
        </div>
        {isSubmitting && <Loader />}
        {fetchError && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {fetchError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiUser className="text-blue-500" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                error={errors.first_name}
                theme={theme}
                icon={<FiUser />}
                required
              />
              <FormField
                label="Last Name"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                error={errors.last_name}
                theme={theme}
                icon={<FiUser />}
                required
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                theme={theme}
                icon={<FiMail />}
                required
              />
              <FormField
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                error={errors.dob}
                theme={theme}
                icon={<FiCalendar />}
              />
              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleInputChange}
                error={errors.gender}
                theme={theme}
                icon={<FiUser />}
                options={[
                  { value: "", label: "Select Gender" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
              <FormField
                label="CNIC Number"
                name="cnic_number"
                value={formData.cnic_number}
                onChange={handleInputChange}
                error={errors.cnic_number}
                theme={theme}
                icon={<FiLock />}
              />
              <FormField
                label="B-Form Number"
                name="b_form_number"
                value={formData.b_form_number}
                onChange={handleInputChange}
                error={errors.b_form_number}
                theme={theme}
                icon={<FiLock />}
              />
              <div className="flex items-center space-x-4">
                <label
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Disability
                </label>
                <Switch
                  checked={formData.disability}
                  onChange={handleDisabilityChange}
                  className={`${
                    formData.disability ? "bg-blue-600" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                  <span className="sr-only">Toggle disability</span>
                  <span
                    className={`${
                      formData.disability ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiBook className="text-blue-500" /> Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Class"
                name="class_id"
                type="select"
                value={formData.class_id}
                onChange={handleInputChange}
                error={errors.class_id}
                theme={theme}
                icon={<FiBook />}
                options={[
                  { value: "", label: "Select Class" },
                  ...classes.map((cls) => ({
                    value: cls.id,
                    label: cls.class_name,
                  })),
                ]}
                required
              />
              <FormField
                label="Section"
                name="section_id"
                type="select"
                value={formData.section_id}
                onChange={handleInputChange}
                error={errors.section_id}
                theme={theme}
                icon={<FiBook />}
                options={[
                  {
                    value: "",
                    label: sections.length
                      ? "Select Section"
                      : "No Sections Available",
                  },
                  ...sections.map((sec) => ({
                    value: sec.id,
                    label: sec.section_name,
                  })),
                ]}
              />
              <FormField
                label="Roll Number"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleInputChange}
                error={errors.roll_number}
                theme={theme}
                icon={<FiBook />}
              />
              <FormField
                label="Academic Session"
                name="academic_session"
                value={formData.academic_session}
                onChange={handleInputChange}
                error={errors.academic_session}
                theme={theme}
                icon={<FiCalendar />}
              />
              <FormField
                label="Admission Date"
                name="admission_date"
                type="date"
                value={formData.admission_date}
                onChange={handleInputChange}
                error={errors.admission_date}
                theme={theme}
                icon={<FiCalendar />}
              />
              <FormField
                label="Previous School"
                name="previous_school"
                value={formData.previous_school}
                onChange={handleInputChange}
                error={errors.previous_school}
                theme={theme}
                icon={<FiBook />}
              />
              <FormField
                label="Student Status"
                name="student_status"
                type="select"
                value={formData.student_status}
                onChange={handleInputChange}
                error={errors.student_status}
                theme={theme}
                icon={<FiBook />}
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                  { value: "suspended", label: "Suspended" },
                ]}
              />
            </div>
          </div>

          {/* Guardian Information */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiUserPlus className="text-blue-500" /> Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Guardian Name"
                name="guardian_name"
                value={formData.guardian_name}
                onChange={handleInputChange}
                error={errors.guardian_name}
                theme={theme}
                icon={<FiUser />}
              />
              <FormField
                label="Guardian CNIC"
                name="guardian_cnic"
                value={formData.guardian_cnic}
                onChange={handleInputChange}
                error={errors.guardian_cnic}
                theme={theme}
                icon={<FiLock />}
              />
              <FormField
                label="Guardian Occupation"
                name="guardian_occupation"
                value={formData.guardian_occupation}
                onChange={handleInputChange}
                error={errors.guardian_occupation}
                theme={theme}
                icon={<FiUser />}
              />
              <FormField
                label="Guardian Relationship"
                name="guardian_relationship"
                value={formData.guardian_relationship}
                onChange={handleInputChange}
                error={errors.guardian_relationship}
                theme={theme}
                icon={<FiUser />}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiPhone className="text-blue-500" /> Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="WhatsApp Number"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                error={errors.whatsapp_number}
                theme={theme}
                icon={<FiPhone />}
              />
              <FormField
                label="Cell Number"
                name="cell_number"
                value={formData.cell_number}
                onChange={handleInputChange}
                error={errors.cell_number}
                theme={theme}
                icon={<FiPhone />}
              />
              <FormField
                label="Emergency Contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                error={errors.emergency_contact}
                theme={theme}
                icon={<FiPhone />}
              />
            </div>
          </div>

          {/* Address Information */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiMapPin className="text-blue-500" /> Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                error={errors.address}
                theme={theme}
                icon={<FiHome />}
              />
              <FormField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                error={errors.city}
                theme={theme}
                icon={<FiMapPin />}
              />
              <FormField
                label="District"
                name="district"
                type="select"
                value={formData.district}
                onChange={handleInputChange}
                error={errors.district}
                theme={theme}
                icon={<FiMapPin />}
                options={districts}
              />
              <FormField
                label="Province"
                name="province"
                type="select"
                value={formData.province}
                onChange={handleInputChange}
                error={errors.province}
                theme={theme}
                icon={<FiMapPin />}
                options={provinces}
              />
              <FormField
                label="Postal Code"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                error={errors.postal_code}
                theme={theme}
                icon={<FiMapPin />}
              />
              <FormField
                label="Country"
                name="country"
                type="select"
                value={formData.country}
                onChange={handleInputChange}
                error={errors.country}
                theme={theme}
                icon={<FiFlag />}
                options={countries}
              />
              <FormField
                label="Nationality"
                name="nationality"
                type="select"
                value={formData.nationality}
                onChange={handleInputChange}
                error={errors.nationality}
                theme={theme}
                icon={<FiFlag />}
                options={nationalities}
              />
              <FormField
                label="Religion"
                name="religion"
                type="select"
                value={formData.religion}
                onChange={handleInputChange}
                error={errors.religion}
                theme={theme}
                icon={<FiBook />}
                options={religions}
              />
            </div>
          </div>

          {/* Documents Upload */}
          <div
            className={`rounded-lg p-6 shadow-lg ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <FiUploadCloud className="text-blue-500" /> Documents Upload
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Student Photo
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "image")}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imageFile ? (
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        className="h-32 w-32 rounded-full mx-auto object-cover"
                      />
                    ) : (
                      <div className="space-y-2">
                        <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Click to upload image
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  PDF Document
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    theme === "dark"
                      ? "border-gray-600 hover:border-gray-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, "pdf")}
                    className="hidden"
                    id="pdf-upload"
                  />
                  <label htmlFor="pdf-upload" className="cursor-pointer">
                    <div className="space-y-2">
                      <FiUploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        {pdfFile ? pdfFile.name : "Click to upload PDF"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || classes.length === 0}
              className={`px-6 py-3 rounded-lg transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } disabled:opacity-50`}
            >
              {isSubmitting ? "Submitting..." : "Create Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  theme,
  icon,
  required,
  options,
}) => (
  <div>
    <label
      className={`block text-sm font-medium mb-2 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div
        className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {icon}
      </div>
      {type === "select" ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } ${error ? "border-red-500" : ""}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full pl-10 pr-4 py-2 roundedLg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${
            theme === "dark"
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          } ${error ? "border-red-500" : ""}`}
        />
      )}
    </div>
    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
  </div>
);

export default AddStudent;
