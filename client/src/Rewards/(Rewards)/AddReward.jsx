import React, { useState } from "react";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../http";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

function AddReward() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Maximum file size is 1MB");
        return;
      }
      let formData = new FormData();
      formData.append("file", file);
      http
        .post("/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      rewardname: "",
      description: "",
      point: 0,
      expirydate: dayjs(), // Initialize with dayjs
    },
    validationSchema: yup.object({
      rewardname: yup
        .string()
        .trim()
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be at most 100 characters")
        .required("Title is required"),
      description: yup
        .string()
        .trim()
        .min(3, "Description must be at least 3 characters")
        .max(500, "Description must be at most 500 characters")
        .required("Description is required"),
      point: yup.number().min(1, "Points must be more than 1").required(),
      expirydate: yup.date().min(dayjs()).required("Expiry date is required"),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.rewardname = data.rewardname.trim();
      data.description = data.description.trim();
      data.point = data.point;
      data.expirydate = data.expirydate
      try {
        http.post("/reward", data).then((res) => {
          console.log(res.data);
          toast.success("Reward added successfully");
          navigate("/staffreward");
        });
      }
      catch (error) {
        console.log(error.response);
        toast.error("Failed to add reward");
      }

    },
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Add Reward
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={8}>
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              label="Title"
              name="rewardname"
              value={formik.values.rewardname}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.rewardname && Boolean(formik.errors.rewardname)}
              helperText={formik.touched.rewardname && formik.errors.rewardname}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              multiline
              minRows={2}
              label="Description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              fullWidth
              margin="dense"
              autoComplete="off"
              multiline
              minRows={1}
              label="Points"
              name="point"
              value={formik.values.point}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.point && Boolean(formik.errors.point)}
              helperText={formik.touched.point && formik.errors.point}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Expiry Date"
                value={formik.values.expirydate}
                onChange={(date) => formik.setFieldValue("expirydate", date)}
                onBlur={formik.handleBlur}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="dense"
                    error={formik.touched.expirydate && Boolean(formik.errors.expirydate)}
                    helperText={formik.touched.expirydate && formik.errors.expirydate}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Button variant="contained" component="label">
                Upload Image
                <input
                  hidden
                  accept="image/*"
                  multiple
                  type="file"
                  onChange={onFileChange}
                />
              </Button>
              {imageFile && (
                <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                  <img
                    alt="tutorial"
                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                  />
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" type="submit">
            Add
          </Button>
        </Box>
      </Box>
      <ToastContainer/>
    </Box>
  );
}

export default AddReward;
