import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  CircularProgress,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Search,
  FilterList,
  ArrowForward,
  School,
  AccessTime,
  Star,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import axios from "../axios.js";

const LearningPathsPage = () => {
  return (
    <>
      <Navbar />
      <LearningPathsContent />
    </>
  );
};

const LearningPathsContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage");
        localStorage.removeItem("user");
        navigate("/");
      }
    } else {
      navigate("/");
    }
    setAuthLoading(false);
  }, [navigate]);
  



  const [tab, setTab] = useState(0);
  const [courses, setCourses] = useState([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return; // wait until user is loaded
  
      try {
        const response = await axios.post("/learning/recommend", {
          email: user.email,
        });
        console.log(response);
        
        setCourses(response.data.data.recommendedCourses || []);
      } catch (err) {
        setError("Failed to fetch recommended courses.");
      } finally {
        setIsLoadingCourses(false);
      }
    };
  
    fetchCourses();
  }, [user]); // dependency!
  

  return (
    <Box p={4} bgcolor="#f9fafb" minHeight="100vh">
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div>
          <Typography variant="h4" fontWeight="bold" color="#388e3c"> {/* Primary Green */}
            Skill-Based Learning Paths
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Courses recommended to you based on your skill gaps
          </Typography>
        </div>
        <Box display="flex" gap={2} mt={{ xs: 2, md: 0 }}>
          <TextField
            size="small"
            placeholder="Search courses..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            sx={{ textTransform: "none", borderColor: "#388e3c", color: "#388e3c" }} // Green border and text
          >
            Filters
          </Button>
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        indicatorColor="primary"
        textColor="primary"
        sx={{
          "& .MuiTab-root": {
            color: "#388e3c", // Green for Tab labels
          },
          "& .Mui-selected": {
            color: "#388e3c", // Green for selected Tab label
          },
        }}
      >
        <Tab label="Recommended" />
        <Tab label="In Progress" />
        <Tab label="Completed" />
        <Tab label="All Courses" />
      </Tabs>

      <Box mt={4}>
        {tab === 0 && (
          <>
            {isLoadingCourses ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : courses.length === 0 ? (
              <Typography>No recommended courses found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {courses.map((course, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        transition: "transform 0.2s ease, box-shadow 0.3s ease",
                        borderRadius: 3,
                        boxShadow: 3,
                        "&:hover": {
                          transform: "translateY(-5px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {course.title || course.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {course.platform || "No platform specified"}
                        </Typography>

                        <Box mt={2}>
                          <Chip
                            icon={<School fontSize="small" />}
                            label={course.skillCovered || "General"}
                            variant="outlined"
                            size="small"
                            sx={{ mr: 1, borderColor: "#388e3c", color: "#388e3c" }}
                          />
                          {course.duration && (
                            <Chip
                              icon={<AccessTime fontSize="small" />}
                              label={course.duration}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, borderColor: "#388e3c", color: "#388e3c" }}
                            />
                          )}
                          {course.rating && (
                            <Chip
                              icon={<Star fontSize="small" />}
                              label={course.rating}
                              size="small"
                              variant="outlined"
                              color="warning"
                            />
                          )}
                        </Box>
                      </CardContent>

                      <CardActions>
                        <Button
                          size="small"
                          variant="outlined"
                          endIcon={<ArrowForward />}
                          href={course.link || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            ml: 1,
                            mb: 1,
                            textTransform: "none",
                            transition: "all 0.2s",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                        >
                          View Course
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tab === 1 && (
          <Typography variant="body1">
            In Progress Courses Content (Coming soon)
          </Typography>
        )}
        {tab === 2 && (
          <Typography variant="body1">
            Completed Courses Content (Coming soon)
          </Typography>
        )}
        {tab === 3 && (
          <Typography variant="body1">
            All Courses Content (Coming soon)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LearningPathsPage;
