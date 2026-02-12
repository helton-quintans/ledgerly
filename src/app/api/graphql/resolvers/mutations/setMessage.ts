let message = 'Initial message';

export const setMessage = (_: any, args: { message: string }) => {
  message = args.message;
  return message;
};
