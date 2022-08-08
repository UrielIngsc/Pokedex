const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const say = require('say');
const fs = require('fs');


let pokemon = {
    namePokemon: null,
    imagePokemon: null,
    sal: null,
    def: null,
    atk: null,
    specie: null,
    typePokemon: null,
    info: null
}

const app = express();
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async(req, res)=>{

    res.render("pokedex", {
        imagePokemon: pokemon.imagePokemon,
        sal: pokemon.sal,
        def: pokemon.def,
        atk: pokemon.atk,
        info: pokemon.info
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
            pokemon.sal = dataPokemon.stats[0].base_stat;
            pokemon.atk = dataPokemon.stats[1].base_stat;
            pokemon.def = dataPokemon.stats[2].base_stat;
            pokemon.typePokemon = dataPokemon.types[0].type.name;
            pokemon.info = `${pokemon.namePokemon} Pokemon type ${pokemon.typePokemon}`
            
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