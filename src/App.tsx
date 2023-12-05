import Box from "@mui/material/Box";
import DashboardTable from "./components/DashboardTable";
import Paper from "@mui/material/Paper";

export default function App() {
  return (
    <Box
      sx={{
        bgcolor: "grey.100",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Paper elevation={3}>
        <DashboardTable />
      </Paper>
    </Box>
  );
}
