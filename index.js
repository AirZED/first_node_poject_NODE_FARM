const fs = require("fs");
const http = require("http");
// const path = require("path");
const url = require("url");

//third party modules import
const slugify = require("slugify");

//own function
const replaceTemplate = require("./modules/replaceTemplate");

//BLOCKING SYNCHRONOUS WAY
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `this is what we know about the avocardo ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written");

// NON-BLOCKING AYSNC WAY
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   if (err) return console.log("File does not exist");
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile(
//         "./txt/final.txt",
//         `${data2} '\n' ${data3}`,
//         "utf-8",
//         (err) => {}
//       );
//       console.log("Files has been written");
//     });
//   });
// });
// console.log("Will read file!");

// /////////////////////////////////////////////
// SERVER

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);

const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const slugs = dataObj.map((each) => slugify(each.productName, { lower: true }));

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  console.log(query.id, pathname);

  //oVERVIEW
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //PRODUCTS
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API
  } else if (pathname === "/api") {
    fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8", (err, data) => {
      const productData = JSON.parse(data);
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(data);
    });

    //NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      my_own_header: "hello_mfoniso",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

//listens for incoming requests
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to request on port 8000");
});
