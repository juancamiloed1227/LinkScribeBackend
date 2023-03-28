import { List } from '../models/list.js';
import { ListLink } from '../models/list_links.js';
import { Link } from '../models/link.js';

const getAllLists = async (req, res) => {
    try {
        const userId = req.user.userId;
        const lists = await List.findAll({ where: { userId } });
        res.json(lists);
    } catch (error) {
        res.json({error: error.message});
    }
}

const createList = async (req, res) => {
    const { name, categoryId, description } = req.body;
    try {
        const userId = req.user.userId;
        const list = await List.create({ name, categoryId, description, userId });
        res.json(list);
    } catch (error) {
        res.json({error: error.message});
    }
}

const getListById = async (req, res) => {
    const { id } = req.params;
    try {
        const userId = req.user.userId;
        const list = await List.findOne({ where: { id, userId } });
        if (list) {
            res.json(list);
        } else {
            res.status(404).json({ message: 'La lista no fue encontrado' });
        }
    } catch (error) {
        res.json({error: error.message});
    }
}

const updateListById = async (req, res) => {
    const { id } = req.params;
    const { name, description, categoryId } = req.body;
    const userId = req.user.userId;
    try {
        const list = await List.findOne({ where: { id, userId } });
        if (list) {
            list.name = name;
            list.description = description;
            list.categoryId = categoryId;
            await list.save();
            res.json(list);
        } else {
            res.status(404).json({ message: 'La lista no fue encontrada' });
        }
    } catch (error) {
        res.json({error: error.message});
    }
}

const deleteListById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const list = await List.findOne({ where: { id, userId } });
        if (list) {
            await list.destroy();
            res.json({ message: 'La lista ha sido eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'La lista no fue encontrada' });
        }
    } catch (error) {
        res.json({error: error.message});
    }
}

const addLinkToList = async (req, res) => {
    const { listId, linkId } = req.body;
    const userId = req.user.userId;
    try {
        const link = await Link.findOne({where: {id:linkId, userId}});
        if (!link) {
            res.json({ error: 'The link doesnt exists' })
        }

        const list = await List.findOne({where: {id: listId, userId}});
        if (!list) {
            res.json({ error: 'The list doesnt exists' })
        }

        const listLink = await ListLink.create({ listId, linkId });

        res.json(listLink);
    } catch (error) {
        res.json({error: error.message})
    }
}

const getLinksInList = async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId;
    try {
        const list = await List.findOne({where: {id, userId}});

        if (!list) {
            return res.json({ error: "List not found" });
        }

        const listLinks = await ListLink.findAll({ where: { listId: id } })
        const links = await Link.findAll({ where: { id: listLinks.map(ll => ll.dataValues.linkId) } })

        return res.json(links)

    } catch (error) {
        return res.json({ error: error.message })
    }
}

export {
    getAllLists,
    createList,
    getListById,
    updateListById,
    deleteListById,
    addLinkToList,
    getLinksInList,
}