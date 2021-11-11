import bcrypt from 'bcryptjs';

export const setCrypto = (s: string): Promise<string> => bcrypt.hash(s, 10);

export const compareCrypto = (source: string, x: string): Promise<boolean> => bcrypt.compare(source, x);
