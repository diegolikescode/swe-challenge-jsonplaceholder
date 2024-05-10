import { BASE_URL_REQUEST } from '../utils/constants.js'
import { Post, User } from '../utils/types.js'

export async function requestPosts(start: number, size: number): Promise<Post[]> {
    const url = `${BASE_URL_REQUEST}/posts?_start=${start}&_limit=${size}`
    try {
        const resp = await fetch(url)
        if (!resp.ok) {
            console.log('error fetching from', url, 'RESPONSE', resp)
            return []
        }

        try {
            return await resp.json()
        } catch (e) {
            console.log('error parsing json at requestPosts', e)
        }

    } catch (e) {
        console.log('error fetching from', url, 'ERROR', e)
    }
}

export async function requestUsers(firstId: number, lastId: number): Promise<User[]> {
    // the trick here is that all IDs are in order, so we can use this coupled with
    // the _start and _limit to our advantage and skip some unnecessary steps
    // IDs are 1-indexed, and these query params are 0
    const url = `${BASE_URL_REQUEST}/users?_start=${firstId-1}&_limit=${lastId-1}`
    try {
        const resp = await fetch(url)
        if (!resp.ok) {
            console.log('error fetching from', url, 'RESPONSE', resp)
            return []
        }

        try {
            return await resp.json()
        } catch (e) {
            console.log('error parsing json at requestPosts', e)
        }

    } catch (e) {
        console.log('error fetching from', url, 'ERROR', e)
    }
}
