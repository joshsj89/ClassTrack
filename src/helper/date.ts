export function convertMDYToDate(dateString: string, meetingPatterns: string): { startTime: Date; endTime: Date } {
  const [month, day, year] = dateString.split('/').map(Number);

    const meetingPattern = meetingPatterns.split(' | ')[1].split(' - ');

    const startTime = meetingPattern[0].trim(); // 3:50 PM
    const endTime = meetingPattern[1].trim(); // 5:30 PM

    const startAMPM = startTime.slice(-2); // PM
    const endAMPM = endTime.slice(-2); // PM

    const startTimeParts = startTime.split(':'); // ['3', '50 PM']
    const endTimeParts = endTime.split(':'); // ['5', '30 PM']
    const startHour = parseInt(startTimeParts[0], 10);
    const startMinute = parseInt(startTimeParts[1], 10);
    const endHour = parseInt(endTimeParts[0], 10);
    const endMinute = parseInt(endTimeParts[1], 10);

    // Convert to 24-hour format
    const startHour24 = startAMPM === 'PM' && startHour !== 12 ? startHour + 12 : startHour;
    const endHour24 = endAMPM === 'PM' && endHour !== 12 ? endHour + 12 : endHour;

  return {
    "startTime": new Date(year, month - 1, day, startHour24, startMinute, 0, 0),
    "endTime": new Date(year, month - 1, day, endHour24, endMinute, 0, 0)
  };
}

export function convertMDYToYYYYMMDD(dateString: string): string {
  const [month, day, year] = dateString.split('/').map(Number);
  return `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
}

export function convertDayToDayAbbrev(day: string): string {
    const dayMap: { [key: string]: string } = {
        'M': 'MO',
        'T': 'TU',
        'W': 'WE',
        'Th': 'TH',
        'F': 'FR',
        'S': 'SA'
    };

    return dayMap[day] || '';
}