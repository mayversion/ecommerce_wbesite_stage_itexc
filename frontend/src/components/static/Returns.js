import React from 'react';
import { Box, Container, Typography, Paper, List, ListItem, ListItemText, Grid, Divider } from '@mui/material';

export default function Returns() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom>Returns & Exchanges</Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, opacity: 0.9 }}>
          We offer a 30‑day return window on most items. Start your return through your order page.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Eligibility</Typography>
              <List>
                <ListItem><ListItemText primary="Timing" secondary="Within 30 days of delivery." /></ListItem>
                <ListItem><ListItemText primary="Condition" secondary="Unused, in original packaging with all tags/accessories." /></ListItem>
                <ListItem><ListItemText primary="Non‑returnable" secondary="Gift cards, downloadable items, and final‑sale products." /></ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>How to start a return</Typography>
              <List>
                <ListItem><ListItemText primary="1. Go to Orders" secondary="Open 'My Orders' and select the order containing the item." /></ListItem>
                <ListItem><ListItemText primary="2. Choose Return" secondary="Pick a reason and preferred resolution (refund or exchange)." /></ListItem>
                <ListItem><ListItemText primary="3. Ship it back" secondary="Use the provided label and drop off within 7 days." /></ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>Refunds & exchanges</Typography>
              <List>
                <ListItem><ListItemText primary="Refund timing" secondary="Issued to original payment method 3–7 business days after inspection." /></ListItem>
                <ListItem><ListItemText primary="Exchanges" secondary="We ship the replacement once the return is in transit or received." /></ListItem>
                <ListItem><ListItemText primary="Return shipping" secondary="If the return is due to our error/defect, we cover shipping." /></ListItem>
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Notes</Typography>
              <List>
                <ListItem><ListItemText primary="Large items" secondary="May require scheduled pickup; we’ll coordinate with you." /></ListItem>
                <ListItem><ListItemText primary="Bundles" secondary="Items purchased as a bundle must be returned together." /></ListItem>
                <ListItem><ListItemText primary="Received a defective item?" secondary="Contact us via the Contact page for priority support." /></ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
