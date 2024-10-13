import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button, TextField, Grid2 } from "@mui/material";
import { useParams } from "react-router-dom";

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
  const { id } = useParams<{ id: string }>();

  // Fetch job data using useQuery
  const { data, error, isLoading } = useQuery<FormData>({
    queryKey: ["job", id],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:3000/jobs/${id}`);
      return response.data;
    },
  });

  // Initialize the form with fetched data as default values
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: data || {
      name: "",
      apiDetails: "POST",
      headers: defaultHeaders,
      body: "",
      executionTime: null,
    },
  });

  // Mutation to handle form submission via axios
  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      axios.put(`http://localhost:3000/jobs/${id}`, data),
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching job data</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid2 container spacing={2} columns={12}>
        <Grid2 component="section">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Name" fullWidth />
            )}
          />
        </Grid2>
        <Grid2>
          <Controller
            name="apiDetails"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="API Details" fullWidth />
            )}
          />
        </Grid2>
        <Grid2>
          <Controller
            name="body"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Body" fullWidth multiline rows={4} />
            )}
          />
        </Grid2>
        <Grid2>
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
        </Grid2>
        <Grid2>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Submit"}
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};

export default RequestPage;
