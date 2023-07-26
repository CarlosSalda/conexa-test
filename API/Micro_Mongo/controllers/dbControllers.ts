import { Request, Response } from 'express';
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const UserError = require('../models/errors/UserError');

function handleToken(token: string) {
    if (!token) throw new UserError('Token not found');
    try {
        jwt.verify(token, secret);
    } catch (error) {
        throw new UserError('Invalid token');
    }
}

function handleValidation(email: string, password: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) throw new UserError('Email and password are required');
    if (password.length < 3) throw new UserError('Password must be at least 3 characters');
    if (!emailRegex.test(email)) throw new UserError('Invalid email');

}

function handleUserError(error: any, res: Response) {
    if (error.code === 11000) return res.status(403).json({ error: 'Email already exists' });
    if (error instanceof UserError) return res.status(403).json({ error: error.message });
    res.status(500).json({ error: error.message });
}

async function getNewPaginated(totalPages: number, limit: number, filter: string) {
    const options = {
        page: totalPages,
        limit: limit,
    };

    return await User.paginate({}, options);
}

const register = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        handleValidation(email, password);
        const user = await User.create({ email, password });

        res.status(201).json({ message: 'user created' });
    } catch (error: any) {
        handleUserError(error, res);
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) throw new UserError('User not found. Verify your email and password');

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });

        res.status(200).json({ token: token });
    } catch (error: any) {
        handleUserError(error, res);
    }
}

const users = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;

        handleToken(token!);

        const users = await User.find({});
        res.status(200).json(users);

    } catch (error: any) {
        handleUserError(error, res);
    }
}

const usersPagination = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        // Necesitaba hacer una doble verificacion de si index o limit es "<= 0"
        // si lo es devuelve 1, sino lo es devuelve el valor que viene en la query por defecto
        const index = req.query.index !== 'undefined'  ? (Number(req.query.index) <= 0 ? 1 : Number(req.query.index)) : 1;
        const limit = req.query.limit !== 'undefined'  ? (Number(req.query.limit) <= 0 ? 1 : Number(req.query.limit)) : 3;
        
        const filter = req.query.filter?.toString() || '';
        const regex = new RegExp(filter, 'i');
        handleToken(token!);

        const options = {
            page: index,
            limit: limit
        };

        const response = await User.paginate({email: regex}, options);
        //Esto lo hago por si el usuario ingresa un index mayor al total de paginas. Para que devuelva la última pagina
        if (index && index > response.totalPages) {
            const new_pagination = await getNewPaginated(response.totalPages, limit, filter)
            return res.status(200).json(new_pagination);
        }

        res.status(200).json(response);

    } catch (error: any) {
        handleUserError(error, res);
    }
}

module.exports = {
    register,
    login,
    users,
    usersPagination
}