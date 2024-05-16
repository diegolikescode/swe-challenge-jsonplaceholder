import { Request, Response } from 'express';
import { ResponseBody, User } from '../utils/types.js'
import { requestPosts, requestUsers, requestComments } from '../gateway/jsonplaceholder.js';

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
    if (posts instanceof Error) {
        res.status(500).json()
        return
    }

    if (posts.length === 0) {
        res.status(404).json()
        return
    }

    const responseBody: ResponseBody[] = posts.map(post => ({
        ...post,
        user: null,
        comments: []
    }))

    const userIds = posts.map(p => p.userId)
    const postIds = posts.map(p => p.id)

    await fetchUsersAndCommentsAsync(userIds, postIds, responseBody)

    console.log('responding')
    res.status(200).json(responseBody)
}

async function fetchUsersAndCommentsAsync(
    userIds: number[],
    postIds: number[],
    responseBody: ResponseBody[]): Promise<any|Error> {

    /*
    await requestUsers(userIds[0], userIds[userIds.length-1], responseBody)
    await requestComments(postIds, responseBody)
    */

    await Promise.all([
        requestUsers(userIds[0], userIds[userIds.length-1], responseBody),
        requestComments(postIds, responseBody)
    ])
}
