import React, { useState } from 'react';
import { Box, Alert, IconButton, Typography } from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';

function ChangeSecurity() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // Visibility toggles for password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Password strength state (using the same style as your Register page)
  const [passwordStrength, setPasswordStrength] = useState({ color: "red", text: "Weak", width: "25%" });

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;

    if (score === 1) {
      setPasswordStrength({ color: "red", text: "Weak", width: "25%" });
    } else if (score === 2) {
      setPasswordStrength({ color: "orange", text: "Medium", width: "50%" });
    } else if (score === 3) {
      setPasswordStrength({ color: "green", text: "Strong", width: "75%" });
    } else if (score === 4) {
      setPasswordStrength({ color: "darkgreen", text: "Very Strong", width: "100%" });
    } else {
      setPasswordStrength({ color: "red", text: "Weak", width: "25%" });
    }
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newEmail: '',
      confirmNewEmail: '',
      newPassword: '',
      confirmNewPassword: ''
    },
    validationSchema: yup.object({
      currentPassword: yup.string().trim().required('Current password is required'),
      newEmail: yup.string().trim().email('Enter a valid email').nullable(),
      confirmNewEmail: yup.string().trim().oneOf([yup.ref('newEmail')], 'New emails do not match').nullable(),
      newPassword: yup.string().trim().min(8, 'New password must be at least 8 characters').max(50, 'New password must be at most 50 characters').nullable(),
      confirmNewPassword: yup.string().trim().oneOf([yup.ref('newPassword')], 'New passwords do not match').nullable()
    }),
    onSubmit: async (data) => {
      setError('');
      const formData = new FormData();
      formData.append('CurrentPassword', data.currentPassword.trim());
      if (data.newEmail) {
        formData.append('NewEmail', data.newEmail.trim().toLowerCase());
        formData.append('ConfirmNewEmail', data.confirmNewEmail.trim().toLowerCase());
      }
      if (data.newPassword) {
        formData.append('NewPassword', data.newPassword.trim());
        formData.append('ConfirmNewPassword', data.confirmNewPassword.trim());
      }
      try {
        await http.put('/user/change-security', formData);
        navigate('/profile');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Something went wrong. Please check all fields are filled in.');
      }
    }
  });

  // Handle New Password changes by updating formik and checking strength
  const handleNewPasswordChange = (e) => {
    formik.handleChange(e);
    checkPasswordStrength(e.target.value);
  };

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ alignSelf: 'flex-start', mb: 2, color: "var(--pico-background-white-500)" }}
      >
        <ArrowBack sx={{ mt: 0.5 }} /> Back
      </IconButton>
      <h4 style={{ mb: 4, textAlign: 'center' }}>Edit Security Information</h4>
      {error && <Alert severity="error">{error}</Alert>}
      
      <label> Current Password
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            required
            id="currentPassword"
            name="currentPassword"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formik.values.currentPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={formik.touched.currentPassword && formik.errors.currentPassword ? 'true' : 'false'}
            style={{ flex: 1 }}
          />
          <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)} size="small">
            {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
        {formik.touched.currentPassword && formik.errors.currentPassword && <small>{formik.errors.currentPassword}</small>}
      </label>
      
      <label>New Email
        <input
          id="newEmail"
          name="newEmail"
          value={formik.values.newEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={formik.touched.newEmail && formik.errors.newEmail ? 'true' : 'false'}
        />
        {formik.touched.newEmail && formik.errors.newEmail && <small>{formik.errors.newEmail}</small>}
      </label>
      
      <label>Confirm New Email
        <input
          id="confirmNewEmail"
          name="confirmNewEmail"
          value={formik.values.confirmNewEmail}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-invalid={formik.touched.confirmNewEmail && formik.errors.confirmNewEmail ? 'true' : 'false'}
        />
        {formik.touched.confirmNewEmail && formik.errors.confirmNewEmail && <small>{formik.errors.confirmNewEmail}</small>}
      </label>
      
      <label> New Password
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            id="newPassword"
            name="newPassword"
            type={showNewPassword ? 'text' : 'password'}
            value={formik.values.newPassword}
            onChange={handleNewPasswordChange}
            onBlur={formik.handleBlur}
            aria-invalid={formik.touched.newPassword && formik.errors.newPassword ? 'true' : 'false'}
            style={{ flex: 1 }}
          />
          <IconButton onClick={() => setShowNewPassword(!showNewPassword)} size="small">
            {showNewPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
        {formik.touched.newPassword && formik.errors.newPassword && <small>{formik.errors.newPassword}</small>}
        {/* Custom slider from your Register page */}
        <div style={{
          height: "8px",
          width: "100%",
          backgroundColor: "#ddd",
          borderRadius: "5px",
          marginTop: "5px",
          position: "relative"
        }}>
          <div style={{
            height: "100%",
            width: passwordStrength.width,
            backgroundColor: passwordStrength.color,
            borderRadius: "5px",
            transition: "width 0.3s ease-in-out"
          }}></div>
        </div>
        <p style={{ color: passwordStrength.color, fontWeight: "bold", fontSize: "14px", marginTop: "5px" }}>
          {passwordStrength.text}
        </p>
      </label>
      
      <label>Confirm New Password
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type={showConfirmNewPassword ? 'text' : 'password'}
            value={formik.values.confirmNewPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            aria-invalid={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword ? 'true' : 'false'}
            style={{ flex: 1 }}
          />
          <IconButton onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} size="small">
            {showConfirmNewPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Box>
        {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && <small>{formik.errors.confirmNewPassword}</small>}
      </label>
      
      <button type="submit">Change Security Settings</button>
    </Box>
  );
}

export default ChangeSecurity;
