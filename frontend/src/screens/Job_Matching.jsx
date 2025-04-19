import React, { useEffect, useState } from "react";
import axios from "../axios.js";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    TextField,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    CircularProgress,
    Link as MuiLink
} from "@mui/material";
import { Search, FilterList, LocationOn, AccessTime } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// Dummy Navbar component
const Navbar = () => (
    <Box p={2} bgcolor="#e8f5e9">
        <Typography variant="h6" fontWeight="bold" color="green">
            SkillBridge
        </Typography>
    </Box>
);


export default function JobMatchingPage() {
    return (
        <>
            <Navbar />
            <JobMatchingContent />
        </>
    );
}

function JobMatchingContent() {
    const [tab, setTab] = useState(0);
    const [jobMatches, setJobMatches] = useState([]);
    const [search, setSearch] = useState("");
    const [isLoadingJobs, setIsLoadingJobs] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
 
    // Get user from localStorage
 useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user");
        navigate("/");
      }
    } else {
      navigate("/");
    }
    setLoading(false);
  }, [navigate]);




  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      setIsLoadingJobs(true);
      try {
        const res = await axios.post("http://localhost:3000/api/jobs/match", {
          email: user.email,
          goal: user.careerGoal || "software developer", // fallback
          location: "Remote", // or you can allow user input later
        });
        setJobMatches(res.data.data.recommendedJobs);
      } catch (err) {
        setError("Failed to fetch job matches.");
        console.error(err);
      } finally {
        setIsLoadingJobs(false);
      }
    };
  
    fetchJobs();
  }, [user]);

    const renderJobs = () => {
        if (isLoadingJobs) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        if (jobMatches.length === 0) {
            return <Typography>No matching jobs found.</Typography>;
        }

        return jobMatches.map((job, index) => (
            <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold">{job.job_title}</Typography>
                        <Typography variant="subtitle2" color="textSecondary">{job.employer_name || "Unknown Company"}</Typography>
                        <Box display="flex" alignItems="center" mt={1} gap={1}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">{job.job_location || "Remote"}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2">{job.job_employment_type || "N/A"}</Typography>
                        </Box>
                        <Box mt={1}>
                            <Typography variant="body2" color="textSecondary">
                                Match Score: {job.matchScore}%
                            </Typography>
                        </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "space-between", px: 2 }}>
                        <Button size="small" variant="outlined">Save</Button>
                        <MuiLink
                            href={job.job_apply_link || "#"}
                            target="_blank"
                            rel="noopener"
                            underline="none"
                            sx={{
                                fontSize: "0.875rem",
                                px: 2,
                                py: 0.5,
                                borderRadius: 1,
                                backgroundColor: "success.main",
                                color: "white",
                                textAlign: "center",
                                "&:hover": {
                                    backgroundColor: "success.dark",
                                    textDecoration: "none",
                                },
                            }}
                        >
                            Apply
                        </MuiLink>

                    </CardActions>
                </Card>
            </Grid>
        ));
    };

    if (loading || !user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="body1" mt={2}>Loading job matches...</Typography>
                </div>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Box display="flex" flexDirection={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems="center" mb={4}>
                <div>
                    <Typography variant="h4" fontWeight="bold">Job Matching</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Find opportunities that match your skills and career goals
                    </Typography>
                </div>
                <Box display="flex" gap={2} mt={{ xs: 2, md: 0 }}>
                    <TextField
                        size="small"
                        placeholder="Search jobs..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <Search fontSize="small" style={{ marginRight: 8 }} />,
                        }}
                    />
                    <Button variant="outlined" startIcon={<FilterList />}>Filters</Button>
                </Box>
            </Box>

            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} variant="scrollable" scrollButtons="auto">
                <Tab label="Best Matches" />
                <Tab label="Applied Jobs" />
                <Tab label="Saved Jobs" />
            </Tabs>

            <Box mt={4}>
                {tab === 0 && (
                    <Grid container spacing={3}>
                        {renderJobs()}
                    </Grid>
                )}
                {tab === 1 && (
                    <Typography variant="body2" color="textSecondary">
                        You haven’t applied to any jobs yet.
                    </Typography>
                )}
                {tab === 2 && (
                    <Typography variant="body2" color="textSecondary">
                        No saved jobs found.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
