import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getImageUrl = (url: string) => {
  if (!url) return '';
  return `${url}?t=${new Date().getTime()}`; //Evita el cache
};
