export const addTask = async (req, res) => {
  const { columnId, title, description, author, order } = req.body;
  res.status(200).json({ columnId, title, description, author, order });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  res.status(200).json({ id, updates });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ id });
};
