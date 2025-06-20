const fs = require("fs");
const path = require("path");


const putanjaCSV = path.join(__dirname, "../../resursi/alati.csv");

function dohvatiSve(kategorija){

    let podaci = fs.readFileSync(putanjaCSV, "utf-8").trim().split("\n");

    
    let alati = podaci
    .map(red => red.trim())
    .filter(red => red.split(";").length === 5)
    .map(red => {
        const [naziv, opis, kategorijaAlata, url, godina] = red.split(";");
        return {
        naziv: naziv.trim(),
        opis: opis.trim(),
        kategorija: kategorijaAlata.trim(),
        url: url.trim(),
        godina: godina.trim()
        };
    });

        if(kategorija && kategorija.trim() !== ""){
            const trazena = kategorija.toLowerCase();
            alati = alati.filter(alat => 
                alat.kategorija.toLowerCase() === trazena
            );
        }

        return alati;
}

function dohvatiPoNazivu(naziv){
    const sviRedovi = fs.readFileSync(putanjaCSV,"utf-8").trim().split("\n");

    for(let red of sviRedovi){
        const [nazivAlata, opis, kategorija, url, godina] = red.split(";").map(el=>el.trim());
        if(nazivAlata.toLowerCase() === naziv.toLowerCase()){
            return { naziv: nazivAlata, opis, kategorija, url, godina };
        }
    }

    return null;
}

function ukloniPoNazivu(naziv){
    const sviRedovi = fs.readFileSync(putanjaCSV, "utf-8").trim().split("\n");

    const noviRedovi = sviRedovi.filter(red => {
        const [nazivAlata] = red.split(";");
        return nazivAlata.trim().toLowerCase() !== naziv.trim().toLowerCase();
    });

    const uspjeh = sviRedovi.length !== noviRedovi.length;

    fs.writeFileSync(putanjaCSV, noviRedovi.join("\n"), "utf-8");
    return uspjeh; 
}


function dodajNovi(alatObjekt){
    const red = [
        alatObjekt.naziv,
        alatObjekt.opis,
        alatObjekt.kategorija,
        alatObjekt.url,
        alatObjekt.godina
    ].map(el => el.trim()).join(";");

    fs.appendFileSync(putanjaCSV, `\n${red}`, "utf-8")
}

function dodaj(alat) {
    const red = `${alat.naziv};${alat.opis};${alat.kategorija};${alat.url};${alat.godina}`;

    try {
        const postoji = fs.existsSync(putanjaCSV);
        const dodatak = postoji ? `\n${red}` : red;
        fs.appendFileSync(putanjaCSV, dodatak, "utf8");
        return true;
    } catch (err) {
        console.error("Greška pri pisanju u CSV:", err.stack);
        
        return false;
    }
}

function azurirajPostojeci(stariNaziv, noviObjekt) {
    const sviRedovi = fs.readFileSync(putanjaCSV, "utf-8").trim().split("\n");

    let azurirano = false;

    const noviRedovi = sviRedovi.map(red => {
        const [naziv] = red.split(";");
        if (naziv.trim().toLowerCase() === stariNaziv.trim().toLowerCase()) {
            azurirano = true;
            return `${noviObjekt.naziv};${noviObjekt.opis};${noviObjekt.kategorija};${noviObjekt.url};${noviObjekt.godina}`;
        }
        return red;
    });

    if (azurirano) {
        fs.writeFileSync(putanjaCSV, noviRedovi.join("\n"), "utf-8");
    }

    return azurirano;
}


module.exports = { 
    dohvatiSve,
    dohvatiPoNazivu,
    ukloniPoNazivu, 
    dodajNovi,
    dodaj,
    azurirajPostojeci
};