const puppeteer = require('puppeteer');
const express = require('express');
const smoothCode = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Anecdote = require('./models/anecdote');
const { title } = require('process');

mongoose.connect('mongodb+srv://PBBM:351426@cluster0.lxbk2.mongodb.net/DbTestAnecdotes?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
        .then(() => console.log('Connexion à MongoDB réussie !'))
        .catch(() => console.log('Connexion à MongoDB échouée !'));


// Utilisation du Body Parser pour utilisation dans les requêtes en JSON
smoothCode.use(bodyParser.json());

//================================================================================================================================
//================================ PARTIE SERVER =================================================================================
//================================================================================================================================
smoothCode.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//========================   Just get   ==================================================
// smoothCode.get('/api/stuff', (req, res, next) => {   

//         getData('http://secouchermoinsbete.fr/82733-des-chats-phosphorescents-pour-lutter-contre-le-sida')
//             .then(scrapeValue => {
//                 const anecdote = 
//                 {
//                     description: scrapeValue
//                 };
//             res.status(201).json(anecdote);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     })


    // Fin de mon problème **************

    const saveData = async(descriptionToSave) => {
        const anecdote = new Anecdote(
            {
                description: await descriptionToSave
            })
        anecdote.save();
    }


//========================================================================================
// Je n'arrive pas à utiliser le résultat de l'appel d'une fonction de type async pour l'intégrer dans une variable, je veux ici UTILISE la valeur de 'value'
//========================================================================================


//========================   Post - OK   =================================================
// smoothCode.post('/api/stuff', (req, res, next) => {
//     const anecdote = new Anecdote({
//         ...req.body
//     });
//     anecdote.save()
//         .then(() => res.status(201).json({ message: 'Objet enregistré ! '}))
//         .catch(error => res.status(400).json({error}));
// });
//========================================================================================

// ========================   Get All - OK   ==============================================
// smoothCode.get('/api/stuff', (req, res, next) => {

//    console.log("get test");

//    scrap()
//     .then(value => {
//         res.status(200).json(value)
//     })
//     .catch(e => res.status(400).json(`error: ${e}`))

    // Anecdote.find()
    //     .then(anecdotes => res.status(200).json(anecdotes))
    //     .catch(error => res.status(400).json({ error }))
// });
// ========================================================================================

//========================   Get One by Id - OK   ========================================
// smoothCode.get('/api/stuffById/:id', (req, res, next) => {
//     Anecdote.findOne({ _id : req.params.id })
//         .then(anecdote => res.status(200).json(anecdote))
//         .catch(error => res.status(404).json({ error }))
// });
//========================================================================================

//========================   Get One by Title - OK   =====================================
// smoothCode.get('/api/stuffByTitle/:title', (req, res, next) => {
//     let titleSearched = req.params.title;
//     Anecdote.find({"title" : {$regex : ".*"+titleSearched+".*", $options: 'i'} }) // regex = regular expression and 'i' for case insensitivity
//         .then(anecdotes => res.status(200).json(anecdotes))
//         .catch(error => res.status(400).json({ error }))
// });
//========================================================================================

//========================   Get One by Description content - OK   =======================
// smoothCode.get('/api/stuffByDescription/:description', (req, res, next) => {
//     Anecdote.find({"description" : {$regex : ".*"+req.params.description+".*", $options: 'i'} })
//         .then(anecdotes => res.status(200).json(anecdotes))
//         .catch(error => res.status(400).json({ error }))
// });
//========================================================================================
//================================================================================================================================



//================================================================================================================================
//===================================== PARTIE BDD== =============================================================================
//================================================================================================================================
    // const anecdoteTest = new Anecdote({
    //     title: 'title test',
    //     description: "description test"
    // });
    // anecdoteTest.save();
//================================================================================================================================
//================================================================================================================================




//================================================================================================================================
//===================================== PARTIE SCRAP =============================================================================
//================================================================================================================================


const getAllUrlCurrentPage = async (page) => {
    const result = await page.evaluate(() =>
        [...document.querySelectorAll(".summary a")].map(link => link.href),
    )
    return result;
}

const nextClickFunction = async (page) => {
    try {
        await page.waitForSelector(".read-more");
        await page.click("#main-content > div > ul > li.next > a");
    }
    catch (err) {
        console.log("ANOMALIE AU NIVEAU DE LA FONCTION click" + err);
    }
}

// const nextScrapFunction = async (page, dataFirstScrap) => {
//     try {
//         nextClickFunction(page);
//         await page.waitForTimeout(6000)
//         let dataSecondScrap = await getAllUrlCurrentPage(page);
//         let fullData = await dataFirstScrap.concat(dataSecondScrap);
//         return fullData;
//     }
//     catch (err) {
//         console.log("ANOMALIE AU NIVEAU DE LA FONCTION nextScrap" + err);
//     }
// }



// =======================================   Get data    ===========================================================
const getData = async (linkForData) => {

    // 1 - Créer une instance de navigateur
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto(linkForData)

    await page.waitForSelector(".summary") // fait une pause de 4 secondes

    try {
        // 3 - Récupérer les données
        const result = await page.evaluate(() => {

            let resume = document.querySelector(".summary").innerText // ".anecdote" ou ".summary"
            return { resume }
        })

        // 4 - Retourner les données (et fermer le navigateur)
        browser.close()
        return result
    }
    catch (err) {
        console.log(err);
    }
}
// ================================================================================================================


// ======================================= Get all links ============================================================================
const getAllUrls = async () => {
    const browser2 = await puppeteer.launch({ headless: true })
    const page = await browser2.newPage()
    await page.goto('https://secouchermoinsbete.fr/')
    await page.waitForSelector(".read-more")

    let dataFirstScrap = await getAllUrlCurrentPage(page);
    let fullData = dataFirstScrap;
    for (let i = 0; i < 0; i++) {
        nextClickFunction(page);
        await page.waitForTimeout(5000)

        let dataCurrentScrap = await getAllUrlCurrentPage(page);

        fullData = await fullData.concat(dataCurrentScrap);
    }

    return fullData;
}
//==================================================================================================================================
// const getData2 = async () => {
//     const value2 = await getData();
//     return value2;
//     }
//==================================================================================================================================








//==================================================================================================================================
const scrap = async () => {
    const browser = await puppeteer.launch({ headless: true})
    const urlList = await getAllUrls()
    const results = await Promise.all(
        urlList.map(url => getData(url)),
    )
    return results
}
//==================================================================================================================================




//=============   TEST   ===========================================================================================================

// 1.
scrap()
  .then(value => {
    // saveData(value);
    console.log(value);
  })
  .catch(e => console.log(`error: ${e}`))
// 2.


//==================================================================================================================================



//=======================  1. Requêtage de toutes les URL du site ===============================================================
// getAllUrls().then(value => {
//     urlList = [];
//     urlList.push(value);
//     for (const element of urlList) {
//         // getData(element);
//         console.log(element);
//     }
//     });
//============================================================================================================================

//=======================  Requêtage des URLS et scrap de chacune d'entre elle  =============================================
// ?? Je n'arrive pas à utiliser mes deux fonctions 1. et 2. pour scraper les données de l'ensemble de mes URLS ??
//============================================================================================================================

//======================  2. Scrap des données d'une seule page  ===============================================================
// getData('https://secouchermoinsbete.fr/86092-le-mot-de-passe-a-220-millions-de-dollars').then(valueTwo => {
//     description = JSON.stringify(valueTwo);
//     description = description.substring(10);
//     description = description.slice(0, -1);
//     // console.log(description)
//     const anecdote = new Anecdote(
//         {
//             title: 'title test',
//             description: description
//         })
// anecdote.save();
// })
//============================================================================================================================


module.exports = smoothCode;