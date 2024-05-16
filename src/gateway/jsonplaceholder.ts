import { BASE_URL_REQUEST } from '../utils/constants.js'
import { Comment, Post, ResponseBody, User } from '../utils/types.js'

export async function requestPosts(start: number, size: number): Promise<Post[]|Error> {
    const url = `${BASE_URL_REQUEST}/posts?_start=${start}&_limit=${size}`
    try {
        const resp = await fetch(url)
        if (!resp.ok && resp.status !== 404) {
            console.log('error fetching from', url, 'RESPONSE', resp)
            return new Error(`error fetching from ${url}`)
        }

        if (resp.status === 404) {
            console.log('error fetching from', url, 'NOT FOUND', resp)
            return []
        }

        try {
            return await resp.json()
        } catch (e) {
            console.log('error parsing json at requestPosts', e)
            return new Error('error parsing json at requestPosts')
        }

    } catch (e) {
        console.log('error fetching from', url, 'ERROR', e)
        return new Error(`error fetching from ${url} 'ERROR', ${e}`)
    }
}

// the trick here is that all IDs are in order, so we can use this coupled with
// the _start and _limit to our advantage and skip some unnecessary steps
// IDs are 1-indexed, and these query params are 0-indexed
export async function requestUsers(firstId: number, lastId: number, responseBody: ResponseBody[]): Promise<User[]> {
    const url = `${BASE_URL_REQUEST}/users?_start=${firstId-1}&_limit=${lastId}`
    try {
        const resp = await fetch(url)
        if (!resp.ok) {
            console.log('error fetching from', url, 'RESPONSE', resp)
            return []
        }

        try {
            const users = await resp.json()
            mapUsersIntoResponseBody(responseBody, users)
            console.log('requested users')
        } catch (e) {
            console.log('error parsing json at requestUsers', e)
            return []
        }

    } catch (e) {
        console.log('error fetching from', url, 'ERROR', e)
        return []
    }
}

function mapUsersIntoResponseBody(responseBody: ResponseBody[], users: User[]) {
    responseBody.forEach(p => {
        p.user = users.find(u => u.id === p.userId )
    })
}

export async function requestComments(postsId: number[], responseBody: ResponseBody[]): Promise<any> {
    try {
        const promises = []
        postsId.forEach(id => {
            const url = `${BASE_URL_REQUEST}/posts/${id}/comments`
            promises.push(createCommentPromise(url))
        })

        const responses: any = await Promise.all(promises)
        responses.forEach((r: Comment[]) => {
            if (r.length === 0) return
            mapCommentsIntoResponseBody(responseBody, r)
        })

        console.log('requested comments')

        return null
    } catch (e) {
        console.log('error fetching from', `${BASE_URL_REQUEST}/posts/\${id}/comments`, 'ERROR', e)
    }
}

function mapCommentsIntoResponseBody(responseBody: ResponseBody[], comments: Comment[]) {
    responseBody.find(p => p.id === comments[0].postId).comments = comments
}

function createCommentPromise(url: string): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(resp => {
                if (!resp.ok) {
                    reject(new Error(`failed to fetch comments from request ${url}, status ${resp.status}`))
                }
                try {
                    return resp.json().then()
                } catch (e) {
                    console.log('error parsing json at createCommentPromise', e)
                    reject(new Error(`failed to fetch comments from request ${url}, status ${resp.status}`))
                }
            }).then(comments => {
                resolve(comments)
            }).catch(err => {
                reject(err)
            })
    })
}
