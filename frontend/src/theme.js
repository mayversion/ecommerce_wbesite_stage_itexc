import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#EC4899', light: '#F472B6', dark: '#DB2777', contrastText: '#FFFFFF' },
    secondary: { main: '#8B5CF6', light: '#A78BFA', dark: '#7C3AED', contrastText: '#FFFFFF' },
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#10B981' },
    info: { main: '#3B82F6' },
    background: { default: '#05070D', paper: '#19233A' },
    text: { primary: '#FFFFFF', secondary: '#F3F4F6', disabled: '#B6BDC6' },
    divider: 'rgba(255,255,255,0.32)'
  },
  typography: {
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    h1: { fontSize: '44px', lineHeight: '52px', fontWeight: 800, letterSpacing: '-0.015em' },
    h2: { fontSize: '36px', lineHeight: '44px', fontWeight: 700, letterSpacing: '-0.012em' },
    h3: { fontSize: '24px', lineHeight: '32px', fontWeight: 600 },
    h4: { fontSize: '20px', lineHeight: '28px', fontWeight: 600 },
    h5: { fontSize: '16px', lineHeight: '24px', fontWeight: 600 },
    h6: { fontSize: '14px', lineHeight: '20px', fontWeight: 600 },
    body1: { fontSize: '16px', lineHeight: '24px', fontWeight: 400 },
    body2: { fontSize: '14px', lineHeight: '20px', fontWeight: 400 },
    caption: { fontSize: '12px', lineHeight: '16px', fontWeight: 500 },
    button: { fontSize: '14px', lineHeight: '20px', fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 600, textTransform: 'none' },
        sizeMedium: { padding: '12px 24px', fontSize: '14px' },
        sizeLarge: { padding: '14px 32px', fontSize: '16px' },
        containedSecondary: {
          background: 'linear-gradient(90deg, #EC4899, #8B5CF6)',
          color: '#fff',
          boxShadow: '0 10px 20px rgba(236,72,153,.55), 0 6px 12px rgba(139,92,246,.45)',
          '&:hover': {
            filter: 'brightness(1.08)',
            boxShadow: '0 14px 28px rgba(236,72,153,.65), 0 10px 18px rgba(139,92,246,.55)'
          }
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.5)',
          color: '#FFFFFF',
          '&:hover': { borderColor: '#FFFFFF' }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(25,35,58,0.98)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.36)',
          color: '#FFFFFF'
        }
      }
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.36)',
          backgroundColor: 'rgba(25,35,58,0.99)',
          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
          '&:hover': { boxShadow: '0 10px 34px rgba(0,0,0,0.55)', transform: 'translateY(-3px)', borderColor: '#FFFFFF' },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.16)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.40)' },
            '&:hover fieldset': { borderColor: '#FFFFFF' },
            '&.Mui-focused fieldset': { borderColor: '#EC4899', boxShadow: '0 0 0 4px rgba(236,72,153,0.45)' },
            '& input': { color: '#FFFFFF' },
            '& .MuiInputAdornment-root, & .MuiSvgIcon-root': { color: '#FFFFFF' }
          }
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { backgroundColor: 'rgba(25,35,58,0.98)', border: '1px solid rgba(255,255,255,0.36)' } }
    },
    MuiTableHead: {
      styleOverrides: { root: { '& th': { color: '#FFFFFF', fontWeight: 900, backgroundColor: 'rgba(255,255,255,0.12)' } } }
    },
    MuiTableCell: {
      styleOverrides: { root: { borderBottom: '1px solid rgba(255,255,255,0.32)', color: '#FFFFFF' } }
    },
    MuiLink: {
      styleOverrides: { root: { transition: 'color .2s ease, text-decoration-color .2s ease', textDecorationColor: 'rgba(255,255,255,0.35)', '&:hover': { color: '#F472B6', textDecoration: 'underline', textDecorationColor: '#F472B6' } } }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 24px rgba(0, 0, 0, 0.35)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 4, fontWeight: 700, border: '1px solid rgba(255,255,255,0.36)' } },
    },
  },
});

export default theme;




