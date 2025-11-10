import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { Group, Inventory2, AddCircle, AttachMoney, ShoppingBag, Assessment } from '@mui/icons-material';

const StatCard = ({ icon, label, value }) => (
  <Paper elevation={2} className="glass-card" sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ background: 'linear-gradient(135deg,#EC4899,#8B5CF6)', color: '#fff', p: 1.25, borderRadius: 2, display: 'flex', boxShadow: '0 6px 18px rgba(236,72,153,.25)' }}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, background: 'linear-gradient(90deg, #F472B6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</Typography>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, totalRevenue: 0, recentOrders: [] });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        if (mounted) {
          setStats(data.stats || {});
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setError(e?.response?.data?.message || e.message || 'Failed to load stats');
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading && (
        <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>
      )}
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      {!loading && !error && (
        <>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<Group />} label="Total Users" value={stats.totalUsers || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<Inventory2 />} label="Total Products" value={stats.totalProducts || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<ShoppingBag />} label="Total Orders" value={stats.totalOrders || 0} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard icon={<AttachMoney />} label="Total Revenue" value={`$${(stats.totalRevenue || 0).toFixed(2)}`} />
            </Grid>
          </Grid>

          <Paper elevation={2} className="glass-card" sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" color="secondary" className="glow-button" startIcon={<Assessment />} onClick={() => navigate('/admin/users')}>
                Manage Users
              </Button>
              <Button variant="contained" color="secondary" className="glow-button" startIcon={<Inventory2 />} onClick={() => navigate('/admin/products')}>
                Manage Products
              </Button>
              <Button variant="contained" color="secondary" className="glow-button" startIcon={<ShoppingBag />} onClick={() => navigate('/admin/orders')}>
                Manage Orders
              </Button>
              <Button variant="outlined" startIcon={<AddCircle />} onClick={() => navigate('/admin/product')}>
                New Product
              </Button>
            </Box>
          </Paper>

          <Paper elevation={2} className="glass-card" sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              <Box>
                {stats.recentOrders.slice(0, 5).map((o) => (
                  <Box key={o._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography component={RouterLink} to={`/order/${o._id}`} variant="body2" sx={{ opacity: .95, textDecoration: 'none', color: 'inherit', '&:hover': { color: 'secondary.main' } }}>
                      {o._id}
                    </Typography>
                    <Typography variant="caption" sx={{ mr: 2, opacity: .7 }}>{new Date(o.createdAt).toLocaleDateString()}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #F472B6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${o.totalPrice?.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">No recent orders to show.</Typography>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Dashboard;




