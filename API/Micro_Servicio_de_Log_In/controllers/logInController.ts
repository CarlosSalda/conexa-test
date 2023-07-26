import { Request, Response } from 'express';
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;
const UserError = require('../models/errors/UserError');
const axios = require('axios');

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


const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        handleValidation(email, password);
        console.error(email, password)
        await axios.post(`${process.env.URL_MONGO_SERVICE}/register`, {
            email,
            password
        })

        res.status(201).json({ message: 'user created' });
    } catch (error: any) {
        if (error.response.status === 403) {
            return res.status(403).json({ error: error.response.data.error })
        }

        res.status(500).json({ error: error.message });
    }
}

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await axios.post(`${process.env.URL_MONGO_SERVICE}/login`, {
            email,
            password
        })

        if (!user) throw new UserError('User not found');

        const token = jwt.sign({ id: user._id }, secret, { expiresIn: 86400 });

        res.json({ token: token });
    } catch (error: any) {
        if (error.response.status === 403) {
            return res.json({ error: error.response.data.error })
        }

        res.status(500).json({ error: error.message });
    }
}

const users = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        handleToken(token!);
        const { pagination, index, limit, filter } = req.query;
        const custom_header = {
            authorization: token,
            origin: process.env.URL_BASE_LOGING
        }

        if (pagination) {
            const users = await axios.get(`${process.env.URL_BASE_BUSINESS}/api/users?index=${index}&limit=${limit}&filter=${filter}`, {
                headers: { ...custom_header}
            })
            res.json({ users: users.data });
        } else {
            const users = await axios.get(`${process.env.URL_MONGO_SERVICE}/users`, {
                headers: {
                    authorization: token,
                }
            })
            res.json({ users: users.data });
        }
      
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    users
}