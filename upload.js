const multer = require('multer')
const fs = require('fs')
const BASE = 'public/' 
const id3 = require('node-id3')

module.exports = (dest, name) => {
    return (req, res, next) => {
        const upload = multer({dest})

        upload.single(name)(req, res, () => {
            const file = req.file
            const filename = BASE + Date.now() + '.mp3'
            fs.renameSync(file.path, filename)
            const tags = id3.read(filename)
            let cover = null
            if(tags.image){
                cover = 'public/cover/' + Date.now() + '.png'
                fs.writeFileSync(cover, tags.image.imageBuffer)
            }
            const obj = {
                filename: file.originalname,
                cover: cover,
                url: filename
            }
            req.body = obj
            next()
        })
    }
}