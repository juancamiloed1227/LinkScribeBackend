import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Op } from 'sequelize';

dotenv.config()

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verificar si el usuario o correo ya existen
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email: email }, { username: username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Usuario o correo ya registrado' });
        }

        // Crear nuevo usuario
        const user = new User({
            username: username,
            email: email,
            password: password,
        });
        await user.save();

        return res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el correo existe
        const user = await User.findOne({
            where: {
                email: email
              }
        });

        if (!user) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Verificar si la contraseña es correcta
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Crear token de autenticación
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });

        return res.status(200).json({ token: token });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export {
    register,
    login,
}
