import Column from "../model/Column.js";
import columnStorage from "../model/ColumnStorage.js";

export const getAllColumns = async (req, res) => {
  try {
    const data = await columnStorage.getAllColumnsWithTasks();
    res.status(200).json({ data });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const addColumn = async (req, res) => {
  const { title } = req.body;

  try {
    const column = await columnStorage.addColumn(title);
    res.status(200).json(column);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const updateColumn = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedColumn = await columnStorage.updateColumn(id, title);
    res.status(200).json(updatedColumn);
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const deleteColumn = async (req, res) => {
  const { id } = req.params;

  try {
    columnStorage.deleteColumn(id);
    res.status(200).json({ message: `ID가 '${id}'인 컬럼이 삭제되었습니다.` });
    return;
  } catch (error) {
    res.status(404).json({ error: error.message });
  }

  res.status(200).json({ id });
};
