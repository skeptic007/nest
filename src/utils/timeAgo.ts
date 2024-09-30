export const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    const intervalInYears = Math.floor(seconds / 31536000);
    if (intervalInYears > 1) return `${intervalInYears} years ago`;
  
    const intervalInMonths = Math.floor(seconds / 2592000);
    if (intervalInMonths > 1) return `${intervalInMonths} months ago`;
  
    const intervalInDays = Math.floor(seconds / 86400);
    if (intervalInDays > 1) return `${intervalInDays} days ago`;
  
    const intervalInHours = Math.floor(seconds / 3600);
    const intervalInMinutes = Math.floor((seconds % 3600) / 60);
  
    if (intervalInHours > 0 && intervalInMinutes > 0) {
      return `${intervalInHours} hr${intervalInHours > 1 ? 's' : ''} and ${intervalInMinutes} min${intervalInMinutes > 1 ? 's' : ''} ago`;
    } else if (intervalInHours > 0) {
      return `${intervalInHours} hr${intervalInHours > 1 ? 's' : ''} ago`;
    } else if (intervalInMinutes > 0) {
      return `${intervalInMinutes} min${intervalInMinutes > 1 ? 's' : ''} ago`;
    }
  
    return `${Math.floor(seconds)} sec${seconds > 1 ? 's' : ''} ago`;
  };
  