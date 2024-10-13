// src/components/RequestPage.tsx

import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// Define the form structure and types
interface FormData {
  name: string;
  apiDetails: string;
  headers: { key: string; value: string }[];
  body: string;
  executionTime: Date | null;
}

// Default headers with one row to begin with
const defaultHeaders = [{ key: "", value: "" }];

export const RequestPage: React.FC = () => {
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      name: "",
      apiDetails: "POST",
      headers: defaultHeaders,
      body: "",
      executionTime: null,
    },
  });

  // Mutation to handle form submission via axios
  const mutation = useMutation((data: FormData) =>
    axios.post("/api/submit", data)
  );

  // Handle form submission
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  // Add new header row
  const addHeader = () => {
    const headers = watch("headers");
    setValue("headers", [...headers, { key: "", value: "" }]);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Request Form
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Name"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* API Details (Method) */}
          <Grid item xs={12}>
            <Controller
              name="apiDetails"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>API Method</InputLabel>
                  <Select {...field} label="API Method">
                    <MenuItem value="POST">POST</MenuItem>
                    <MenuItem value="GET">GET</MenuItem>
                    <MenuItem value="PUT">PUT</MenuItem>
                    <MenuItem value="DELETE">DELETE</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Grid>

          {/* Headers Section */}
          <Grid item xs={12}>
            <Typography variant="h6">Headers</Typography>
            {watch("headers").map((header, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={5}>
                  <Controller
                    name={`headers.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Header Key ${index + 1}`}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Controller
                    name={`headers.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={`Header Value ${index + 1}`}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="primary"
              onClick={addHeader}
              sx={{ mt: 2 }}
            >
              Add Header
            </Button>
          </Grid>

          {/* Body Section */}
          <Grid item xs={12}>
            <Controller
              name="body"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Body"
                  multiline
                  rows={6}
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Execution Time (optional) */}
          <Grid item xs={12}>
            <Controller
              name="executionTime"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Execution Time (optional)"
                  type="datetime-local"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              )}
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Submitting..." : "Submit"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Response Section */}
      {mutation.isSuccess && (
        <Box mt={4}>
          <Typography variant="h6">Response</Typography>
          <pre>{JSON.stringify(mutation.data?.data, null, 2)}</pre>
        </Box>
      )}

      {mutation.isError && (
        <Box mt={4} color="error.main">
          <Typography variant="h6">Error</Typography>
          <pre>{JSON.stringify(mutation.error, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default RequestPage;
