export function parseDate(dateTimeString: string): string {
  if (!dateTimeString) {
    return '';
  }
  const datePart = dateTimeString.split(' ')[0];

  return datePart;
}