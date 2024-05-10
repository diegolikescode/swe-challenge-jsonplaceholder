import { Request, Response } from 'express';
import { Post, User, Comment } from '../utils/types.js'
import { requestPosts } from '../gateway/jsonplaceholder.js';

type ResponseBody = Post & {
    user: User
    comments: Comment[]
}

export async function getPosts(req: Request, res: Response): Promise<void> {
    const { start, size } = req.query

    const startVal = +start
    const sizeVal = +size
    if (isNaN(startVal) || isNaN(sizeVal)) {
        res.status(500)
            .json({"message": "the values passed as params were not numbers, please provide 'start' and 'size' as valid numbers"})
        return
    }

    const posts = await requestPosts(startVal, sizeVal)
    // now fetching all users and comments concurrently

    res.status(200).json(posts)
}
