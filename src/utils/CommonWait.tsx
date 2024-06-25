export const waitSec = async (time: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, time));
};
