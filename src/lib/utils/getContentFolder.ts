import path from 'path';
import { FolderName } from '../enums/constants';

/**
 * Returns the absolute path to the content folder.
 *
 * This uses the current working directory and joins
 * the configured source and content folder names.
 * @param {string} locale the locale for the content language, defaults to en
 * @returns {string} The absolute path to the content directory.
 */
export const getContentFolder = (locale: string = 'en'): string => {
  return path.join(process.cwd(), FolderName.Src, FolderName.Content, locale);
};
