import express from 'express'
import { PORT } from './config/config.js'
import imagenesRouter from './routes/imagenes.routes.js'
import usersRouter from './routes/users.routes.js'

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')

  next()
})

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World' })
})

app.use('/api/imagenes', imagenesRouter)
app.use('/api/users', usersRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
