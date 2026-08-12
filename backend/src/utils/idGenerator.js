const generateCustomId = async (Model, prefix) => {
  const count = await Model.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  return `${prefix}-${nextNum}`;
};

module.exports = { generateCustomId };
