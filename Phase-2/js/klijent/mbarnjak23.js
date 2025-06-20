const lijeva = document.querySelector('#lijeva');
const desna = document.querySelector('#desna');

const slajdovi = document.querySelectorAll('.slajd');

let trenutni = 0;
let ukupno = slajdovi.length;

function pokaziSlajd(index) {
    slajdovi.forEach((slajd, i) => {
        if (trenutni == i) {
            slajd.style.display = 'block';
        } else {
            slajd.style.display = 'none';
        }
    })
}

let interval = setInterval(() => {
    trenutni++;
    if (trenutni >= ukupno) trenutni = 0;
    pokaziSlajd(trenutni);
}, 5000);

function resetirajInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
        trenutni++;
        if (trenutni >= ukupno) trenutni = 0;
        pokaziSlajd(trenutni);
    }, 5000);
}


pokaziSlajd(trenutni);

if(desna && lijeva ){

desna.addEventListener('click', () => {
    trenutni++;
    if (trenutni >= ukupno) trenutni = 0;
    pokaziSlajd(trenutni);
    resetirajInterval()
})

lijeva.addEventListener('click', () => {
    trenutni--;
    if (trenutni < ukupno) trenutni = slajdovi.length - 1;
    pokaziSlajd(trenutni);
    resetirajInterval()
})

}
    const slike = document.querySelectorAll("#galerija img");
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const zatvori = document.getElementById("zatvori");
  
    slike.forEach(slika => {
      slika.addEventListener("click", () => {
        lightboxImg.src = slika.src;
        lightbox.style.display = "flex";
      });
    });
  
    if(zatvori && lightbox){
    zatvori.addEventListener("click", () => {
      lightbox.style.display = "none";
    });
  
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.style.display = "none";
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        lightbox.style.display = "none";
      }
    });
}


    const paragrafi = document.querySelectorAll(".tekst-alata p");
  
    paragrafi.forEach(paragraf => {
      const puniTekst = paragraf.textContent.trim();
      const rijeci = puniTekst.split(" ");
  
      if (rijeci.length <= 6) return;
  
      const skraceniTekst = rijeci.slice(0, 6).join(" ") + ' <span class="prosiri">...</span>';
      paragraf.innerHTML = skraceniTekst;
  
      const klikni = paragraf.querySelector(".prosiri");
  
      klikni.addEventListener("click", function (s) {
        paragraf.textContent = puniTekst;
      });
    });

  

  const aktivne = document.querySelectorAll(".navigacija a");
  const trenutna = window.location.pathname;

  for(aktiv of aktivne){

    if(aktiv.href.endsWith(trenutna)){
      aktiv.style.color = "#0e6ba8"
      aktiv.style.textDecoration = "underline"
    }
  }

