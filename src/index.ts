import express from 'express'
import router from './routes/index.js'

const app = express()
app.use(express.json())

app.get('/', (_, res) => res.status(200).json({message: "justin case"}))
app.use('/api', router)

app.listen(8080, () => console.log("SERVER UP"))

