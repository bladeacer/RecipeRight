import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { useNavigate } from 'react-router-dom';

function CompleteProfile() {
  const navigate = useNavigate();

  // States to control the progress bar and fade-out text
  const [progress, setProgress] = useState(50);           // starts at 50%
  const [progressText, setProgressText] = useState("50% Complete");
  const [fadeOut, setFadeOut] = useState(false);

  // State to hold the preview URL for the uploaded image
  const [preview, setPreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      image: null
    },
    validationSchema: yup.object({
      name: yup
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .required('Name is required'),
      gender: yup.string().required('Gender is required')
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('gender', values.gender);
        if (values.image) {
          formData.append('image', values.image);
        }

        // Submit the form data
        await http.post('/user/complete-profile', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        // Animate progress bar to 100% and fade out text
        setProgress(100);
        setProgressText("100% Complete");
        setFadeOut(true);

        // After a brief delay, navigate to profile
        setTimeout(() => {
          navigate('/profile');
        }, 1000);
      } catch (err) {
        console.error(err);
      }
    }
  });

  return (
    <main
      className="container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '2rem'
      }}
    >
      <article
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '1.5rem',
          backgroundColor: 'var(--pico-background-white-500, #fff)',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Progress Bar Container */}
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#ddd',
              borderRadius: '5px',
              margin: '0 auto'
            }}
          >
            {/* Animated Progress Bar */}
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: '5px',
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
          {/* Fade-out text when progress hits 100% */}
          <p
            style={{
              fontWeight: 'bold',
              marginTop: '0.5rem',
              opacity: fadeOut ? 0 : 1,
              transition: 'opacity 1s ease-in-out'
            }}
          >
            {progressText}
          </p>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Complete Your Profile</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'gray' }}>
          Please fill out the following details to get started.
        </p>

        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.name && formik.errors.name ? "error" : ""}
            />
            {formik.touched.name && formik.errors.name && (
              <small className="contrast" style={{ color: "red" }}>
                {formik.errors.name}
              </small>
            )}
          </div>

          <div>
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={formik.touched.gender && formik.errors.gender ? "error" : ""}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <small className="contrast" style={{ color: "red" }}>
                {formik.errors.gender}
              </small>
            )}
          </div>

          <div>
            <label htmlFor="image">Profile Picture</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(event) => {
                if (event.currentTarget.files && event.currentTarget.files[0]) {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("image", file);
                  // Create a preview URL for the uploaded image
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />
            {/* Image Preview (shown if 'preview' is set) */}
            {preview && (
              <img
                src={preview}
                alt="Preview"
                style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  maxWidth: '100%',
                  height: 'auto'
                }}
              />
            )}
          </div>

          <button
            type="submit"
            className="primary"
            style={{
              width: '100%',
              marginTop: '1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              padding: '0.75rem',
              fontSize: '1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            COMPLETE PROFILE
          </button>
        </form>
      </article>
    </main>
  );
}

export default CompleteProfile;
