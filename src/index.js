const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const db = require('./queries')

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API'})
})

app.get('/chapters', db.getChapters)
app.get('/chapters/:id', db.getChapterById)
app.post('/chapters', db.createChapter)
app.put('/chapters/:id', db.updateChapter)
app.delete('/chapters/:id', db.deleteChapter)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})