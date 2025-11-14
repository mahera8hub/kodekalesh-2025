import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Divider
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Brush,
} from 'recharts';

function Forecast() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://127.0.0.1:8000/forecast/';

  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        setForecast(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading forecast...
        </Typography>
      </Box>
    );

  if (error)
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: 'center', mt: 4 }}>
        Error fetching forecast: {error}
      </Typography>
    );

  return (
    <Card elevation={6} sx={{ borderRadius: 4, p: 2, mx: 'auto', maxWidth: 1000 }}>
      <CardContent>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Region: {forecast.region}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generated at: {new Date(forecast.generated_at).toLocaleString()}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1, wordBreak: 'break-all' }}>
          SHA256: <code>{forecast.sha256}</code>
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Chart Section */}
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          7-Day Forecast Trend
        </Typography>
        <Box sx={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <LineChart data={forecast.forecast} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Brush dataKey="date" height={30} stroke="#1976d2" />
              <Line
                type="monotone"
                dataKey="yhat"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Forecast Table */}
        <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 2 }}>
          Forecast Details
        </Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                {['Date', 'Predicted Cases', 'Lower Bound', 'Upper Bound'].map((header) => (
                  <TableCell key={header} sx={{ color: 'white', fontWeight: 600 }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {forecast.forecast.map((f) => (
                <TableRow
                  key={f.date}
                  hover
                  sx={{
                    transition: '0.3s',
                    '&:hover': { backgroundColor: '#e3f2fd' },
                  }}
                >
                  <TableCell>{f.date}</TableCell>
                  <TableCell>{f.yhat.toFixed(2)}</TableCell>
                  <TableCell>{f.yhat_lower.toFixed(2)}</TableCell>
                  <TableCell>{f.yhat_upper.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

export default Forecast;
