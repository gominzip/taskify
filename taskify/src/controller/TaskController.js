import taskStorage from "../model/TaskStorage.js";

export const addTask = async (req, res) => {
  const newTask = req.body;

  try {
    const data = await taskStorage.addTask(newTask);
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const data = await taskStorage.updateTask(id, updates);
    res.status(200).json({ data });
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await taskStorage.deleteTask(id);
    res
      .status(200)
      .json({ message: `ID가 '${id}'인 테스크가 삭제되었습니다.` });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
