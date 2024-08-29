export async function handleAsync(asyncFunction) {
    try {
      return await asyncFunction();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }