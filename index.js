const express = require('express');
const request = require('request');
const { fromBuffer } = require('pdf2pic');
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

app.get('/convert', (req, res) => {
  const documentUrl = req.query.url;

  request.get({ url: documentUrl, encoding: null }, (error, response, body) => {
    if (error || response.statusCode !== 200) {
      res.status(400).send('Error fetching PDF');
      return;
    }

    const convert = fromBuffer(body, pdf2picOptions);

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
              res.status(500).send('Error processing PDF');
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error converting PDF to images');
      });
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
