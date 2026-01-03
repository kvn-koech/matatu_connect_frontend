import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

// Extend dayjs with necessary plugins
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const dateUtils = {
    /**
     * Standard Date: "Jan 3, 2026"
     */
    formatStandard: (date) => dayjs(date).format('MMM D, YYYY'),

    /**
     * Full DateTime for Receipts: "January 3, 2026 10:30 AM"
     */
    formatFull: (date) => dayjs(date).format('MMMM D, YYYY h:mm A'),

    /**
     * Time only for Departures: "10:30 AM"
     */
    formatTime: (date) => dayjs(date).format('h:mm A'),

    /**
     * Relative time for Tracking: "5 minutes ago"
     */
    fromNow: (date) => dayjs(date).fromNow(),

    /**
     * Short weekday for schedules: "Mon", "Tue"
     */
    formatDay: (date) => dayjs(date).format('ddd'),
};

export default dateUtils;