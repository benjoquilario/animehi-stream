export const stripHtml = (data: string) => data.replace(/<\/?\w*\\?>/gm, '');
