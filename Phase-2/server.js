function dajPort(korime) {
    var os = require("os");
    const HOST = os.hostname();
    let port = null;
    if (HOST != "spider") {
        port = 12222;
    } else {
        const portovi = require("/var/www/OWT/2025/portovi.js");
        port = portovi[korime];
    }
    return port;
}

const port = dajPort("mbarnjak23"); 

const express = require("express");

const server = express();

server.use(express.json());
const putanja = __dirname;
const fs = require("fs");
const path = require("path");
const alat = require("./js/server/alati");
const bodyParser = require("express").urlencoded({ extended: true});
server.use(bodyParser);

server.post("/obrazac", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="hr">
    <head>
      <meta charset="UTF-8">
      <title>Obrazac poslan</title>
    </head>
    <body>
      <h2>Obrazac je uspješno poslan!</h2>
      <a href="/index.html">Povratak na početnu stranicu</a>
    </body>
    </html>
    `);
});

server.get("/api/alati/:naziv", (req, res) => {
    const naziv = req.params.naziv;
    const alatObjekt = alat.dohvatiPoNazivu(naziv);

    if (!alatObjekt) {
        return res.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen." });
    }

    res.status(200).json(alatObjekt);
});

server.post("/api/alati/:naziv", (req, res) => {
    res.status(405).json({ greska: "Metoda nije dopuštena za specifični alat." });
});

server.delete("/api/alati/:naziv", (req, res) => {
    const naziv = req.params.naziv;
    const uspjeh = alat.ukloniPoNazivu(naziv);

    if (!uspjeh) {
        return res.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen za brisanje." });
    }

    res.status(204).send(); 
});


server.put("/api/alati/:naziv", (req, res) => {
    const naziv = req.params.naziv;
    const { naziv: noviNaziv, opis, kategorija, url, godina } = req.body;

    if (!noviNaziv || !opis || !kategorija || !url || !godina) {
        return res.status(400).json({ greska: "Neispravni podaci za ažuriranje." });
    }

    const uspjeh = alat.azurirajPostojeci(naziv, { naziv: noviNaziv, opis, kategorija, url, godina });

    if (!uspjeh) {
        return res.status(404).json({ greska: "AI alat s traženim nazivom nije pronađen za ažuriranje." });
    }

    res.status(200).json({ naziv: noviNaziv, opis, kategorija, url, godina });
});


server.get("/api/alati", (req, res) => {
    const sviAlati = alat.dohvatiSve();
    res.status(200).json(sviAlati);
})

server.post("/api/alati", (req, res) => {
    const { naziv, opis, kategorija, url, godina } = req.body;

    if (!naziv || !opis || !kategorija || !url || !godina) {
        return res.status(400).json({ greska: "Neispravni ili nepotpuni podaci za alat." });
    }

    const noviAlat = { naziv, opis, kategorija, url, godina };

    const rezultat = alat.dodaj(noviAlat); 

    if (rezultat) {
        return res.status(201).json(noviAlat);
    } else {
        return res.status(500).json({ greska: "Greška prilikom dodavanja alata." });
    }
});

server.put("/api/alati", (req, res) => {
    res.status(405).json({ greska: "Metoda nije dopuštena za popis alata." });
});

server.delete("/api/alati", (req, res) => {
    res.status(405).json({ greska: "Metoda nije dopuštena za popis alata." });
});



server.get("/alati/detalji", (req, res)=>{
    const naziv = req.query.naziv;
   
    const alatDetalji = alat.dohvatiPoNazivu(naziv)

    if(!alatDetalji){
        return res.send("<h2>Traženi AI alat nije pronađen!</h2>")
    }

   let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>Detalji: ${alatDetalji.naziv}</title>
    <link rel="stylesheet" href="/dizajn/mbarnjak23.css">
</head>
<body>
    <div class="kartica-detalji">
        <h1><em>${alatDetalji.naziv}</em></h1>
        <ul>
            <li><strong>Opis:</strong> ${alatDetalji.opis}</li>
            <li><strong>Kategorija:</strong> ${alatDetalji.kategorija}</li>
            <li><strong>Godina pokretanja:</strong> ${alatDetalji.godina}</li>
            <li><strong>URL:</strong> <a href="${alatDetalji.url}" target="_blank">${alatDetalji.url}</a></li>
        </ul>
        <a href="/alati" class="gumb-natrag">Natrag</a>
    </div>
</body>
</html>
`;

    res.send(html)
})


server.get("/alati", (req,res) =>{
    const kategorija = req.query.kategorija || "";
    let alati = alat.dohvatiSve(kategorija);

    alati.sort((a,b) => a.naziv.localeCompare(b.naziv));

    let html = `
<!DOCTYPE html>
<html lang="hr">
<head>
    <meta charset="UTF-8">
    <title>AI alati</title>
    <link rel="stylesheet" href="/dizajn/mbarnjak23.css">
</head>
<body>

    <div class="kartica">
        <h3>Popis AI alata</h3>

        <form class="forma-filtar" method="GET" action="/alati">
            <input type="text" name="kategorija" placeholder="Unesi kategoriju" value="${kategorija}">
            <button type="submit">Filtriraj</button>
        </form>

        <ol class="popis-alata">
`;

alati.forEach((alat, i) => {
    html += `
        <li>
            <strong>${alat.naziv}</strong> (${alat.godina}) - ${alat.kategorija}
            <a href="/alati/detalji?naziv=${encodeURIComponent(alat.naziv)}">Detalji</a>
            <form method="POST" action="/alati/ukloni" style="display:inline;">
                <input type="hidden" name="naziv" value="${alat.naziv}">
                <button type="submit" class="btn-ukloni">Ukloni</button>
            </form>
        </li>
    `;
});

html += `
        </ol>

        <p><a href="/index.html">Početna stranica</a></p>
    </div>
</body>
</html>
`;


    res.send(html);
    
});



server.get("/", (req, res) => {
    res.redirect("/index.html");
});

server.get("/index.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/index.html"));
});

server.get("/oAutoru.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/oAutoru.html"));
});

server.get("/dokumentacija.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/dokumentacija.html"));
});

server.get("/kontakt.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/ostalo/kontakt.html"));
});

server.get("/prijedlog_ai.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/ostalo/prijedlog_ai.html"));
});

server.get("/detalji.html", (req, res) => {
    res.sendFile(path.join(putanja, "html/ostalo/detalji.html"));
});

server.post("/alati/ukloni", (req,res) =>{
    const naziv = req.body.naziv;
    if(naziv){
        alat.ukloniPoNazivu(naziv);
    }
    res.redirect("/alati")
})



server.use("/JSklijent", express.static(path.join(putanja, "js/klijent")));
server.use("/dizajn", express.static(path.join(putanja, "css")));
server.use("/resursi", express.static(path.join(putanja, "resursi")));

server.use((req, res, next) =>{
    res.status(404).send(`
        <h1>Stranica ne postoji!</h1>
        <p><a href="index.html">Povratak na početnu stranicu</a></p>`)
})

server.listen(port, () => {
    console.log(`Server pokrenut na portu: ${port}`);
    console.log(__dirname)
});




