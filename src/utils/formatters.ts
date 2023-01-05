import { randomInt } from './generators';
import { Task, TaskBase } from '../models/owns/tasks';

export const formatSelectMultiple = (
  array: { label: string; value: string }[] | undefined
) => {
  return array
    ? array.map(({ value }) => {
        return { id: Number(value) };
      })
    : [];
};

export const formatSelect = (
  object: { label: string; value: string } | undefined
): { id: number } | null => {
  return object?.value ? { id: Number(object.value) } : null;
};

export const formatAssetValues = (values) => {
  values.primaryUser = formatSelect(values.primaryUser);
  values.location = formatSelect(values.location);
  values.category = formatSelect(values.category);
  values.parentAsset = formatSelect(values.parentAsset);
  values.customers = formatSelectMultiple(values.customers);
  values.vendors = formatSelectMultiple(values.vendors);
  values.assignedTo = formatSelectMultiple(values.assignedTo);
  values.teams = formatSelectMultiple(values.teams);
  values.parts = formatSelectMultiple(values.parts);
  return values;
};

export const formatSwitch = (values: {}, key: string) => {
  return Array.isArray(values[key]) ? values[key].includes('on') : values[key];
};

export const getPriorityLabel = (str: string, t: any) => {
  switch (str) {
    case 'NONE':
      return t('None');
    case 'LOW':
      return t('Low');
    case 'MEDIUM':
      return t('Medium');
    case 'HIGH':
      return t('High');
    default:
      break;
  }
};

export const getStatusLabel = (str: string, t: any) => {
  switch (str) {
    case 'OPEN':
      return t('Open');
    case 'IN_PROGRESS':
      return t('In Progress');
    case 'ON_HOLD':
      return t('On Hold');
    case 'COMPLETE':
      return t('Complete');
    default:
      break;
  }
};

export const getTaskFromTaskBase = (taskBase: TaskBase): Task => {
  return { taskBase, id: randomInt(), notes: '', value: '', images: [] };
};

export const durationToHours = (duration: number) => {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = '';

  if (hrs > 0) {
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
  }

  ret += '' + mins + ':' + (secs < 10 ? '0' : '');
  ret += '' + secs;
  return ret;
};
export const getHoursAndMinutesAndSeconds = (
  duration: number
): [number, number, number] => {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;
  return [hrs, mins, secs];
};

export const getHMSString = (duration: number): string => {
  const [hrs, mins, secs] = getHoursAndMinutesAndSeconds(duration);
  return `${hrs}h ${mins}m ${secs}s`;
};
