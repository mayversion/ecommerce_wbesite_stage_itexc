import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../actions/productActions';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ShoppingCart,
  Star,
  TrendingUp,
  LocalShipping,
  Security,
  Support
} from '@mui/icons-material';
import axios from 'axios';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { loading, products, error } = useSelector(state => state.products);

  const [nlEmail, setNlEmail] = useState('');
  const [nlLoading, setNlLoading] = useState(false);
  const [nlMsg, setNlMsg] = useState('');
  const [nlErr, setNlErr] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNlMsg('');
    setNlErr('');
    if (!nlEmail) return;
    try {
      setNlLoading(true);
      const { data } = await axios.post('/api/newsletter/subscribe', { email: nlEmail, source: 'home' });
      setNlMsg(data.message || 'Subscribed successfully');
      setNlEmail('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Subscription failed';
      setNlErr(msg);
    } finally {
      setNlLoading(false);
    }
  };

  const features = [
    {
      icon: <LocalShipping />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50'
    },
    {
      icon: <Security />,
      title: 'Secure Payment',
      description: '100% secure payment processing'
    },
    {
      icon: <Support />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  const categories = [
    { name: 'Electronics', icon: '📱', gradient: 'linear-gradient(135deg,#1e293b 0%, #0f172a 100%)' },
    { name: 'Clothing', icon: '👗', gradient: 'linear-gradient(135deg,#0f172a 0%, #111827 100%)' },
    { name: 'Home & Garden', icon: '🏡', gradient: 'linear-gradient(135deg,#111827 0%, #0b1022 100%)' },
    { name: 'Sports', icon: '🏀', gradient: 'linear-gradient(135deg,#10172a 0%, #0f1220 100%)' }
  ];

  const heroRef = useRef(null);
  const ctaRef = useRef(null);
  const onHeroMouseMove = (e) => {
    const el = heroRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--px', x.toFixed(3));
    el.style.setProperty('--py', y.toFixed(3));

    // CTA tilt
    const cta = ctaRef.current;
    if (cta) {
      const tiltX = -(y * 10);
      const tiltY = x * 12;
      cta.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
    }
  };

  const onHeroMouseLeave = () => {
    const cta = ctaRef.current;
    if (cta) {
      cta.style.transform = '';
    }
  };

  const pageRef = useRef(null);

  useEffect(() => {
    // Re-init reveal when arriving on Home via client-side navigation
    try {
      const scope = pageRef.current || document;
      const els = scope.querySelectorAll('[data-reveal]:not(.reveal-in)');
      if (els.length === 0) return;
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('reveal-in');
              io.unobserve(e.target);
            }
          }
        }, { threshold: 0.12 });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
      } else {
        // Fallback: reveal immediately
        els.forEach((el) => el.classList.add('reveal-in'));
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    // When product cards mount after async fetch, observe them for reveal
    try {
      const scope = pageRef.current || document;
      const els = scope.querySelectorAll('[data-reveal]:not(.reveal-in)');
      if (els.length === 0) return;
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add('reveal-in');
              io.unobserve(e.target);
            }
          }
        }, { threshold: 0.12 });
        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
      } else {
        els.forEach((el) => el.classList.add('reveal-in'));
      }
    } catch (_) {}
  }, [products]);

  return (
    <Box ref={pageRef}>
      {/* Hero Section */}
      <Box ref={heroRef} onMouseMove={onHeroMouseMove} onMouseLeave={onHeroMouseLeave} className="gradient-hero" sx={{ position: 'relative', overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: { xs: 10, md: 16 }, textAlign: 'center', position: 'relative', zIndex: 3 }}>
          <Box className="glass-card" data-reveal sx={{ mx: 'auto', maxWidth: 900, p: { xs: 3, md: 6 } }}>
            <Typography variant="h1" component="h1" gutterBottom className="gradient-text">
              Elevate Your Everyday
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }} data-reveal>
              Curated collections. Modern design. Trusted quality.
            </Typography>
            <Button
              className="glow-button"
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              ref={ctaRef}
              id="hero-cta"
              data-reveal
            >
              Shop Now
            </Button>
          </Box>
          <Box className="hero-particles" />
        </Container>
        <Box className="hero-blob blob1" />
        <Box className="hero-blob blob2" />
        <Box className="hero-blob blob3" />
        <Box className="hero-orbits">
          <span className="orbit orbit-sm" />
          <span className="orbit orbit-md" />
          <span className="orbit orbit-lg" />
        </Box>
        <Box className="hero-twinkles" />
        <Box className="hero-mesh" />
        <Box className="hero-shine" />
        <Box className="hero-overlay" />
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom sx={{ background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box className="glass-card card-float" sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Box className="icon-bubble" sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Categories Section */}
      <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
            Shop by Category
          </Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {categories.map((category, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} data-reveal style={{ transitionDelay: `${index * 90}ms` }}>
                <Box
                  component={Link}
                  to={`/products?category=${category.name.toLowerCase().replace(/\s+/g,'-')}`}
                  className="category-tile"
                  sx={{
                    textDecoration: 'none',
                    background: category.gradient,
                  }}
                >
                  <Box className="category-glow" />
                  <Typography variant="h3" component="div" className="category-emoji" aria-hidden>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6" component="div" className="category-title">
                    {category.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h4" component="h2" sx={{ background: 'linear-gradient(90deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Featured Products
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={3}>
            {products && products.slice(0, 8).map((product, idx) => (
              <Grid item xs={12} sm={idx === 0 ? 12 : 6} md={idx === 0 ? 8 : 4} lg={idx === 0 ? 8 : 3} key={product._id} data-reveal style={{ transitionDelay: `${idx * 80}ms` }}>
                <Card className="tilt-card" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Box sx={{ position: 'relative' }}>
                    {product.images[0]?.url ? (
                      <CardMedia component="img" height={idx === 0 ? 320 : 220} image={product.images[0].url} alt={product.name} sx={{ objectFit: 'cover', transition: 'transform .4s ease', '&:hover': { transform: 'scale(1.03)' } }} />
                    ) : (
                      <Box sx={{ height: idx === 0 ? 320 : 220, background: 'linear-gradient(135deg, #F472B633, #8B5CF666)' }} />
                    )}
                    <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.5))' }}>
                      <Chip label="Featured" color="secondary" size="small" sx={{ animation: 'pulse 2s infinite', mr: 1 }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.ratings} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.numOfReviews})
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ background: 'linear-gradient(90deg, #F472B6, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2 }}>
                    <Button size="small" variant="outlined" onClick={() => navigate(`/product/${product._id}`)} sx={{ ml: 'auto' }}>
                      Quick View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/products"
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;

