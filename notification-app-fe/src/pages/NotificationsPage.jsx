import { useState, useEffect, useMemo } from "react";
import {
  Alert,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";
import { useNotifications, compareNotifications } from "../hooks/useNotifications";
import { Log } from "../api/logger";

export function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [topNLimit, setTopNLimit] = useState(10);

  const {
    notifications,
    allNotifications,
    readIds,
    loading,
    error,
    markAsRead,
    markAsUnread,
    markAllAsRead,
  } = useNotifications(limit, page, filter);

  // Unread count calculated from all unique notifications gathered so far
  const totalUnreadCount = useMemo(() => {
    return allNotifications.filter((n) => !readIds.includes(n.ID)).length;
  }, [allNotifications, readIds]);

  // Log "Notifications page opened" or "Priority Inbox opened" on load/mount
  useEffect(() => {
    if (tab === "all") {
      Log("frontend", "info", "page", "Notifications page opened");
    } else {
      Log("frontend", "info", "page", "Priority Inbox opened");
    }
  }, []);

  const handleTabChange = async (event, newValue) => {
    setTab(newValue);
    if (newValue === "all") {
      await Log("frontend", "info", "page", "Notifications page opened");
    } else {
      await Log("frontend", "info", "page", "Priority Inbox opened");
    }
  };

  const handleFilterChange = async (newFilter) => {
    setFilter(newFilter);
    setPage(1); // Reset page on filter change
    await Log("frontend", "info", "state", "Filter changed");
  };

  const handlePageChange = async (event, newPage) => {
    setPage(newPage);
    await Log("frontend", "info", "state", "Pagination changed");
  };

  const handleLimitChange = async (event) => {
    setLimit(event.target.value);
    setPage(1); // Reset page on limit change
    await Log("frontend", "info", "state", "Limit changed");
  };

  const handleTopNLimitChange = async (event) => {
    setTopNLimit(event.target.value);
    await Log("frontend", "info", "state", "Limit changed");
  };

  const handleToggleRead = (id) => {
    if (readIds.includes(id)) {
      markAsUnread(id);
    } else {
      markAsRead(id);
    }
  };

  const handleMarkAllCurrentAsRead = () => {
    const listToMark = tab === "all" ? notifications : priorityNotifications;
    markAllAsRead(listToMark);
  };

  // Compute Top N notifications from all unique notifications seen
  const priorityNotifications = useMemo(() => {
    // Sort all unique notifications by priority ranking rules
    const sorted = [...allNotifications].sort(compareNotifications);
    // Take the top N
    return sorted.slice(0, topNLimit);
  }, [allNotifications, topNLimit]);

  // Log "Priority notifications calculated" when priority list changes
  useEffect(() => {
    if (tab === "priority" && priorityNotifications.length > 0) {
      Log("frontend", "info", "page", "Priority notifications calculated");
    }
  }, [priorityNotifications, tab]);

  // Check if we have more pages (used to control dynamic pagination Next button)
  const hasMore = notifications.length === Number(limit);
  const displayTotalPages = hasMore ? Number(page) + 1 : Number(page);

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", px: 2, py: 4 }}>
      {/* Header Area */}
      <Box sx={{
        mb: 4,
        background: "linear-gradient(90deg, rgba(25,118,210,0.9) 0%, rgba(156,39,176,0.9) 100%)",
        color: "white",
        p: 3,
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Badge badgeContent={totalUnreadCount} color="error" max={99}>
            <NotificationsIcon sx={{ fontSize: 40 }} />
          </Badge>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Campus Updates
            </Typography>
            <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
              Your latest academic and event notifications.
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Tabs Navigation */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          mb: 4,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { fontWeight: "bold" },
        }}
      >
        <Tab
          label={
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <NotificationsIcon size="small" />
              <span>All Notifications</span>
              {totalUnreadCount > 0 && (
                <Badge badgeContent={totalUnreadCount} color="error" sx={{ ml: 1 }} />
              )}
            </Stack>
          }
          value="all"
        />
        <Tab
          label={
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <StarIcon size="small" />
              <span>Priority Inbox</span>
            </Stack>
          }
          value="priority"
        />
      </Tabs>

      {/* Main Content Area */}
      {tab === "all" ? (
        <Box>
          {/* Controls row */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              mb: 3,
            }}
          >
            <NotificationFilter value={filter} onChange={handleFilterChange} />

            <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel id="limit-select-label">Page Size</InputLabel>
                <Select
                  labelId="limit-select-label"
                  value={limit}
                  label="Page Size"
                  onChange={handleLimitChange}
                >
                  {[2, 5, 8, 10].map((val) => (
                    <MenuItem key={val} value={val}>
                      {val}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {notifications.length > 0 && (
                <Button
                  variant="outlined"
                  size="medium"
                  startIcon={<CheckCircleIcon />}
                  onClick={handleMarkAllCurrentAsRead}
                  sx={{ textTransform: "none" }}
                >
                  Mark display read
                </Button>
              )}
            </Stack>
          </Stack>

          {/* Loading, Error and Empty states */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          )}

          {!loading && error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              Failed to load notifications: {error}
            </Alert>
          )}

          {!loading && !error && notifications.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No notifications found matching your selection.
            </Alert>
          )}

          {/* Notification List */}
          {!loading && !error && notifications.length > 0 && (
            <Stack spacing={2}>
              {notifications.map((n) => (
                <NotificationCard
                  key={n.ID}
                  notification={n}
                  isRead={readIds.includes(n.ID)}
                  onToggleRead={handleToggleRead}
                />
              ))}
            </Stack>
          )}

          {/* Pagination Controls */}
          {!loading && !error && notifications.length > 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={displayTotalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                size="large"
              />
            </Box>
          )}
        </Box>
      ) : (
        <Box>
          {/* Priority inbox controls */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="topn-select-label">Show Top N</InputLabel>
              <Select
                labelId="topn-select-label"
                value={topNLimit}
                label="Show Top N"
                onChange={handleTopNLimitChange}
              >
                {[5, 10, 15, 20, 25, 50].map((val) => (
                  <MenuItem key={val} value={val}>
                    Top {val}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {priorityNotifications.length > 0 && (
              <Button
                variant="outlined"
                size="medium"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAllCurrentAsRead}
                sx={{ textTransform: "none" }}
              >
                Mark all read
              </Button>
            )}
          </Stack>


          {/* Empty state */}
          {priorityNotifications.length === 0 && (
            <Alert severity="info" sx={{ mb: 3 }}>
              No priority notifications gathered yet. Waiting for new updates...
            </Alert>
          )}

          {/* Priority list */}
          {priorityNotifications.length > 0 && (
            <Stack spacing={2}>
              {priorityNotifications.map((n) => (
                <NotificationCard
                  key={n.ID}
                  notification={n}
                  isRead={readIds.includes(n.ID)}
                  onToggleRead={handleToggleRead}
                />
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
}
