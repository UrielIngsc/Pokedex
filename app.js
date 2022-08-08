const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

let pokemon = {
    namePokemon: "null",
    imagePokemon: "null",
}

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async(req, res)=>{
    
    res.render("pokedex", {
        name: "Uriel"
    })
    
})

app.post("/", function(req, res){
    const pokemonToSearch = req.body.idOrNamePokemon;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonToSearch}`;

   
    https.get(url, (response)=>{
        let data = "";

        console.log(response.statusCode);
        response.on("data", (chunk)=>{       
            data += chunk;
            
        });

        response.on("end", ()=>{

            let dataPokemon = JSON.parse(data);
            console.log("Data parse to Json");

            pokemon.namePokemon = dataPokemon.name;
            pokemon.imagePokemon = dataPokemon.sprites.front_default;
            
            const dataJson = JSON.stringify(pokemon);
            fs.writeFileSync('pokemonData.json', dataJson);

            res.redirect("/");
            
        })
        
    }).on('error', (err)=>{
        console.log("Error" + err.message);
    })

    
})

app.listen( process.env.PORT || 3000, async()=>{
    console.log("Server running");
})