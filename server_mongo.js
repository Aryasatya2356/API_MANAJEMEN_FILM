require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const Movie = require('./models/Movie');
const Director = require('./models/Director');

const app = express();
const PORT = process.env.PORT || 3300;//gunakan PORT dari .env

connectDB();
app.use(cors()); 
app.use(express.json());

//Rute-rute akan ditempatkan disini...
// === ROUTES ===
app.get('/status', (req, res) => {
    res.json({ok: true, service: 'film-api'});
});

//get /movies -menggunakan mongoose find()
app.get('/movies', async (req, res, next) => {//tambahkan next untuk error handler
    try {
        const movies = await Movie.find({});
        res.json(movies);
    }catch (err) {
        next(err); //teruskan error ke error handler
    }
});

//get /movies/:id - menggunakan mongoose findById()
app.get('/movies/:id', async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({error: 'Film tidak ditemukan'});
        }
        res.json(movie);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

//post /movies -menggunakan mongoose save()
app.post('/movies', async (req, res, next) => {
    try {
        const newMovie = new Movie({
            title: req.body.title,
            director: req.body.director,
            year: req.body.year
        });
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({error: err.message});
        }
        next(err);
    }
});

//put /movies/:id -menggunakan mongoose findByIdAndUpdate()
app.put('/movies/:id', async (req, res, next) => {
    try {
        //hanya ambil field yang diizinkan untuk diupdate dari body
        const { title, director, year } = req.body;
        if(!title || !director || !year) {
            return res.status(400).json({error: 'title, director, year wajib diisi'});
        }

        const updatedMovie = await Movie.findByIdAndUpdate (
            req.params.id,
            { title, director, year },
            { new: true, runValidators: true }
        );
        if (!updatedMovie){
            return res.status(404).json({ error: 'Film tidak ditemukan'});
        }
        res.json(updatedMovie);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message});
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

//delete /movies/:id -menggunakan mongoose findByIdAndDelete()
app.delete('/movies/:id', async (req, res, next) => {
    try {
        const deletedMovie = await Movie.findByIdAndDelete(req.params.id);
        if (!deletedMovie) {
            return res.status(404).json({ error: 'Film tidak ditemukan' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

//=== DIRECTORS ===
//GET /directors -menggunakan mongoose find()
app.get('/directors', async (req, res, next) => {//tambahkan next untuk error handler
    try {
        const directors = await Director.find({});
        res.json(directors);
    }catch (err) {
        next(err); //teruskan error ke error handler
    }
});

//GET /directors/:id - menggunakan mongoose findById()
app.get('/directors/:id', async (req, res, next) => {
    try {
        const director = await Director.findById(req.params.id);
        if (!director) {
            return res.status(404).json({error: 'Sutradara tidak ditemukan'});
        }
        res.json(director);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

//POST /directors -menggunakan mongoose save()
app.post('/directors', async (req, res, next) => {
    try {
        const newDirector = new Director({
            name: req.body.name,
            birthYear: req.body.birthYear
        });
        const savedDirector = await newDirector.save();
        res.status(201).json(savedDirector);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({error: err.message});
        }
        next(err);
    }
});

//PUT /directors/:id -menggunakan mongoose findByIdAndUpdate()
app.put('/directors/:id', async (req, res, next) => {
    try {
        //hanya ambil field yang diizinkan untuk diupdate dari body
        const { name, birthYear } = req.body;
        if(!name || !birthYear) {
            return res.status(400).json({error: 'nama, birthYear wajib diisi'});
        }

        const updatedDirector = await Director.findByIdAndUpdate (
            req.params.id,
            { name, birthYear },
            { new: true, runValidators: true }
        );
        if (!updatedDirector){
            return res.status(404).json({ error: 'Sutradara tidak ditemukan'});
        }
        res.json(updatedDirector);
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message});
        }
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ error: 'Format ID tidak valid'});
        }
        next(err);
    }
});

//DELETE /directors/:id -menggunakan mongoose findByIdAndDelete()
app.delete('/directors/:id', async (req, res, next) => {
    try {
        const deletedDirector = await Director.findByIdAndDelete(req.params.id);
        if (!deletedDirector) {
            return res.status(404).json({ error: 'Film tidak ditemukan' });
        }
        res.status(204).send();
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({error: 'Format ID tidak valid'});
        }
        next(err);
    }
});



//fallback 404
app.use((req, res) => {
    res.status(404).json({error: 'Rute tidak ditemukan'});
});

//Error handler (opsional tapi bagus ditambahkan)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Terjadi kesalahan pada server'});
});

app.listen(PORT, () => {
    console.log(`Server aktif di http://localhost: ${PORT}`);
});

