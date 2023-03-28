import { Link } from '../models/link.js';
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

// Obtener todos los enlaces
const getAllLinks = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const links = await Link.findAll({ where: { userId } });
        res.json(links);
    } catch (error) {
        next(error);
    }
}

// Crear un nuevo enlace
const createLink = async (req, res, next) => {
    const { url, model } = req.body;

    if (model == 'chatgpt') {
        const minWords = 25;
        let totalWords = 0;
        let paragraphs = '';
        const defaultImageUrl = 'https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg';
        let imageUrl = defaultImageUrl;

        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const imageSrc = $('img').first().attr('src');
        if (imageSrc) {
            imageUrl = imageSrc;
        }

        const title = $('title').text().trim();
        paragraphs += title + '\n\n';

        $('p').each((i, el) => {
            const text = $(el).text().trim();
            const words = text.split(/\s+/).length;

            if (totalWords < minWords) {
                totalWords += words;
                paragraphs += text + '\n\n';
            }
        });

        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPEN_AI_TOKEN}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ 'role': 'system', 'content': "You are a AI Link Organizer that receive a paragraph and return a JSON Object like this:{title: Short title for the paragraph, description: Short description of the paragraph, category: Generic category for the paragraph}" }, { 'role': 'user', 'content': `Paragraph: ${paragraphs}` }]
            })
        });

        const json = await gptResponse.json();
        const attributes = JSON.parse(json.choices[0].message.content);

        try {
            const userId = req.user.userId;
            const link = await Link.create({ url: url, title: attributes.title, description: attributes.description, image: imageUrl, userId: userId, category: attributes.category });
            res.json(link);
        } catch (error) {
            next(error);
        }

    } else if (model == 'bert') {
        const defaultImageUrl = 'https://camarasal.com/wp-content/uploads/2020/08/default-image-5-1.jpg';
        let imageUrl = defaultImageUrl;

        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);

        const imageSrc = $('img').first().attr('src');
        if (imageSrc) {
            imageUrl = imageSrc;
        }

        const bertUrl = 'https://bertapis3.azurewebsites.net/api/PredictFunction?code=J4bKXTxyHb9cXRZa3Nv2fgJx73ABYstT5k9MSmKTUhJGAzFuusxivA==';
        const bertResponse = await fetch(bertUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url
            })
        });

        const json = await bertResponse.json();
        try {
            const userId = req.user.userId;
            const link = await Link.create({ url: url, title: json.result[3], description: json.result[3], image: imageUrl, userId: userId, category: json.result[1] });
            res.json(link);
        } catch (error) {
            next(error);
        }
    }
}

// Obtener un enlace por id
const getLinkById = async (req, res, next) => {
    const { id } = req.params;
    try {
        const userId = req.user.userId;
        const link = await Link.findOne({ where: { id, userId } });
        if (link) {
            res.json(link);
        } else {
            res.status(404).json({ message: 'El enlace no fue encontrado' });
        }
    } catch (error) {
        next(error);
    }
}

// Actualizar un enlace por id
const updateLinkById = async (req, res, next) => {
    const { id } = req.params;
    const { url, title, description, image, category } = req.body;
    const userId = req.user.userId;
    try {
        const link = await Link.findOne({ where: { id, userId } });
        if (link) {
            link.url = url;
            link.title = title;
            link.description = description;
            link.image = image;
            link.category = category;
            await link.save();
            res.json(link);
        } else {
            res.status(404).json({ message: 'El enlace no fue encontrado' });
        }
    } catch (error) {
        next(error);
    }
}

// Eliminar un enlace por id
const deleteLinkById = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
        const link = await Link.findOne({ where: { id, userId } });
        if (link) {
            await link.destroy();
            res.json({ message: 'El enlace ha sido eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'El enlace no fue encontrado' });
        }
    } catch (error) {
        next(error);
    }
}

export {
    getAllLinks,
    getLinkById,
    createLink,
    updateLinkById,
    deleteLinkById,
}
