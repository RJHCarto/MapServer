const Pool = require('pg').Pool
const dotenv = require('dotenv')

dotenv.config();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

const getChapters = (request, response) => {
    pool.query('SELECT date, title, weather, subtitle, image_url, description, ST_AsGeoJSON(focus_geometry) AS focus_geom, ST_AsGeoJSON(stops) AS stops_geom FROM scotland.chapters ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        results.rows[0].focus_geom = JSON.parse(results.rows[0].focus_geom)
        results.rows[0].stops_geom = JSON.parse(results.rows[0].stops_geom)
        response.status(200).json(results.rows[0])
    })
}

const getChapterById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM scotland.chapters WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}


const createChapter = (request, response) => {
    const { date, title, weather, subtitle, image_url, description, focus_geometry, stops } = request.body

    pool.query('INSERT INTO scotland.chapters(date, title, weather, subtitle, image_url, description, focus_geometry, stops) VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [date, title, weather, subtitle, image_url, description, focus_geometry, stops], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).send(`User added with ID: ${results.insertId}`)
    })
}

const updateChapter = (request, response) => {
    const id = parseInt(request.params.id)
    const { date, title, weather, subtitle, image_url, description, focus_geometry, stops } = request.body

    pool.query('UPDATE scotland.chapters SET date=$1, title=$2, weather=$3, subtitle=$4, image_url=$5, description=$6, focus_geometry=$7, stops=$8 WHERE id=$9', [date, title, weather, subtitle, image_url, description, focus_geometry, stops, id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
    })
}

const deleteChapter = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('DELETE FROM scotland.chapters WHERE id=$1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getChapters,
    getChapterById,
    createChapter,
    updateChapter,
    deleteChapter,
}