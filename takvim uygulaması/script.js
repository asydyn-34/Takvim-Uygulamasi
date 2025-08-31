
let gecerliTarih = new Date(); 
let seciliHucre = null;        


const ayYilEl = document.getElementById("ayYil");
const takvimEl = document.getElementById("takvim");
const oncekiAyBtn = document.getElementById("oncekiAyBtn");
const sonrakiAyBtn = document.getElementById("sonrakiAyBtn");
const buguneGitBtn = document.getElementById("buguneGitBtn");
const tumNotlariSilBtn = document.getElementById("tumNotlariSilBtn");


const notPenceresi = document.getElementById("notPenceresi");
const notBaslik = document.getElementById("notBaslik");
const notMetni = document.getElementById("notMetni");
const notiKaydetBtn = document.getElementById("notiKaydetBtn");
const notiSilBtn = document.getElementById("notiSilBtn");


const ayAdlari = [
  "Ocak","Şubat","Mart","Nisan","Mayıs","Haziran",
  "Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"
];


const LS_KEY = "takvim_notlari_v1";


function notlariAl(){
  const raw = localStorage.getItem(LS_KEY);
  return raw ? JSON.parse(raw) : {};
}
function notlariKaydet(n){
  localStorage.setItem(LS_KEY, JSON.stringify(n));
}


function fmt(date){
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}


function takvimiCiz(){
  takvimEl.innerHTML = "";

  const yil = gecerliTarih.getFullYear();
  const ay = gecerliTarih.getMonth();

  ayYilEl.textContent = `${ayAdlari[ay]} ${yil}`;


  const ilkGun = new Date(yil, ay, 1);
  const sonGun = new Date(yil, ay + 1, 0);
  const toplamGun = sonGun.getDate();

  
  let ilkHaftaIndeksi = ilkGun.getDay(); 
  ilkHaftaIndeksi = (ilkHaftaIndeksi === 0) ? 6 : ilkHaftaIndeksi - 1;

  const oncekiAySonGun = new Date(yil, ay, 0).getDate();

  const notlar = notlariAl();

  for(let i=0; i<42; i++){
    const hucre = document.createElement("div");
    hucre.className = "gun";

    let gunNumarasi;
    let hucreTarihi;

    if (i < ilkHaftaIndeksi){
      
      gunNumarasi = oncekiAySonGun - (ilkHaftaIndeksi - 1 - i);
      hucre.classList.add("disAy");
      hucreTarihi = new Date(yil, ay - 1, gunNumarasi);
    } else if (i >= ilkHaftaIndeksi + toplamGun){
      
      gunNumarasi = i - (ilkHaftaIndeksi + toplamGun) + 1;
      hucre.classList.add("disAy");
      hucreTarihi = new Date(yil, ay + 1, gunNumarasi);
    } else {
      
      gunNumarasi = i - ilkHaftaIndeksi + 1;
      hucreTarihi = new Date(yil, ay, gunNumarasi);
    }

    const tarihYazi = document.createElement("div");
    tarihYazi.className = "tarih";
    tarihYazi.textContent = gunNumarasi;

    
    const bugun = new Date();
    if (fmt(hucreTarihi) === fmt(bugun) && hucre.classList.contains("disAy") === false){
      hucre.classList.add("bugun");
    }
    
    const ozet = document.createElement("div");
    ozet.className = "not-ozet";
    const key = fmt(hucreTarihi);
    if (notlar[key]){
      ozet.textContent = notlar[key].slice(0, 120);
    } else {
      ozet.textContent = "";
    }

    
    hucre.addEventListener("click", () => {
      seciliHucre = { tarih: new Date(hucreTarihi), key };
      notBaslik.textContent = `${key} için not`;
      notMetni.value = notlar[key] || "";
      notPenceresi.showModal();
    });

    hucre.appendChild(tarihYazi);
    hucre.appendChild(ozet);
    takvimEl.appendChild(hucre);
  }
}


oncekiAyBtn.addEventListener("click", () => {
  gecerliTarih.setMonth(gecerliTarih.getMonth() - 1);
  takvimiCiz();
});
sonrakiAyBtn.addEventListener("click", () => {
  gecerliTarih.setMonth(gecerliTarih.getMonth() + 1);
  takvimiCiz();
});
buguneGitBtn.addEventListener("click", () => {
  gecerliTarih = new Date();
  takvimiCiz();
});


tumNotlariSilBtn.addEventListener("click", () => {
  if (confirm("Tüm notlar silinsin mi? Bu işlem geri alınamaz.")){
    localStorage.removeItem(LS_KEY);
    takvimiCiz();
  }
});


notiKaydetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!seciliHucre) return;
  const notlar = notlariAl();
  const yazi = notMetni.value.trim();
  if (yazi){
    notlar[seciliHucre.key] = yazi;
  } else {
    delete notlar[seciliHucre.key];
  }
  notlariKaydet(notlar);
  notPenceresi.close();
  takvimiCiz();
});

notiSilBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!seciliHucre) return;
  const notlar = notlariAl();
  delete notlar[seciliHucre.key];
  notlariKaydet(notlar);
  notPenceresi.close();
  takvimiCiz();
});

takvimiCiz();
