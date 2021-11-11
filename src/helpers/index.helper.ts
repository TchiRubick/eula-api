import { escapeRegExp } from 'lodash';

export const likeFormatter = (pattern: string): RegExp => new RegExp(`.*${pattern}.*`);

export const escapeRegexString = (str: string): string => escapeRegExp(str);

export default likeFormatter;
