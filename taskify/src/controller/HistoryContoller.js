import historyStorage from "../model/HistoryStorage.js";

export const getAllHistory = async (req, res) => {
  try {
    const data = await historyStorage.getHistory();
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteAllHistory = async (req, res) => {
  try {
    const data = await historyStorage.resetHistory();
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
