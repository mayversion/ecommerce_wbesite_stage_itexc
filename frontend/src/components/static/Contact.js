import React from 'react';
import { Box, Container, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function Contact() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (!name || !email || !message) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post('/api/contact/submit', { name, email, message });
      setSuccess(data?.message || 'Message sent. We will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send your message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>Contact</Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
          We’d love to hear from you. Reach out and we’ll get back within 1–2 business days.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Contact information</Typography>
              <List>
                <ListItem button component="a" href="mailto:maymehenni1@gmail.com">
                  <ListItemIcon><EmailIcon /></ListItemIcon>
                  <ListItemText primary="Email" secondary="maymehenni1@gmail.com" />
                </ListItem>
                <ListItem button component="a" href="tel:+15551234567">
                  <ListItemIcon><PhoneIcon /></ListItemIcon>
                  <ListItemText primary="Phone" secondary="+1 (555) 123‑4567" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><LocationOnIcon /></ListItemIcon>
                  <ListItemText primary="Location" secondary="Algiers, Algeria" />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Hours: Mon–Fri, 9:00–17:00</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Send us a message</Typography>
              {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
                <TextField label="Your name" value={name} onChange={(e)=>setName(e.target.value)} fullWidth />
                <TextField label="Your email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth />
                <TextField label="Message" value={message} onChange={(e)=>setMessage(e.target.value)} fullWidth multiline minRows={4} />
                <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send'}</Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
