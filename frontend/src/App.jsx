import React from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Helmet } from "react-helmet";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

const metadata = {
  title: "SkillBridge - Bridge Your Skills Gap with AI",
  description:
    "Identify your skill gaps, get personalized learning recommendations, and connect directly to job opportunities that match your growing skillset.",
};

function App() {
  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {/* Common layout can go here: header, sidebar, footer, etc. */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
