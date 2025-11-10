import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Typography, Paper, Box, Button, Alert, Avatar, Divider, Grid } from '@mui/material';
import axios from 'axios';

const Profile = () => {
  const { user } = useSelector(state => state.auth);
  const [nlMsg, setNlMsg] = useState('');
  const [nlErr, setNlErr] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user?.email) return;
      try {
        const { data } = await axios.get('/api/newsletter/status', { params: { email: user.email } });
        setIsSubscribed(!!data?.subscribed);
      } catch (e) {
        // ignore status errors in UI
      }
    };
    checkStatus();
  }, [user?.email]);

  const handleSubscribe = async () => {
    setNlMsg('');
    setNlErr('');
    try {
      const { data } = await axios.post('/api/newsletter/subscribe', { email: user?.email, source: 'profile' });
      setNlMsg(data.message || 'Subscribed successfully');
      setIsSubscribed(true);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Subscribe failed';
      setNlErr(msg);
    }
  };

  const handleUnsubscribe = async () => {
    setNlMsg('');
    setNlErr('');
    try {
      const { data } = await axios.post('/api/newsletter/unsubscribe', { email: user?.email });
      setNlMsg(data.message || 'Unsubscribed successfully');
      setIsSubscribed(false);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unsubscribe failed';
      setNlErr(msg);
    }
  };
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        {!user ? (
          <Typography variant="body1">Please log in to view your profile.</Typography>
        ) : (
          <Box>
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Avatar sx={{ width: 72, height: 72 }}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="h6">{user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                <Typography variant="caption" color="text.secondary">Role: {user?.role || 'user'}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              Manage your preferences
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              {isSubscribed ? (
                <Button variant="outlined" color="error" onClick={handleUnsubscribe} disabled={!user?.email}>
                  Unsubscribe from newsletter
                </Button>
              ) : (
                <Button variant="contained" color="secondary" className="glow-button" onClick={handleSubscribe} disabled={!user?.email}>
                  Subscribe to newsletter
                </Button>
              )}
              {nlMsg && <Alert severity="success">{nlMsg}</Alert>}
              {nlErr && <Alert severity="error">{nlErr}</Alert>}
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Profile;




