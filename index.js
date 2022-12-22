// const express = require('express')
// const app = express()
// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('Yo!')
// })
// app.listen(process.env.PORT || 3000)

const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/pdf-image", async (req, res) => {
  // Launch a new browser instance and create a new page.
  const browser = awaitnpm i puppeteer puppeteer.launch();
  const page = await browser.newPage();
  const pdfUrl = req.query.url

  // Load the PDF into the page.
  await page.goto(pdfUrl, { waitUntil: "networkidle0" });

  // Capture a screenshot of the page and get the image data as a buffer.
  const imageBuffer = await page.screenshot({
    type: "jpeg",
    encoding: "binary",
  });

  // Close the browser.
  await browser.close();

  // Set the response headers.
  res.set("Content-Type", "image/jpeg");
  res.set("Content-Length", imageBuffer.length);

  // Send the image data to the client.
  res.send(imageBuffer);
});


app.get('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})
app.get('/hello', (req, res) => {
    console.log("Just got a request!")
    res.send('hello world!')
})

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
