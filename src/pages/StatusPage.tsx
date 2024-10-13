import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button, Table, TableRow, TableCell } from "@mui/material";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  jobName: string;
  submissionDate: string;
  execution: string;
  status: string;
}

const StatusPage = () => {
  // Fetching jobs data from the API using react-query
  const { data, error, isLoading } = useQuery<Job[]>(["jobs"], async () => {
    const response = await axios.get("/api/jobs"); // Replace with API endpoint
    return response.data;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching jobs</p>;

  return (
    <Table>
      {data.map((job: Job) => (
        <TableRow key={job.id}>
          <TableCell>{job.jobName}</TableCell>
          <TableCell>{job.submissionDate}</TableCell>
          <TableCell>{job.status}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              component={Link}
              to={`/request/${job.id}`}
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
