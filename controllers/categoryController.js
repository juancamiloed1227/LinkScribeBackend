import { Category } from '../models/category.js';

const getAllCategories = async (req, res) => {
  try {
    const userId = req.user.userId;
    const categories = await Category.findAll({ where: { userId } });
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting categories' });
  }
};

const getCategoryById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  try {
    const category = await Category.findOne({ where: {id, userId} });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error getting category by ID' });
  }
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;
  try {
    const category = await Category.create({ name, userId });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating category' });
  }
};

const updateCategoryById = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    category.name = name;
    await category.save();
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating category by ID' });
  }
};

const deleteCategoryById = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  try {
    const category = await Category.findOne({ where: {id, userId} });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.destroy();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting category by ID' });
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategoryById,
  deleteCategoryById
};
