import { FileType } from '../models/owns/file';
import Meter from '../models/owns/meter';

export const canAddReading = (meter: Meter): boolean => {
  if (!meter) {
    return false;
  }
  if (!meter.nextReading) return true;
  return new Date() > new Date(meter.nextReading);
};

export const getImageAndFiles = (
  files: { id: number; type: FileType }[],
  imageFallback?
) => {
  return {
    image: files.find((file) => file.type === 'IMAGE')
      ? { id: files.find((file) => file.type === 'IMAGE').id }
      : imageFallback ?? null,
    files: files
      .filter((file) => file.type === 'OTHER')
      .map((file) => {
        return { id: file.id };
      })
  };
};

export const getNextOccurence = (date: Date, days: number): Date => {
  const incrementDays = (date: Date, days: number) => {
    date.setDate(date.getDate() + days);
    return date;
  };
  let result = date;
  if (result > new Date()) {
    result = incrementDays(result, days);
  } else
    while (result < new Date()) {
      result = incrementDays(result, days);
    }
  return result;
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
