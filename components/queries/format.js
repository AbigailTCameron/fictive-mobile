import { format, differenceInHours, differenceInDays } from 'date-fns';

export function formatTimestamp(timestamp) {
  const now = new Date();
  const commentDate = new Date(timestamp.seconds * 1000);

  const hoursDifference = differenceInHours(now, commentDate);
  const daysDifference = differenceInDays(now, commentDate);

  if (hoursDifference < 24) {
    if (hoursDifference < 1) {
      return 'Just now';
    } else {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
    }
  } else {
    return format(commentDate, 'MMM dd, yyyy HH:mm');
  }
}