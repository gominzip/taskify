import columnStorage from "../model/ColumnStorage.js";

export const getAllColumns = async (req, res) => {
  res.render("index");
};

export const addColumn = async (req, res) => {
  const { title } = req.body;
  res.status(200).json({ title });
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
