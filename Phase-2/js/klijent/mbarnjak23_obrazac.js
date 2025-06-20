const obrazac = document.getElementById("obrazac1");

const regexIme = /^[A-ZČĆŽŠĐa-zčćžšđ\s'-]{2,50}$/;

const regexZnakovi = /^[A-ZČĆŽŠĐa-zčćžšđ0-9\s.,:;!?()"'%\-_/\\@=&\n]+$/;
const regexURL = /(http:\/\/|https:\/\/)[\w\-\.]+\.(hr|com|org)/;
const zabranjeniZnakovi = /[$€]/;
const regexBroj = /^\d+(\.\d{1,2})?$/;



obrazac.addEventListener("submit", function(e) {
let brojac=0;

  const ime = obrazac.querySelector('input[name="ime"]')
  const email = obrazac.querySelector('input[name="email"]')
  const telefon = obrazac.querySelector('input[name="telefon"]')
  const tema = obrazac.querySelector('select[name="tema"]')
  const poruka = obrazac.querySelector('textarea[name="poruka"]');
  const tekst = poruka.value.trim();
  const kolicina = obrazac.querySelector('input[name="kolicina"]');
  const vrijednost = kolicina.value.trim();


  if (ime.value.trim() === "" || !regexIme.test(ime.value.trim())) {
    brojac++;
    ime.style.border = "2px solid red";
    ime.style.backgroundColor = "#ffe6e6";
    e.preventDefault();
  }else{
    ime.style.border = "";
    ime.style.backgroundColor = "";
  }

  if (email.value.trim() === "") {
    brojac++;
    email.style.border = "2px solid red";
    email.style.backgroundColor = "#ffe6e6";
    e.preventDefault();
  }else{
    email.style.border ="";
    email.style.backgroundColor = "";
  }

  if (telefon.value.trim() === "") {
    brojac++;
    telefon.style.border = "2px solid red";
    telefon.style.backgroundColor = "#ffe6e6";
    e.preventDefault();
  }
  else{
    telefon.style.border = "";
    telefon.style.backgroundColor = "";
  }

  if(tema.value === "0"){
    brojac++;
    tema.style.border = "2px solid red";
    tema.style.backgroundColor = "#ffe6e6";
    e.preventDefault();
  }
  else{
    tema.style.border = "";
    tema.style.backgroundColor = "";
  }

  if (
    tekst.length < 200 ||
    tekst.length > 1000 ||
    !regexZnakovi.test(tekst) ||
    !regexURL.test(tekst) ||
    zabranjeniZnakovi.test(tekst)
  ) {
    brojac++;
    poruka.style.border = "2px solid red";
    poruka.style.backgroundColor = "#ffe6e6";
    e.preventDefault();
  } else {
    poruka.style.border = "";
    poruka.style.backgroundColor = "";
  }
  


if (vrijednost === ""  || !regexBroj.test(vrijednost)) {
  brojac++;
  kolicina.style.border = "2px solid red";
  kolicina.style.backgroundColor = "#ffe6e6";
  e.preventDefault();
} else {
  kolicina.style.border = "";
  kolicina.style.backgroundColor = "";
}

  if(brojac>0) alert("Neispravan unos");
 

});
