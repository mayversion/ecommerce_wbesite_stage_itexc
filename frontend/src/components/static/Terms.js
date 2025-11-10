import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

export default function Terms() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>Terms of Service</Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
          These terms govern your use of our website and services. Please read them carefully.
        </Typography>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Use of the service</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            You agree to use the site in compliance with applicable laws and not to misuse any features.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Accounts</Typography>
          <List>
            <ListItem><ListItemText primary="Accuracy" secondary="Provide accurate information and keep your credentials secure." /></ListItem>
            <ListItem><ListItemText primary="Responsibility" secondary="You’re responsible for activity under your account." /></ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Orders & payments</Typography>
          <List>
            <ListItem><ListItemText primary="Pricing" secondary="Prices may change without notice; taxes and shipping may apply." /></ListItem>
            <ListItem><ListItemText primary="Payment" secondary="We accept major payment methods processed securely by our provider." /></ListItem>
            <ListItem><ListItemText primary="Cancellations" secondary="We may cancel orders due to stock or suspected fraud; you’ll be refunded." /></ListItem>
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Shipping</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Delivery estimates are provided at checkout. Risk of loss transfers upon carrier acceptance unless otherwise required by law.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Returns</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            See our Returns policy for eligibility, timelines, and processes.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Limitations</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            To the fullest extent permitted, we disclaim warranties and limit liability for indirect or consequential damages.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>Governing law</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            These terms are governed by the laws of your local jurisdiction unless otherwise required.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
