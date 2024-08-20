exports.getAllColumns = async (req, res) => {
  res.render("index");
};

exports.addColumn = async (req, res) => {
  const { title } = req.body;
  res.status(200).json({ title });
};

exports.updateColumn = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  res.status(200).json({ id, title });
};

exports.deleteColumn = async (req, res) => {
  const { id } = req.params;
  res.status(200).json({ id });
};
