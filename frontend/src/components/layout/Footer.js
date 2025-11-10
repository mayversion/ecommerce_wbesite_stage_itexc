import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link as MuiLink,
  IconButton,
  Divider,
  Paper,
  Button,
  Alert
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const submitNewsletter = async (e) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (!email) return;
    try {
      setLoading(true);
      const { data } = await axios.post('/api/newsletter/subscribe', { email, source: 'footer' });
      setMsg(data.message || 'Subscribed successfully');
      setEmail('');
    } catch (error) {
      setErr(error?.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="footer" sx={{ mt: 'auto' }}>
      {/* Newsletter top section */}
      <Box sx={{ background: 'linear-gradient(180deg, #1F2937, #111827)', color: '#fff', py: 6 }}>
        <Container maxWidth="lg">
          <Paper className="glass-card" sx={{ p: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, background: 'rgba(17,20,40,0.45)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}>
            <Box sx={{ flex: 1, minWidth: 240 }}>
              <Typography variant="h5" sx={{ background: 'linear-gradient(90deg, #fff, #F472B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Join our newsletter
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>Get product news and exclusive offers.</Typography>
            </Box>
            <Box component="form" onSubmit={submitNewsletter} sx={{ display: 'flex', gap: 1, flex: 1, minWidth: 260 }}>
              <Box component="input" type="email" placeholder="Your email" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="footer-input footer-input--dark" style={{ flex: 1 }} />
              <Button type="submit" variant="contained" color="secondary" disabled={loading} className="glow-button">{loading ? 'Subscribing...' : 'Subscribe'}</Button>
            </Box>
            {msg && <Alert severity="success" sx={{ ml: 'auto' }}>{msg}</Alert>}
            {err && <Alert severity="error" sx={{ ml: 'auto' }}>{err}</Alert>}
          </Paper>
        </Container>
      </Box>

      {/* Main footer section */}
      <Box sx={{ background: 'linear-gradient(180deg, #1F2937, #111827)', color: '#fff', py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'inline-block', borderLeft: '4px solid', borderImage: 'linear-gradient(180deg,#EC4899,#8B5CF6) 1', pl: 1 }}>
                May Store
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, opacity: 0.85 }}>
                Your one-stop shop for quality products. We provide the best shopping experience.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, i) => (
                  <IconButton key={i} className="social-icon" size="small" color="inherit" aria-label="social">
                    <Icon />
                  </IconButton>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'inline-block', borderLeft: '4px solid', borderImage: 'linear-gradient(180deg,#EC4899,#8B5CF6) 1', pl: 1 }}>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink component={Link} to="/" color="inherit" underline="none" className="footer-link">Home</MuiLink>
                <MuiLink component={Link} to="/products" color="inherit" underline="none" className="footer-link">Products</MuiLink>
                <MuiLink component={Link} to="/about" color="inherit" underline="none" className="footer-link">About Us</MuiLink>
                <MuiLink component={Link} to="/contact" color="inherit" underline="none" className="footer-link">Contact</MuiLink>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'inline-block', borderLeft: '4px solid', borderImage: 'linear-gradient(180deg,#EC4899,#8B5CF6) 1', pl: 1 }}>
                Customer Service
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink component={Link} to="/shipping" color="inherit" underline="none" className="footer-link">Shipping Info</MuiLink>
                <MuiLink component={Link} to="/returns" color="inherit" underline="none" className="footer-link">Returns</MuiLink>
                <MuiLink component={Link} to="/privacy" color="inherit" underline="none" className="footer-link">Privacy Policy</MuiLink>
                <MuiLink component={Link} to="/terms" color="inherit" underline="none" className="footer-link">Terms of Service</MuiLink>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="h6" gutterBottom sx={{ display: 'inline-block', borderLeft: '4px solid', borderImage: 'linear-gradient(180deg,#EC4899,#8B5CF6) 1', pl: 1 }}>
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box className="contact-chip"><Email fontSize="small" /><Typography variant="body2">maymehenni1@gmail.com</Typography></Box>
                <Box className="contact-chip"><Phone fontSize="small" /><Typography variant="body2">+1 (555) 123-4567</Typography></Box>
                <Box className="contact-chip"><LocationOn fontSize="small" /><Typography variant="body2">Algiers, Algeria</Typography></Box>
              </Box>
            </Grid>
          </Grid>

          <Box className="gradient-separator" />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 3 }}>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              © {new Date().getFullYear()} May Store. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Made with ❤️ for our customers
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Scroll to top button */}
      <IconButton className="scroll-top" color="primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </IconButton>
    </Box>
  );
};

export default Footer;





