import { GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import { isValidPhoneNumber } from 'react-phone-number-input';

export const getDateString = (isoDateString: string) => {
  const date = new Date(isoDateString);

  // Get the day, month, and year components
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based, so add 1
  const year = date.getFullYear();

  // Create the formatted date string
  const formattedDateString = `${day}/${month}/${year}`;
  return formattedDateString;
};

export function isValidRFC_fisica(val: string) {
  if (val && val !== '') {
    let letters = val.substring(0, 4);
    let year = val.substring(4, 6);
    let month = val.substring(6, 8);
    let day = val.substring(8, 10);
    let suffix = val.substring(10, 13);

    if (val.length !== 13) {
      return false;
    }
    if (letters.length != 4 || year.length != 2 || month.length != 2 || day.length != 2) {
      return false;
    }
    let res;

    res = /^[a-zA-Z\u00F1\u00D1]+$/.test(letters);
    if (!res) return false;

    res = /^\d+$/.test(year);
    if (!res) return false;

    res = /^\d+$/.test(month);
    if (!res) return false;

    res = /^\d+$/.test(day);
    if (!res) return false;

    if (suffix) res = /^[a-z0-9\u00F1\u00D1]+$/i.test(suffix);
    if (!res) return false;

    if (parseInt(month) > 12 || parseInt(month) < 1) {
      return false;
    }
    if (parseInt(day) > 31 || parseInt(day) < 1) {
      return false;
    }
  }
  return true;
}

export function isValidRFC_moral(val: string) {
  if (val && val !== '') {
    if (val.length !== 12) {
      return false;
    }

    let letters = val.substring(0, 3);
    let year = val.substring(3, 5);
    let month = val.substring(5, 7);
    let day = val.substring(7, 9);
    let suffix = val.substring(9, 12);

    if (letters.length != 3 || year.length != 2 || month.length != 2 || day.length != 2) {
      return false;
    }

    let res;

    res = /^[a-zA-Z\u00F1\u00D1]+$/.test(letters);
    if (!res) return false;

    res = /^\d+$/.test(year);
    if (!res) return false;

    res = /^\d+$/.test(month);
    if (!res) return false;

    res = /^\d+$/.test(day);
    if (!res) return false;

    if (suffix) res = /^[a-z0-9\u00F1\u00D1]+$/i.test(suffix);
    if (!res) return false;

    if (parseInt(month) > 12 || parseInt(month) < 1) {
      return false;
    }
    if (parseInt(day) > 31 || parseInt(day) < 1) {
      return false;
    }
  }

  return true;
}

export function getQueryString(obj: any) {
  const keyValuePairs = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (value !== undefined && value !== null && value !== '') {
        keyValuePairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
      }
    }
  }

  return keyValuePairs.length > 0 ? `?${keyValuePairs.join('&')}` : '';
}

export const globalError = (json: unknown) => {
  sessionStorage.clear();
  localStorage.setItem('error', JSON.stringify(json));
  setTimeout(() => {
    window.location.replace(`${window.location.origin}/error`);
  }, 250);
};

export const stringToRegex = (pattern: string) => {
  const regexFlags = pattern.replace(/.*\/([gimy]*)$/, '$1');
  const regexBody = pattern.replace(new RegExp('^/(.*?)/' + regexFlags + '$'), '$1');
  return new RegExp(regexBody, regexFlags);
};

export const formatDate = (dateString: string | undefined | Date, formatString: string) =>
  dateString ? format(new Date(dateString!), formatString) : '';

export function isValidPhone(val: string) {
  if (!val) return true;
  return isValidPhoneNumber(`+${val}`);
}

export const getFilterColumns = (columns: GridColDef[]) => columns.filter((e) => !['status', 'actions'].includes(e.field));
