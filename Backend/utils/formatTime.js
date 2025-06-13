v// utils/formatTime.js
import { formatDistanceToNow } from 'date-fns';

export const formatTimeAgo = (isoDate) => {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
};