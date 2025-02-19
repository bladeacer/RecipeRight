import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import http from "../../http";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditReward() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const { id } = useParams();
  const [reward, setReward] = useState({
    rewardname: "",
    description: "",
    point: 0,
  });
  const [loading, setLoading] = useState(true);
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
          console.log(res.data);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  useEffect(() => {
    http.get(`/reward/${id}`).then((res) => {
      setReward(res.data);
      setImageFile(res.data.imageFile);
      setLoading(false);
    });
  }, []);

  const formik = useFormik({
    initialValues: reward,
    enableReinitialize: true,
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
      point: yup
        .number()
        .min(1, "Reward must be minimum worth 1 point")
        .required(),
    }),
    onSubmit: (data) => {
      if (imageFile) {
        data.imageFile = imageFile;
      }
      data.rewardname = data.rewardname.trim();
      data.description = data.description.trim();
      data.point = data.point;
      try {
        http.put(`/reward/${id}`, data).then((res) => {
          console.log(res.data);
          toast.success("Reward updated successfully");
          navigate("/staffreward");
        });
      }
      catch (error) {
        console.log(error.response); 
        toast.error("An error occurred. Please try again.");
      }
    },
  });

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const deleteReward = () => {
    http.delete(`/reward/${id}`).then((res) => {
      console.log(res.data);
      navigate("/staffreward");
    });
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ my: 2 }}>
        Edit Reward
      </Typography>
      {!loading && (
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
                error={
                  formik.touched.rewardname && Boolean(formik.errors.rewardname)
                }
                helperText={
                  formik.touched.rewardname && formik.errors.rewardname
                }
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
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
              <TextField
                sx={{ width: "50%" }}
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
                      alt="staffaccount"
                      src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                    ></img>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" type="submit" color="success">
              Update
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 2 }}
              color="error"
              onClick={handleOpen}
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Reward</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this reward?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={deleteReward}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </Box>
  );
}

export default EditReward;
