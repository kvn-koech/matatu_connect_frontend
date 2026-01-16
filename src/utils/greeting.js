/**
 * Returns a time-based greeting based on the user's local time.
 * @returns {string} One of "Good Morning", "Good Afternoon", or "Good Evening"
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};
