const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require('langchain/prompts');
const { SerpAPI, DataForSeoAPISearch } = require('langchain/tools');
const { initializeAgentExecutorWithOptions } = require('langchain/agents');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path');
const { BlobServiceClient } = require("@azure/storage-blob");
const fs = require('fs');
const crypto = require('crypto');
const { spawn } = require('child_process');
const { generateAdContent } = require('./adContentGenerator');
const blobServiceClient = BlobServiceClient.fromConnectionString("");
const containerName = 'mosiaudio'; 
// Assuming express is also needed since app is used in the code
const express = require('express');
const app = express();
const axios = require('axios');
const { FFScene, FFAlbum, FFText, FFCreator, FFImage } = require('ffcreator');
const CACHE_DIR = 'cache'; 
const OUTPUT_DIR = 'output';
const WIDTH = 800;
const HEIGHT = 600;
const API_KEY = 

//app.use(cors());
app.use(bodyParser.json()); 
let  creator;
async function fetchImagesFromPexels(query, count) {
  const url = `https://api.pexels.com/v1/search?query=${query}&per_page=${count}`;
  const headers = {
    "Authorization": API_KEY
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.photos.map(photo => photo.src.large);
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    return [];
  }
}

async function createVideo(query, count, videoFileName,intro, slide1,slide2,outro) {

creator = new FFCreator({
  cacheDir: CACHE_DIR,
  outputDir: OUTPUT_DIR,
  width: WIDTH,
  height: HEIGHT,
});
  const imageUrls = await fetchImagesFromPexels(query, count);
const slideTexts = [
  slide1,
  slide2
  // ... add more texts as needed
];

 const introScene = new FFScene();
  introScene.setBgColor('#34495e');
  introScene.setDuration(5); // Assuming 5 seconds for the intro, adjust as needed
  
  const introText = new FFText({ text: intro, x: 10 , y: HEIGHT / 2 });
  introText.setColor('#ffffff');
  introText.setStyle({ fontSize: 20, fontFamily: 'Arial', fontStyle: 'bold' });
  introText.addEffect('fadeIn', 1, 0); 
  introScene.addChild(introText);
  
  creator.addChild(introScene);


  for (let index = 0; index < imageUrls.length; index++) {
    const scene = new FFScene();
    scene.setBgColor('#34495e');
    scene.setDuration(6);

    const img = new FFImage({ path: imageUrls[index], x: WIDTH / 2, y: HEIGHT / 2 });
    img.setScale(0.6);  // Adjust this scale value as per your requirements
    img.addEffect('moveTo', 6, -800, 300);
    scene.addChild(img);
     const textContent = slideTexts[index] || `Business Insight ${index + 1}`;
    const text = new FFText({ text: textContent, x: 50, y: HEIGHT - 70 }); 
    text.setColor('#ffffff');
    text.setStyle({ fontSize: 20, fontFamily: 'Arial', fontStyle: 'bold' });

    // Use a fadeIn effect
    text.addEffect('fadeIn', 1, 1); 

    // Delayed the moveTo effect
    text.addEffect('moveTo', 2, 3, WIDTH - 50, HEIGHT - 70); 

    scene.addChild(text);

console.log('Creator:', creator);
console.log('Scene:', scene);
    creator.addChild(scene);
  }

   // Outro Scene
  const outroScene = new FFScene();
  outroScene.setBgColor('#34495e');
  outroScene.setDuration(5); // Assuming 5 seconds for the outro, adjust as needed

  const outroText = new FFText({ text: outro , x: 10, y: HEIGHT / 2 });
  outroText.setColor('#ffffff');
  outroText.setStyle({ fontSize: 20, fontFamily: 'Arial', fontStyle: 'bold' });
  outroText.addEffect('fadeIn', 1, 0);
  outroScene.addChild(outroText);
  
  creator.addChild(outroScene);
  

  creator.output(path.join(__dirname, videoFileName));
  creator.start();
await  handleFFCreatorEvents();
}

