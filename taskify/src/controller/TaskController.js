import Task from "../model/Task.js";
import taskStorage from "../model/TaskStorage.js";

export const addTask = async (req, res) => {
  const { columnId, title, description, authorId } = req.body;
  const newTask = new Task(
    Date.now().toString(),
    columnId,
    title,
    description,
    authorId,
    0 // 추가된 컬럼의 우선순위는 가장 위
  );

  try {
    taskStorage.addTask(newTask);
    res.status(200).json(newTask);
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const data = taskStorage.updateTask(id, updates);
    res.status(200).json({ data });
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    taskStorage.deleteTask(id);
    res
      .status(200)
      .json({ message: `ID가 '${id}'인 테스크가 삭제되었습니다.` });
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
