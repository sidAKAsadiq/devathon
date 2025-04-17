import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Paper,
    Box,
    IconButton,
    Avatar,
    Divider,
    Input,
    TextField,
    List,
    ListItem,
    ListItemText,
    CircularProgress,
    Fade,
    Grid
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

const SkillsAnalysisPage = () => {
    const [form, setForm] = useState({ name: "", email: "", careerGoal: "", jobDescription: "" });
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") setSelectedFile(file);
        else {
            alert("Please upload a valid PDF file.");
            e.target.value = null;
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return alert("Upload your resume first");
        if (!form.name || !form.email || !form.careerGoal || !form.jobDescription)
            return alert("Please fill all fields");

        const formData = new FormData();
        formData.append("resume", selectedFile);
        Object.entries(form).forEach(([key, val]) => formData.append(key, val));

        setLoading(true);
        try {
            const response = await fetch("http://localhost:3000/api/skill-gap/analyze/pdf", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            setAnalysisResult(data.data);
        } catch (error) {
            alert("Failed to analyze resume. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderSkillsList = (title, skills = []) => (
        <Box sx={{ mb: 5 }}>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: "bold",
                    mb: 2,
                    background: "linear-gradient(to right, #43cea2, #185a9d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                {title}
            </Typography>

            <Grid container spacing={2}>
                {skills.map((skill, i) => (
                    <Grid item xs={6} sm={4} md={3} key={i}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                            viewport={{ once: true }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    background: "rgba(255, 255, 255, 0.25)", // More visible
                                    backdropFilter: "blur(12px)",
                                    border: "1px solid rgba(255, 255, 255, 0.3)",
                                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                                    color: "#0a0a0a", // Changed from white to dark text
                                    fontWeight: 500,
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0 8px 40px rgba(72, 239, 168, 0.4)",
                                    },
                                }}
                            >
                                {skill}
                            </Paper>

                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: "Poppins" }}>
                    Skill Gap Analyzer
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" mb={3}>
                    Upload your resume and career goal to find your skill match.
                </Typography>

                <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, boxShadow: "0px 4px 20px rgba(0,0,0,0.05)" }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Resume & Info
                    </Typography>

                    <Box component="form" noValidate autoComplete="off" sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                        {["name", "email", "careerGoal"].map((field) => (
                            <TextField
                                key={field}
                                label={field.replace(/([A-Z])/g, " $1")}
                                name={field}
                                value={form[field]}
                                onChange={handleChange}
                                required
                                fullWidth
                            />
                        ))}
                        <TextField
                            label="Job Description"
                            name="jobDescription"
                            value={form.jobDescription}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            required
                            fullWidth
                        />
                    </Box>

                    <Box
                        sx={{
                            border: "2px dashed #a5d6a7",
                            borderRadius: 2,
                            p: 5,
                            textAlign: "center",
                            mb: 3,
                            background: "#f1f8e9",
                            transition: "0.3s",
                            ":hover": { borderColor: "#66bb6a" },
                        }}
                    >
                        <CloudUploadIcon fontSize="large" color="success" sx={{ mb: 1 }} />
                        <Typography variant="body1" fontWeight={500} mb={1}>
                            Upload your resume (PDF only)
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mb={2}>
                            Max size: 5MB
                        </Typography>
                        <label htmlFor="upload-file">
                            <Input id="upload-file" type="file" inputProps={{ accept: ".pdf" }} onChange={handleFileChange} sx={{ display: "none" }} />
                            <Button variant="outlined" component="span" color="success" sx={{ borderRadius: 2, px: 3 }}>
                                Browse Files
                            </Button>
                        </label>
                        {selectedFile && (
                            <Typography variant="body2" mt={1} color="primary">
                                Selected: {selectedFile.name}
                            </Typography>
                        )}
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1.5,
                            mb: 2,
                            backgroundColor: "#f9fbe7",
                            p: 2,
                            borderRadius: 2,
                        }}
                    >
                        <InfoOutlinedIcon color="action" />
                        <Typography variant="body2" color="textSecondary">
                            Resume data is used only for analysis. We do not share your personal info with anyone.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Button
                        fullWidth
                        size="large"
                        variant="contained"
                        color="success"
                        sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 3 }}
                        onClick={handleAnalyze}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Analyze My Skills"}
                    </Button>
                </Paper>

                {analysisResult && (
                    <Fade in={!!analysisResult}>
                        <Paper
                            variant="outlined"
                            sx={{ p: 4, borderRadius: 4, mt: 5, background: "#f9f9f9", border: "1px solid #e0e0e0" }}
                        >
                            <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: "#2e7d32" }}>
                                Analysis Result
                            </Typography>
                            {renderSkillsList("Resume Skills", analysisResult.resumeSkills)}
                            {renderSkillsList("Job Skills", analysisResult.jobSkills)}
                            {renderSkillsList("Missing Skills", analysisResult.missingSkills)}
                            {renderSkillsList("Transferable Skills", analysisResult.transferableSkills)}
                        </Paper>
                    </Fade>
                )}
            </Container>
        </>
    );
};

export default SkillsAnalysisPage;
