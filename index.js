const express = require('express');
const { fromBuffer } = require('pdf2pic');
const sharp = require('sharp');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

const pdf2picOptions = {
  density: 300,
  savePath: './images',
  format: 'png',
  width: 1920,
  height: 1080,
};

app.get('/convert', async (req, res) => {
  const documentUrl = req.query.url;

  try {
    const response = await fetch(documentUrl);
    const pdfBuffer = await response.buffer();
    const convert = fromBuffer(pdfBuffer, pdf2picOptions);

    convert.bulk(-1)
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
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
