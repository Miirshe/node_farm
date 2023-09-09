import fs from 'fs';
import url from 'url';
import http from 'http';
import path from 'path';
const replaceTemplate = (temp, res) => {
    let ouput = temp.replace(/{%productName%}/g, res.productName);
    ouput = ouput.replace(/{%image%}/g, res.image);
    ouput = ouput.replace(/{%from%}/g, res.from);
    ouput = ouput.replace(/{%quantity%}/g, res.quantity);
    ouput = ouput.replace(/{%nutrients%}/g, res.nutrients);
    ouput = ouput.replace(/{%price%}/g, res.price);
    ouput = ouput.replace(/{%description%}/g, res.description);
    ouput = ouput.replace(/{%id%}/g, res.id);
    if (!res.organic) ouput = ouput.replace(/{%not-organic%}/g, 'not-organic');

    return ouput;
}
const tempOverview = fs.readFileSync(path.join('..', 'client', 'overview.html'), 'utf-8');
const tempOverviewCard = fs.readFileSync(path.join('..', 'client', 'view_card.html'), 'utf-8');
const tempProducts = fs.readFileSync(path.join('..', 'client', 'product.html'), 'utf-8');
const data = fs.readFileSync('./model/data.json', 'utf-8');
const objectData = JSON.parse(data);
const app = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    //Overview Page
    if (pathname == '/' || pathname == '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html',
        })
        const product_card = objectData.map(res => replaceTemplate(tempOverviewCard, res)).join('');
        const ouput = tempOverview.replace('{%ProductCards%}', product_card);
        res.end(ouput);
    }

    //Product Page
    else if (pathname == '/product') {
        res.writeHead(200, {
            'content-type': 'text/html'
        })
        const product = objectData[query.id];
        const ouput = replaceTemplate(tempProducts, product);
        res.end(ouput);
    }

    // Not Found Page
    else {
        res.writeHead(404, {
            'content-type': 'text/html'
        })
        res.end("<h1>Page Not Found ! </h1>")
    }
})

const PORT = 8800;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})