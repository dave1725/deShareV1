import { create } from 'ipfs-http-client';
import Express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 5000;
const app = Express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
};

app.use(Express.json());
app.use(cors(corsOptions));

const ipfsClient = create({
    host: "localhost",
    port: 5001,
    protocol: 'http',
});

const addFileToIPFS = async (file) => {
    try {
        const result = await ipfsClient.add(file);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error uploading file to IPFS:', error);
        throw error;
    }
};

const getFile = async (hash) => {
    try {
        const chunks = [];
        for await (const chunk of ipfsClient.cat(hash)) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    } catch (error) {
        console.error('Error fetching file from IPFS:', error);
        throw error;
    }
};

/*
const exampleCID = "QmRdXGSKqRXjPkNxDzHPqEe7fmYfzLKWKSimE3GnxQ3arx";

getFile(exampleCID).then(data => {
    fs.writeFileSync('./fetched_image.jpg', data);
    console.log('Image file fetched from IPFS and saved as fetched_image.jpg');
}).catch(console.error);
*/

app.post('/share', async (req, res) => {
    try {
        const base64Data = req.body.fileData;
        //console.log(base64Data);
        console.log(req.body);
        const imageData = Buffer.from(base64Data.split(',')[1], 'base64');
        const result = await addFileToIPFS(imageData);
        res.status(200).json({ message: 'Image saved successfully', cid: result.path });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).send('Error processing request');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
