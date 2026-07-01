import { Card, Box, Typography, Stack, Chip, IconButton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

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
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 3,
        },
        borderLeft: isRead ? "4px solid #bdbdbd" : "4px solid #1976d2",
        backgroundColor: isRead ? "#f9f9f9" : "#ffffff",
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Stack spacing={1} sx={{ flex: 1, pr: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
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
          {isRead ? <CheckCircleIcon /> : <CheckCircleOutlineIcon />}
        </IconButton>
      </Box>
    </Card>
  );
}
