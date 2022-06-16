const express = require('express')
const app  = express()
const cors = require('cors')
const crypto = require('crypto-js')
const upload = require('./upload')
const id3 = require('node-id3')

app.use(cors())
app.use('/public', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.post('/search/song', (req, res) => {
    try{
        const enc = req.body.enc
        const dec = crypto.AES.decrypt(enc, process.env.KEY, {iv: process.env.IV}).toString(crypto.enc.Utf8)
        const info = JSON.parse(dec)
        const tags = id3.read(info.url)
        const obj = {
            ...info,
            album: tags.album || null,
            title: tags.title || null,
            artist:  tags.artist || null,
        }
        res.json(obj)
    }catch(e){ res.status(500).json({message: 'Internal Server Error'}) }
})

app.post('/song', upload('public', 'song'),async (req, res) => {
    try{
        const txt = JSON.stringify(req.body)
        const enc = crypto.AES.encrypt(txt, process.env.KEY, {iv: process.env.IV}).toString()
        res.json({encrypted: enc})
    }catch(e){ res.status(500).json({message: 'Internal Server Error'}) }
})

app.listen(process.env.PORT)