import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Table, TableRow, TableCell } from "@mui/material";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  name: string;
  submittedTime: string;
  executionTime: string;
  status: string;
}

const StatusPage = () => {
  // Fetching jobs data from the API using react-query
  const { data, error, isLoading } = useQuery<Job[]>({
    queryKey: ["jobs"], // Use an options object
    queryFn: async () => {
      const response = await axios.get("http://localhost:3000/jobs"); // Replace with API endpoint
      return response.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching jobs</p>;

  // Ensure data is an array before calling map
  const jobs = Array.isArray(data) ? data : [];

  return (
    <Table>
      {jobs?.map((job: Job) => (
        <TableRow key={job.id}>
          <TableCell>{job.name}</TableCell>
          <TableCell>{job.submittedTime}</TableCell>
          <TableCell>{job.status}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              component={Link}
              to={`/details/${job.id}`}
            >
              Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
};

export default StatusPage;
