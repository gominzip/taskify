export async function handleAsync(asyncFunction) {
    try {
      return await asyncFunction();
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  }