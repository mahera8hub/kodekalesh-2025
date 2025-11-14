// ===================== App.jsx =====================
import React, { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Dialog,
  Badge,
  Fab,
  Box,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";
import HistoryIcon from "@mui/icons-material/History";
import WarningIcon from "@mui/icons-material/Warning";

import Forecast from "./components/forecast";

function App() {
  const [alertOpen, setAlertOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newAlert, setNewAlert] = useState(true);

  const [history, setHistory] = useState([]);

  const triggerAlert = () => {
    const alertItem = {
      time: new Date().toLocaleString(),
      severity: "High",
      message:
        "Dengue transmission risk elevated due to humidity spike + forecast trends.",
    };

    setHistory([alertItem, ...history]);
    setNewAlert(true);
    setAlertOpen(true);
  };

  // Severity color logic
  const getSeverityColor = (sev) => {
    if (sev === "High") return "#d50000";
    if (sev === "Medium") return "#ff9100";
    return "#2e7d32";
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      {/* vertical stacking instead of side-by-side */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* ===================== HEADER ===================== */}
        <Box>
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              textAlign: "center",
              background:
                "linear-gradient(90deg, #ff5252, #ff1744, #d500f9, #2979ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EpiSure – AI Epidemic Forecasting
          </Typography>

          <Typography
            variant="subtitle1"
            sx={{ textAlign: "center", mt: 1, opacity: 0.8 }}
          >
            Real-time prediction • Risk alerts • Disease intelligence
          </Typography>
        </Box>

        {/* ===================== FORECAST CARD (Full Width) ===================== */}
        <Card
          sx={{
            borderRadius: 4,
            p: 2,
            boxShadow: "0 10px 35px rgba(0,0,0,0.15)",
            backdropFilter: "blur(10px)",
            minHeight: "420px",
          }}
        >
          <CardContent>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              📊 7-Day Epidemiological Forecast
            </Typography>
            <Forecast />
          </CardContent>
        </Card>

        {/* ===================== ALERT CARD (Full Width) ===================== */}
        <Card
          sx={{
            borderRadius: 4,
            p: 0,
            background: "rgba(255, 50, 50, 0.20)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 8px 25px rgba(255,0,0,0.25)",
            minHeight: "420px",
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              fontWeight={800}
              gutterBottom
              sx={{ color: "#b71c1c" }}
            >
              🔔 Real-Time Alerts
            </Typography>

            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Stay informed about risk predictions using epidemiological and environmental indicators.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              startIcon={<NotificationsActiveIcon />}
              sx={{
                mt: 3,
                py: 1.3,
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                backgroundColor: "#d50000",
                "&:hover": { backgroundColor: "#ff1744" },
              }}
              onClick={() => triggerAlert()}
            >
              Show Dengue Alert
            </Button>

            <Button
              variant="text"
              fullWidth
              sx={{ mt: 2, color: "#b71c1c", fontWeight: 700 }}
              onClick={() => setDrawerOpen(true)}
            >
              View Alert History
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* ===================== FLOATING BELL ===================== */}
      <Fab
        color="error"
        sx={{
          position: "fixed",
          bottom: 30,
          right: 30,
          boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
        }}
        onClick={() => setDrawerOpen(true)}
      >
        <Badge
          color="warning"
          variant={newAlert ? "dot" : ""}
          overlap="circular"
          sx={{
            "& .MuiBadge-badge": {
              animation: newAlert ? "ring 1.8s infinite" : "none",
              "@keyframes ring": {
                "0%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.25)" },
                "100%": { transform: "scale(1)" },
              },
            },
          }}
        >
          <NotificationsIcon />
        </Badge>
      </Fab>

      {/* ===================== ALERT HISTORY DRAWER ===================== */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 350,
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 25px rgba(0,0,0,0.2)",
            p: 2,
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight={800}>
            Alert History
          </Typography>

          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mt: 1, mb: 2 }} />

        {history.length === 0 ? (
          <Typography sx={{ opacity: 0.7, mt: 2 }}>No alerts yet.</Typography>
        ) : (
          <>
            <List>
              {history.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    mb: 1.5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 12px rgba(0,0,0,0.15)",
                  }}
                >
                  <WarningIcon
                    sx={{
                      fontSize: 32,
                      color: getSeverityColor(item.severity),
                      mr: 1.5,
                    }}
                  />

                  <ListItemText
                    primary={
                      <Typography fontWeight={700}>{item.message}</Typography>
                    }
                    secondary={
                      <>
                        <Chip
                          label={item.severity}
                          size="small"
                          sx={{
                            backgroundColor: getSeverityColor(item.severity),
                            color: "white",
                            fontWeight: 700,
                            mr: 1,
                          }}
                        />
                        <span style={{ opacity: 0.8 }}>{item.time}</span>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Button
              fullWidth
              sx={{
                mt: 2,
                borderRadius: 2,
                color: "white",
                backgroundColor: "#b71c1c",
                "&:hover": { backgroundColor: "#d50000" },
              }}
              onClick={() => setHistory([])}
            >
              Clear All Alerts
            </Button>
          </>
        )}
      </Drawer>

      {/* ===================== ENHANCED ALERT MODAL ===================== */}
      <Dialog
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
          setNewAlert(false);
        }}
        PaperProps={{
          sx: {
            borderRadius: "22px",
            background: "rgba(255,0,0,0.15)",
            backdropFilter: "blur(18px)",
            padding: 2,
            minWidth: 380,
            boxShadow: "0 0 40px rgba(255,0,0,0.4)",
            animation: "popup 0.35s ease-out",
            "@keyframes popup": {
              "0%": { transform: "scale(0.8)", opacity: 0 },
              "100%": { transform: "scale(1)", opacity: 1 },
            },
          },
        }}
      >
        <Box sx={{ textAlign: "center", p: 2 }}>
          {/* Animated Danger Icon */}
          <div
            style={{
              position: "relative",
              display: "inline-block",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                background: "rgba(255,0,0,0.25)",
                animation: "wave 1.8s infinite",
              }}
            />

            <div
              style={{
                fontSize: "60px",
                position: "relative",
                zIndex: 2,
              }}
            >
              ⚠️
            </div>

            <style>
              {`
              @keyframes wave {
                0% { transform: scale(1); opacity: 0.7; }
                100% { transform: scale(1.6); opacity: 0; }
              }
            `}
            </style>
          </div>

          <Typography
            variant="h5"
            fontWeight={800}
            sx={{ mt: 2, color: "#b71c1c" }}
          >
            High Severity Dengue Alert
          </Typography>

          <Typography
            variant="body1"
            sx={{ mt: 2, opacity: 0.9, fontSize: "15px", lineHeight: 1.5 }}
          >
            Based on environmental factors and forecasted case trends, your
            region is at increased risk of dengue transmission this week.
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              backgroundColor: "#d50000",
              borderRadius: "10px",
              fontWeight: 700,
              "&:hover": { backgroundColor: "#ff1744" },
            }}
            onClick={() => {
              setAlertOpen(false);
              setNewAlert(false);
            }}
          >
            Close
          </Button>
        </Box>
      </Dialog>
    </Container>
  );
}

export default App;
