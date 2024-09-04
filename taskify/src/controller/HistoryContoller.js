import historyStorage from "../model/HistoryStorage.js";

export const getAllHistory = async (req, res) => {
  try {
    const data = await historyStorage.getHistories();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAllHistory = async (req, res) => {
  try {
    await historyStorage.resetHistories();
    res.status(200).json({ message: "히스토리 리셋 성공" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
