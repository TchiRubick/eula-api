export const likeFormatter = (pattern: string): RegExp => new RegExp(`.*${pattern}.*`);

export default likeFormatter;
