// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const path = (path: string, obj: Record<string, any>): any => path.split('.').reduce((o, i) => o[i], obj);
