export const rgx = (pattern: string): RegExp => new RegExp(`.*${pattern}.*`);

export default rgx;
