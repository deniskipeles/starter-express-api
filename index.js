const express = require('express');
const pdf2pic = require('pdf2pic');
const sharp = require('sharp');

const app = express();
const port = 3000;

const pdf2picOptions = {
  density: 300,
  savePath: './images',
  format: 'png',
  width: 1920,
  height: 1080,
};

const pdf2picConverter = new pdf2pic(pdf2picOptions);

app.get('/convert', (req, res) => {
  const documentUrl = req.query.url;

  pdf2picConverter.convertBulk(documentUrl, -1)
    .then((result) => {
      const images = [];

      for (let i = 0; i < result.length; i++) {
        sharp(result[i].path)
          .resize({ width: 800 })
          .toBuffer()
          .then((buffer) => {
            images.push(buffer);

            if (images.length === result.length) {
              res.setHeader('Content-Type', 'application/json');
              res.send({ images: images });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})