function handleFFCreatorEvents() {
return new Promise((resolve, reject) => {
  creator.on('start', () => {
    console.log('FFCreator start');
  });
  creator.on('error', e => {
    console.log(`FFCreator error: ${JSON.stringify(e)}`);
     reject(e)
  });
  creator.on('progress', e => {
    console.log(`FFCreator progress: ${e.state} ${(e.percent * 100) >> 0}%`);
  });
  creator.on('complete', e => {
    console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${e.output}`);
     resolve();
  });

});

}




// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Define the /connected endpoint
app.get('/connected', (req, res) => {
  res.send('Connected hi Sameen and Nisha');
});





app.post('/generate_ad_videos', async (req, res) =>  {
let adContent;

const business = req.body.business;
    const country = req.body.country;
    const userInput = req.body.userInput;
  const industry = req.body.industry;
  const template = "You are a content creator for a 15-second video advertisement of only 3 slides. Provide content in the format of an array of objects, where each object represents a slide with a 'title' and 'description' and 'script'. Example: [{'title': 'Title 1', 'description': 'Description 1', 'script':'Script 1'}, {'title': 'Title 2', 'description': 'Description 2', 'script':'Script 2'}]. The script is the text that wil be read out in the ad , what the sales message is and should end with the call to action like Call us now or Email us now or Check out our store or check out our site today and Please make the scripts short and to the point use only one short sentence for each slide"
  const openaiApiKey = "";
  const openai = new OpenAI({
    openAIApiKey: openaiApiKey,
    temperature: 0.9,
  });


  const tools = [
    new SerpAPI("", {
      location: country,
      hl: "en",
      gl: "us",
    }),
    new DataForSeoAPISearch({
      username: process.env.DATAFORSEO_LOGIN,
      password: process.env.DATAFORSEO_PASSWORD,
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, openai, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  

  const adPromptTemplate = PromptTemplate.fromTemplate(`  
Do reaserch for content creation.
{business} that {description}.
Find what is trending for our industry and give use keywords and trends 
`);

  const adPrompt = await adPromptTemplate.format({
    business: business,
    description: userInput
  });

  const result = await executor.call({ input: adPrompt });
  console.log("Research Result:", result);

    // Call generateAdContent function
    adContent = await generateAdContent(result, business);

    if (adContent) {
        console.log("Intro:", adContent.intro);
        console.log("Slide 1 Text:", adContent.slide1);
        console.log("Slide 2 Text:", adContent.slide2);
        console.log("Outro Text:", adContent.outro);
    } else {
        console.error("Failed to generate ad content.");
    }

    try {
        const videoFileName = `${business}_${Math.random().toString(36).substr(2, 9)}_advideo.mp4`;
        const videoFilePath = path.join(__dirname, videoFileName);

        await createVideo(industry, 2, videoFileName,  adContent.intro, adContent.slide1, adContent.slide2,adContent.outro);  

        // Upload the video to Azure Blob
        const videoBuffer = fs.readFileSync(videoFilePath);
        const videoContainerClient = blobServiceClient.getContainerClient(containerName);
        const videoBlobClient = videoContainerClient.getBlockBlobClient(videoFileName);
        await videoBlobClient.upload(videoBuffer, videoBuffer.length);

        const videoBlobUrl = videoBlobClient.url;

        // Cleanup - delete the temporary video file after upload (optional but recommended)
        fs.unlinkSync(videoFilePath);

        console.log("Video uploaded successfully to Azure Blob:", videoBlobUrl);

        res.json({ video_link: videoBlobUrl });

    } catch (error) {
        console.error("Error generating and uploading video:", error);
        res.status(500).send("Error generating and uploading video.");
    }
});



app.post('/test_radio_ads',async (req, res) => {
const business = req.body.business;
    const country = req.body.country;
    const userInput = req.body.userInput;
const industry = req.body.industry;

  const openaiApiKey = "";
  const openai = new OpenAI({
    openAIApiKey: openaiApiKey,
    temperature: 0.9,
  });

  const tools = [
    new SerpAPI("", {
      location: country,
      hl: "en",
      gl: "us",
    }),
    new DataForSeoAPISearch({
      username: process.env.DATAFORSEO_LOGIN,
      password: process.env.DATAFORSEO_PASSWORD,
    }),
  ];

  const executor =await  initializeAgentExecutorWithOptions(tools, openai, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

 

  const adPromptTemplate = PromptTemplate.fromTemplate(`Come with a only script for a radio or podcast advert for {business} , the description {description} and the location {location}. Please do not explain how to make it but you tyope the words that will be in the script thats all`);

  const adPrompt = await adPromptTemplate.format({
    business: business,
    location: country,
    description: userInput
  });

  const result =  await executor.call({ input: adPrompt });
 console.log(result) 
let generatedFilePath = "";
   const pythonProcess = spawn("python3", ["generate_audio.py",result.output,business]);
    let audioData = "";

    pythonProcess.stdout.on("data", (data) => {
       generatedFilePath = data.toString().trim();
        console.log("Generated file path:", generatedFilePath);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
console.log("Python process closed with code:", code);
     if (code === 0 && generatedFilePath) {
        try {
            console.log("Attempting to read file:", generatedFilePath);
            if (fs.existsSync(generatedFilePath)) {
                const audioBuffer = fs.readFileSync(generatedFilePath);

                // Upload to Azure Blob and return link
                const containerClient = blobServiceClient.getContainerClient(containerName);
                const blobFileName = path.basename(generatedFilePath);
                const blockBlobClient = containerClient.getBlockBlobClient(blobFileName);
                await blockBlobClient.upload(audioBuffer, audioBuffer.length);

                const blobUrl = blockBlobClient.url;

                // Cleanup - delete the temporary file after upload (optional but recommended)
                fs.unlinkSync(generatedFilePath);

                console.log("File uploaded successfully to Azure Blob:", blobUrl);

                res.json({ link: blobUrl });
            } else {
                console.error(`File not found at path: ${generatedFilePath}`);
                res.status(500).send("Generated audio file not found.");
            }
        } catch (error) {
            console.error(`Failed to process the file at path ${generatedFilePath}:`, error);
            res.status(500).send("Error processing generated audio file.");
        }
    } else {
        res.status(500).send(`Python process exited with code ${code}`);
    }
});
});

app.get('/test_radio2_ads', (req, res) => {
let generatedFilePath = "";
let business = "business";
   const pythonProcess = spawn("python3", ["generate_audio.py", "Hi test user how are you",business]);
    let audioData = "";

    pythonProcess.stdout.on("data", (data) => {
       generatedFilePath = data.toString().trim();
        console.log("Generated file path:", generatedFilePath);
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
console.log("Python process closed with code:", code);
     if (code === 0 && generatedFilePath) {
        try {
            console.log("Attempting to read file:", generatedFilePath);
            if (fs.existsSync(generatedFilePath)) {
                const audioBuffer = fs.readFileSync(generatedFilePath);

                // Upload to Azure Blob and return link
                const containerClient = blobServiceClient.getContainerClient(containerName);
                const blobFileName = path.basename(generatedFilePath);
                const blockBlobClient = containerClient.getBlockBlobClient(blobFileName);
                await blockBlobClient.upload(audioBuffer, audioBuffer.length);

                const blobUrl = blockBlobClient.url;

                // Cleanup - delete the temporary file after upload (optional but recommended)
                fs.unlinkSync(generatedFilePath);

                console.log("File uploaded successfully to Azure Blob:", blobUrl);

                res.json({ link: blobUrl });
            } else {
                console.error(`File not found at path: ${generatedFilePath}`);
                res.status(500).send("Generated audio file not found.");
            }
        } catch (error) {
            console.error(`Failed to process the file at path ${generatedFilePath}:`, error);
            res.status(500).send("Error processing generated audio file.");
        }
    } else {
        res.status(500).send(`Python process exited with code ${code}`);
    }
});
});
app.post('/radio_ads', async (req, res) => {
    const { description, business } = req.body;
  const openaiApiKey = "";
  const openai = new OpenAI({
    openAIApiKey: openaiApiKey,
    temperature: 0.9,
  });

  let country = "Uganda";
  const tools = [
    new SerpAPI("", {
      location: country,
      hl: "en",
      gl: "us",
    }),
    new DataForSeoAPISearch({
      username: process.env.DATAFORSEO_LOGIN,
      password: process.env.DATAFORSEO_PASSWORD,
    }),
  ];

  const executor = await initializeAgentExecutorWithOptions(tools, openai, {
    agentType: "zero-shot-react-description",
    verbose: true,
  });

  const userInput = "Marks pizza a pizza place located in Uganda kireka";

  const adPromptTemplate = PromptTemplate.fromTemplate("Generate an ad script for {business} that {description}. Trending information: {trendingInfo}");
  const adPrompt = await adPromptTemplate.format({
    business: userInput,
    description: "provides high-quality products and services",
    trendingInfo: "some trending information",
  });

  const result = await executor.call({ input: adPrompt });
  console.log("Generated Ad Script:", result.output);
 const pythonProcess = spawn("python3", ["generate_audio.py", result.output, business]);
    let audioData = "";

    pythonProcess.stdout.on("data", (data) => {
        audioData += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", async (code) => {
        if (code === 0) {
            const audioBuffer = Buffer.from(audioData, "base64");
            const randomNum = crypto.randomBytes(3).toString('hex');
            const filename = `${business}_${randomNum}_radio_ad.mp3`;
            fs.writeFileSync(filename, audioBuffer);

            // Upload to Azure Blob and return link
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blockBlobClient = containerClient.getBlockBlobClient(filename);
            await blockBlobClient.upload(audioBuffer, audioBuffer.length);
            const blobUrl = blockBlobClient.url;

            res.json({ link: blobUrl });
        } else {
            res.status(500).send(`Python process exited with code ${code}`);
        }
    });
});
// For any other route, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
