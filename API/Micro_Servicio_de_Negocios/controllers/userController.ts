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

function handleUserError(error: any, res: Response) {
    if (error instanceof UserError) return res.status(400).json({ error: error.message });
    res.status(500).json({ error: error.message });
}

const users = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization;
        const {index, limit, filter} = req.query;
        handleToken(token!);
        const users = await axios.get(`${process.env.URL_MONGO_SERVICE}/users/pagination?index=${index}&limit=${limit}&filter=${filter}`, {
            headers: {
                authorization: token,
            }
        })

        res.json(users.data);
    } catch (error: any) {
        handleUserError(error, res);
    }
}

module.exports = {
    users
}