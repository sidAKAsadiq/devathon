import React from "react";
import { AppBar, Toolbar, Typography, Button, Grid, Card, CardContent, Container, Box } from "@mui/material";

const SkillBridgePage = () => {
  console.log("function called");
  return (
    <>
      {/* Header */}
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            SkillBridge
          </Typography>
          <Button color="inherit">Login</Button>
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: "#00b386", color: "white", py: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Bridge Your Skills Gap with AI-Powered Career Growth
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Identify your skill gaps, get personalized learning recommendations, and connect directly to job opportunities that match your growing abilities.
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} color="secondary">
          Get Started
        </Button>
      </Box>

      {/* How It Works */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          How SkillBridge Works
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Skill Gap Analysis", desc: "Identify where you stand and what you need to grow professionally." },
            { title: "Personalized Learning", desc: "Get learning paths tailored to your exact needs and goals." },
            { title: "Skill Verification", desc: "Validate your skills through assessments and real-world challenges." },
            { title: "Job Matching", desc: "Connect with employers looking for exactly your skill set." },
            { title: "Career Visualization", desc: "Understand your potential career paths with visual roadmaps." },
          ].map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: "#00b386", color: "white" }}>
              <CardContent>
                <Typography variant="h6">Ready to Grow?</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Join thousands of professionals who’ve taken the next step with SkillBridge.
                </Typography>
                <Button variant="contained" color="secondary">
                  Create Free Account
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6, textAlign: "center" }}>
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Typography variant="h5">85%</Typography>
            <Typography variant="body2">of users found jobs within 3 months</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5">10,000+</Typography>
            <Typography variant="body2">learners and growing</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h5">92%</Typography>
            <Typography variant="body2">employer satisfaction with skill-matching</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Testimonials */}
      <Container sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Success Stories
        </Typography>
        <Card sx={{ maxWidth: 600, margin: "0 auto" }}>
          <CardContent>
            <Typography variant="body1" gutterBottom>
              “The skill verification feature was a game-changer for me. Being able to showcase verified competencies to employers gave me an edge in the hiring market. I landed my dream UX role!”
            </Typography>
            <Typography variant="subtitle2">— Alex R.</Typography>
          </CardContent>
        </Card>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: "#00b386", color: "white", py: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Ready to Transform Your Career?
        </Typography>
        <Typography variant="subtitle1">
          Join thousands of professionals who have used SkillBridge to identify their skill gaps, learn in-demand skills, and land their dream jobs.
        </Typography>
        <Button variant="contained" color="secondary" sx={{ mt: 2 }}>
          Get Started Now
        </Button>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "#222", color: "#ccc", py: 4, mt: 4 }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>SkillBridge</Typography>
              <Typography variant="body2">Empowering careers through AI-driven insights.</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>Features</Typography>
              <Typography variant="body2">Dashboard</Typography>
              <Typography variant="body2">Skill Analysis</Typography>
              <Typography variant="body2">Learning Paths</Typography>
              <Typography variant="body2">Job Matching</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>Company</Typography>
              <Typography variant="body2">About</Typography>
              <Typography variant="body2">Careers</Typography>
              <Typography variant="body2">Contact</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" gutterBottom>Legal</Typography>
              <Typography variant="body2">Terms of Use</Typography>
              <Typography variant="body2">Privacy Policy</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default SkillBridgePage;
