import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Box,
  Alert
} from '@mui/material';

const categories = [
  { value: 'Electronics', label: 'Electronics' },
  { value: 'Clothing', label: 'Clothing' },
  { value: 'Home & Garden', label: 'Home & Garden' },
  { value: 'Sports', label: 'Sports' }
];

const NewProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stock, setStock] = useState('0');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleImages = async (e) => {
    setError('');
    const files = Array.from(e.target.files || []);
    const total = images.length + files.length;
    if (total > 5) {
      setError('You can upload up to 5 images');
      return;
    }
    const newImgs = [];
    const newPrev = [];
    for (const file of files) {
      const reader = new FileReader();
      const dataUrl = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      newImgs.push(dataUrl);
      newPrev.push(URL.createObjectURL(file));
    }
    setImages(prev => [...prev, ...newImgs]);
    setPreviews(prev => [...prev, ...newPrev]);
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price) || 0,
        category,
        stock: Number(stock) || 0,
        images
      };
      const { data } = await axios.post('/api/products', payload);
      setSuccess('Product created');
      setTimeout(() => navigate('/admin/products'), 600);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth type="number" label="Price" value={price} onChange={(e)=>setPrice(e.target.value)} required />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField select fullWidth label="Category" value={category} onChange={(e)=>setCategory(e.target.value)}>
                {categories.map(opt => (
                  <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField fullWidth label="Description" value={description} onChange={(e)=>setDescription(e.target.value)} multiline rows={4} />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField fullWidth type="number" label="Stock" value={stock} onChange={(e)=>setStock(e.target.value)} />
            </Grid>

            <Grid item xs={12} md={9}>
              <Button variant="outlined" component="label">
                Select Images (max 5)
                <input hidden accept="image/*" type="file" multiple onChange={handleImages} />
              </Button>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                {previews.map((src, idx) => (
                  <Box key={idx} sx={{ position: 'relative' }}>
                    <img src={src} alt={`preview-${idx}`} width={100} height={100} style={{ objectFit: 'cover', borderRadius: 4 }} />
                    <Button size="small" color="error" onClick={()=>removeImage(idx)} sx={{ position: 'absolute', top: 0, right: 0 }}>x</Button>
                  </Box>
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Product'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewProduct;




