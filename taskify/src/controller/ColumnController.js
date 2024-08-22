import Column from "../model/Column.js";
import columnStorage from "../model/ColumnStorage.js";

export const getAllColumns = (req, res) => {
  try {
    const data = columnStorage.getAllColumnsWithTasks();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).send("서버 오류");
  }
};

export const addColumn = (req, res) => {
  const { title } = req.body;
  const newColumn = new Column(Date.now().toString(), title);

  try {
    columnStorage.addColumn(newColumn);
    res.status(200).json(newColumn);
    // res.redirect("/");
  } catch (error) {
    res.status(500).send("서버 오류");
  }
};

export const updateColumn = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  res.status(200).json({ id, title });
};

export const deleteColumn = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ id });
};
