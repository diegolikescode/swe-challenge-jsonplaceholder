import { Router } from 'express'
import { getPosts } from '../controller/postsController.js'

const router = Router()

router.get('/posts', getPosts)

export default router

