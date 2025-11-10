import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Select,
  MenuItem
} from '@mui/material';
import { Delete, ToggleOn, ToggleOff } from '@mui/icons-material';

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('/api/admin/users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const updateUser = async (id, payload) => {
    try {
      await axios.put(`/api/admin/users/${id}`, payload);
      fetchUsers();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Update failed');
    }
  };

  const toggleActive = (u) => updateUser(u._id, { active: !u.active });
  const changeRole = (u, role) => updateUser(u._id, { role });

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      fetchUsers();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      {loading && (<Box sx={{ textAlign: 'center', py: 6 }}><CircularProgress /></Box>)}
      {error && (<Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>)}

      {!loading && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Select size="small" value={u.role} onChange={(e)=>changeRole(u, e.target.value)}>
                      <MenuItem value="user">user</MenuItem>
                      <MenuItem value="admin">admin</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Chip label={u.active ? 'Active' : 'Inactive'} color={u.active ? 'success' : 'default'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={()=>toggleActive(u)} title={u.active ? 'Deactivate' : 'Activate'}>
                      {u.active ? <ToggleOff /> : <ToggleOn />}
                    </IconButton>
                    <IconButton color="error" onClick={()=>deleteUser(u._id)}><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default UsersList;




