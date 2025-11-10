import React from 'react';
import { Box, Container, Typography, Grid, Paper, Divider, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function About() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>About Us</Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
          We’re on a mission to make high‑quality products accessible, with an experience that’s fast, friendly, and transparent.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Our Mission</Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                We curate products from trusted partners and bring them to you with fair pricing, reliable delivery, and real support.
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h5" gutterBottom>What We Value</Typography>
              <List>
                <ListItem><ListItemText primary="Quality first" secondary="We select items that stand up to daily use." /></ListItem>
                <ListItem><ListItemText primary="Customer obsession" secondary="Your experience drives our roadmap and decisions." /></ListItem>
                <ListItem><ListItemText primary="Transparency" secondary="Clear pricing, clear timelines, clear policies." /></ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>At a glance</Typography>
              <List>
                <ListItem><ListItemText primary="10k+" secondary="Orders fulfilled" /></ListItem>
                <ListItem><ListItemText primary="48h avg" secondary="Support response time" /></ListItem>
                <ListItem><ListItemText primary="30 days" secondary="Hassle‑free returns" /></ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>FAQs</Typography>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>How do you choose products?</AccordionSummary>
            <AccordionDetails>
              We evaluate supplier reliability, material quality, and customer feedback before listing items.
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>Where do you ship?</AccordionSummary>
            <AccordionDetails>
              We currently ship domestically with international expansion planned. See Shipping Info in the footer for details.
            </AccordionDetails>
          </Accordion>
        </Box>
      </Container>
    </Box>
  );
}
