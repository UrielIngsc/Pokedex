const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');

let pokemon = {
    namePokemon: null,
    imagePokemon: "img/no_image.png",
    sal: 0,
    def: 0,
    atk: 0,
    specie: null,
    typePokemon: null,
    info: null,
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
        info: pokemon.info,
    })
})


app.post("/", function(req, res){
    const pokemonToSearch = req.body.idOrNamePokemon;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonToSearch}`;

    https.get(url, (response)=>{
        let data = "";

        console.log(response.statusCode);
        if(response.statusCode === 200){
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
                pokemon.url = dataPokemon.species.url;
                pokemon.info = `${pokemon.namePokemon} pokemon type ${pokemon.typePokemon} 
                height:${dataPokemon.height} weight: ${dataPokemon.weight}\n
                moves: 1.${dataPokemon.moves[0].move.name} \n2.${dataPokemon.moves[1].move.name}\n
                3.${dataPokemon.moves[2].move.name}`
              
                res.redirect("/");
            }) 
        }
        
    }).on('error', (err)=>{
        console.log("Error" + err.message);
        
    }) 
})

app.listen( process.env.PORT || 3000, async()=>{
    console.log("Server running");
})