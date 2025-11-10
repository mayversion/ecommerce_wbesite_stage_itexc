import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function Privacy() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>Privacy Policy</Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
          Your privacy matters. This page explains what data we collect, how we use it, and your choices.
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Information we collect</Typography>
          <List>
            <ListItem><ListItemText primary="Account details" secondary="Name, email, and password (hashed)." /></ListItem>
            <ListItem><ListItemText primary="Order info" secondary="Shipping address, phone, purchased items, and payment status." /></ListItem>
            <ListItem><ListItemText primary="Usage data" secondary="Pages viewed, device/browser info, and interactions for analytics." /></ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>How we use information</Typography>
          <List>
            <ListItem><ListItemText primary="Provide services" secondary="Process orders, shipping, and account features." /></ListItem>
            <ListItem><ListItemText primary="Improve experience" secondary="Troubleshoot issues and enhance site performance." /></ListItem>
            <ListItem><ListItemText primary="Communications" secondary="Order updates and optional marketing (opt‑out anytime)." /></ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Your rights</Typography>
          <List>
            <ListItem><ListItemText primary="Access & correction" secondary="Request a copy of your data or ask us to fix inaccuracies." /></ListItem>
            <ListItem><ListItemText primary="Deletion" secondary="Ask us to delete your account and associated personal data." /></ListItem>
            <ListItem><ListItemText primary="Marketing preferences" secondary="Manage newsletter settings at any time." /></ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Cookies</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            We use essential cookies for site functionality and analytics cookies to understand usage. You can control cookies in your browser settings.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Contact</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Questions? Email us at maymehenni1@gmail.com.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
