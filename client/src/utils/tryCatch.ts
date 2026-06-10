export const tryCatch = async <T>(promise: Promise<T>): Promise<[T | null, any]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    return [null, err];
  }
};
