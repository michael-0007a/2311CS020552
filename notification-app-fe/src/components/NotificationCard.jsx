import { Card, Box, Typography, Stack, Chip, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export function NotificationCard({ notification, isRead, onToggleRead }) {
  const { ID, Type, Message, Timestamp } = notification;

  // Map type to built-in MUI colors
  const getTypeColor = (type) => {
    switch (type) {
      case "Placement":
        return "success";
      case "Result":
        return "primary";
      case "Event":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Card
      sx={{
        position: "relative",
        borderLeft: isRead ? "4px solid rgba(0,0,0,0.1)" : "4px solid #667eea",
        backgroundColor: isRead ? "rgba(255, 255, 255, 0.4)" : "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.05)",
        transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
        "&:hover": {
          transform: "translateY(-4px) scale(1.01)",
          boxShadow: "0 12px 24px 0 rgba(31, 38, 135, 0.15)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        },
        mb: 2,
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack spacing={1} sx={{ flex: 1, pr: 2 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Chip
              label={Type}
              color={getTypeColor(Type)}
              size="small"
              sx={{ fontWeight: "bold", fontSize: "0.75rem" }}
            />
            <Typography variant="caption" color="text.secondary">
              {Timestamp}
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              fontWeight: isRead ? "normal" : "600",
              color: isRead ? "text.secondary" : "text.primary",
            }}
          >
            {Message}
          </Typography>
        </Stack>

        <IconButton
          onClick={() => onToggleRead(ID)}
          color={isRead ? "success" : "default"}
          size="medium"
          title={isRead ? "Mark as unread" : "Mark as read"}
        >
          {isRead ? <CheckCircleIcon /> : <CheckCircleOutlinedIcon />}
        </IconButton>
      </Box>
    </Card>
  );
}
