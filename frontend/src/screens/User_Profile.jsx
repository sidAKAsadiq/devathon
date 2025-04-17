import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Stack,
    Divider,
} from "@mui/material";

function Profile() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const email = "junaid@gmail.com"; // Or get this dynamically if using auth

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/user/profile/${email}`);
                setUserProfile(response.data.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile.");
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" mt={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const { name, careerGoal, email: userEmail, missingSkills, transferableSkills, verifiedSkills } = userProfile;

    return (
        <Box p={4}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                User Profile
            </Typography>

            <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6">Name: {name}</Typography>
                    <Typography variant="body1">Email: {userEmail}</Typography>
                    <Typography variant="body1">Career Goal: {careerGoal}</Typography>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Missing Skills</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {missingSkills.map((skill, index) => (
                                    <Chip label={skill} key={index} color="warning" />
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Transferable Skills</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={1}>
                                {transferableSkills.map((skill, index) => (
                                    <Chip label={skill} key={index} color="info" />
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Verified Skills</Typography>
                            {verifiedSkills.length === 0 ? (
                                <Typography variant="body2">No verified skills yet.</Typography>
                            ) : (
                                verifiedSkills.map((skillObj) => (
                                    <Box key={skillObj._id} mb={2}>
                                        <Typography variant="body1">
                                            <strong>{skillObj.skill}</strong> - Verified by {skillObj.method}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Issued At: {new Date(skillObj.issuedAt).toLocaleDateString()}
                                        </Typography>
                                        <Divider sx={{ my: 1 }} />
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default Profile;
