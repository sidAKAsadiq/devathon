import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    CircularProgress,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import axios from "../axios.js"; // for API calls
import Navbar from "../components/Navbar";

function CredentialsPage() {
    return (
        <>
            <Navbar />
            <CredentialsContent />
        </>
    );
}

function CredentialsContent() {
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [dynamicQuiz, setDynamicQuiz] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [quizStatus, setQuizStatus] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(""); // State for selected skill
    const [loadingQuiz, setLoadingQuiz] = useState(false); // State for quiz loading
    const [quizError, setQuizError] = useState(null); // State for handling quiz errors

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse stored user", err);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/"); // redirect to login if not authenticated
        }
    }, [user, loading, navigate]);

    /*useEffect(() => {
        if (user && selectedSkill && !loadingQuiz && dynamicQuiz === null) {
            fetchDynamicQuiz(selectedSkill);
        }
    }, [user, selectedSkill]); */


    const fetchDynamicQuiz = async (skill) => {
        setLoadingQuiz(true); // Start loading quiz
        setQuizError(null); // Reset any previous errors
        try {
            const response = await axios.get(`http://localhost:3000/api/skills/quiz?skill=${selectedSkill}`);
            console.log(response)
            if (response.data && response.data.data?.length > 0) {
                setDynamicQuiz(response.data.data);
            } else {
                setDynamicQuiz([]); // explicitly empty array
            }

            setLoadingQuiz(false); // Stop loading quiz once fetched
        } catch (error) {
            console.error("Error fetching dynamic quiz:", error);
            setQuizError("There was an error fetching the quiz. Please try again later.");
            setLoadingQuiz(false); // Stop loading quiz in case of error
        }
    };

    const handleAnswerChange = (index, answer) => {
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = answer;
        setUserAnswers(updatedAnswers);
        console.log(index, "answer")
        console.log(userAnswers, "userAnswers");
        console.log(updatedAnswers, "updatedAnswers");


    };

    const handleSubmitQuiz = async () => {
        console.log(user?.email, selectedSkill, userAnswers, dynamicQuiz);

        try {
            const response = await axios.post(`http://localhost:3000/api/skills/verify`, {
                email: user.email,
                skill: selectedSkill, // Send the selected skill
                answers: userAnswers,
                quiz: dynamicQuiz,
            });
            console.log(response)
            setQuizStatus(response.data.data.status);
        } catch (error) {
            console.error("Error submitting quiz:", error);
        }
    };

    if (loading || !user) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                    <Typography variant="body2" color="textSecondary" mt={2}>
                        Please wait while we load your credentials...
                    </Typography>
                </div>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Box mb={4}>
                <Typography variant="h4" fontWeight="bold">
                    Your Credentials
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Manage and share your verified skills and certifications
                </Typography>
            </Box>

            <Tabs
                value={tab}
                onChange={(e, newTab) => setTab(newTab)}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Earned Credentials" />
                <Tab label="In Progress" />
                <Tab label="Available Assessments" />
            </Tabs>

            <Box mt={4}>
                {tab === 0 && (
                    <Grid container spacing={3}>
                        {/* Render earned credentials */}
                    </Grid>
                )}

                {tab === 1 && (
                    <Grid container spacing={3}>
                        {/* Render in-progress courses */}
                    </Grid>
                )}

                {tab === 2 && (
                    <Grid container spacing={3}>
                        {/* Skill selection dropdown */}
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    label="Enter Skill"
                                    variant="outlined"
                                    value={selectedSkill}
                                    onChange={(e) => setSelectedSkill(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => fetchDynamicQuiz(selectedSkill)}
                                disabled={!selectedSkill || loadingQuiz}
                            >
                                Generate Quiz
                            </Button>
                        </Grid>



                        {/* Loading or Error States */}
                        {loadingQuiz && (
                            <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
                                <CircularProgress />
                                <Typography variant="body2" color="textSecondary" mt={2}>
                                    Loading quiz...
                                </Typography>
                            </Box>
                        )}

                        {quizError && (
                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="body1" color="error">
                                            {quizError}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}

                        {dynamicQuiz && !loadingQuiz && (
                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">Skill: {selectedSkill} (Quiz)</Typography>
                                        {dynamicQuiz?.map((question, index) => (
                                            <Box key={index} mt={2}>
                                                <Typography variant="body1">{question.question}</Typography>
                                                {question?.options.map((option, optionIndex) => (
                                                    <Button
                                                        key={optionIndex}
                                                        variant="outlined"
                                                        onClick={() => handleAnswerChange(index, optionIndex)}
                                                    >
                                                        {option}
                                                    </Button>
                                                ))}
                                            </Box>
                                        ))}
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmitQuiz}
                                        >
                                            Submit Quiz
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )}

                        {Array.isArray(dynamicQuiz) && dynamicQuiz.length === 0 && !loadingQuiz && !quizError && (
                            <Grid item xs={12}>
                                <Typography variant="body1" color="textSecondary">
                                    No quiz available for this skill yet.
                                </Typography>
                            </Grid>
                        )}


                        {quizStatus && (
                            <Grid item xs={12}>
                                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="h6">
                                            Quiz Status: {quizStatus === "passed" ? "Passed" : "Failed"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Box>
    );
}

export default CredentialsPage;
