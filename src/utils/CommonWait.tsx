export const wait3Sec = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
};
