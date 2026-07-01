# Notification System Design (Stage 1)

This document describes the design, ranking algorithm, and real-time update strategy for the Campus Notifications System client application.

## 1. System Requirements & Architecture

The application is built as a single-page React frontend using Material UI for styling, communicating with a remote notifications service. 

Key constraints and behaviors:
* **No Database Storage**: The frontend fetches and manages notification data strictly in-memory.
* **Persistent Read Status**: To preserve UX across page reloads, read/unread states are tracked by storing notification IDs in `localStorage`.
* **API Constraints**: The backend pagination supports a maximum `limit` of 10 items per page.

## 2. Priority Ranking Algorithm

Notifications are ranked dynamically using a two-tier comparison:
1. **Category Weight**: `Placement` (highest priority) > `Result` (medium priority) > `Event` (lowest priority).
2. **Recency Weight (Tie-breaker)**: If categories are identical, the notification with the newer `Timestamp` is ranked higher.

### Javascript Implementation
The comparison function is implemented as:
```javascript
export function compareNotifications(a, b) {
  const priorityMap = {
    Placement: 3,
    Result: 2,
    Event: 1
  };
  const pA = priorityMap[a.Type] || 0;
  const pB = priorityMap[b.Type] || 0;

  if (pA !== pB) {
    return pB - pA; // Descending order of category weight
  }

  // Fallback to timestamp comparison (lexicographically matches chronological order)
  return b.Timestamp.localeCompare(a.Timestamp);
}
```

## 3. Real-Time Top N Maintenance

To simulate new notifications arriving, the client runs a polling cycle:
* **Polling Interval**: Fetch the first page of notifications from the API every 5 seconds.
* **Chosen Frequency (5s)**: Polling every 5 seconds balances real-time responsiveness for critical updates (like new Placement offers) without overloading the API server.
* **Duplicate Prevention**: The client maintains a unique set of all notifications loaded/encountered. Incoming notifications from each poll cycle are merged with the existing list by their unique `ID` to prevent duplicates.
* **Sorting & Top N Slicing**: Whenever the collection is updated (e.g. on new poll cycles), the array is re-sorted on the fly using `compareNotifications` and the first `N` elements are sliced to display in the Priority Inbox view.

## 4. Logging & Monitoring

All lifecycle and interaction events are logged back to the server using the existing middleware (`Log()`). This tracks:
* App initialization and page view changes.
* API fetch attempts, successes, and failures.
* Polling cycle start, successes, and failures.
* State changes (filtering, pagination, changing page limit).
* Notification operations (marking individual read/unread status, and marking all read).
