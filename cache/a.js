const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const https = require('https');
const {isAkun, isChannel} = require("./mt_ban.js");
// Enhanced name list with more variations
const names = [
  "AlvanoRix", "JendryMarel", "KairaNolyn", "FarelZantor", "ElvinaThorne",
  "ZekielMurn", "NaylaVirsa", "DeronAskiel", "TaniaGrell", "VandroLexa",
  "MarzellQuin", "RionaMyst", "JairoVen", "SalwaNereen", "KyzenDrell",
  "AlanaVirel", "BrenzoArkin", "MivyaLorne", "ZafirQuell", "LioraEnne",
  "DrestanKove", "KenzaAlvree", "MikoZein", "VeliaChantel", "RonanTrez",
  "YumnaClarine", "ZaydenArkhel", "AureliaSine", "FadrelMurne", "KeylaEnara",
  "DiorenVast", "ZalyaMiran", "RhezanKole", "MinzaYurell", "AxelVirex",
  "ZanetaBrill", "TyrelGant", "NadiraFyn", "LexanDree", "VeynaLoric"
];

// User-Agent rotation
const userAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
];

// Custom HTTPS agent to bypass some restrictions
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true
});

function getRandomName() {
  return names[Math.floor(Math.random() * names.length)];
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

async function sendTelegramSupportRequest(target) {
  try {
    const randomName = getRandomName();
    const randomEmail = `${randomName.toLowerCase()}${getRandomNumber(100, 999)}@gmail.com`;
    const randomPhone = `+1${getRandomNumber(1000000000, 9999999999)}`;
    const message = isAkun(target, randomName); // Updated to use the new function
    const userAgent = getRandomUserAgent();

    // Initial request with timeout
    const initialResponse = await axios.get('https://telegram.org/support', {
      params: { setln: 'id' },
      headers: { 'User-Agent': userAgent },
      httpsAgent,
      timeout: 10000
    });

    const cookies = initialResponse.headers['set-cookie'] || [];
    
    const form = new FormData();
    form.append('message', message);
    form.append('legal_name', randomName);
    form.append('email', randomEmail);
    form.append('phone', randomPhone);
    form.append('setln', 'id');

    const headers = {
      ...form.getHeaders(),
      'Cookie': cookies.join('; '),
      'Referer': 'https://telegram.org/support?setln=id',
      'User-Agent': userAgent,
      'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7'
    };

    console.log(`[+] Mengirim permintaan untuk target: ${target}`);
    console.log(`Nama: ${randomName}`);
    console.log(`Email: ${randomEmail}`);
    console.log(`Telepon: ${randomPhone}`);

    const response = await axios.post('https://telegram.org/support', form, {
      headers,
      httpsAgent,
      maxRedirects: 0,
      timeout: 60000,
      validateStatus: (status) => status < 500
    });

    // Enhanced success verification
    if (response.status === 200) {
      if (response.data.includes('Terima kasih') || 
          response.data.includes('Thank you') || 
          response.headers['content-length'] > 1000) {
        console.log('[✓] Pesan berhasil terkirim!');
      } else {
        console.log('[!] Respon 200 diterima tapi mungkin tidak valid');
      }
    } else {
      console.log(`[!] Respon tidak biasa: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error(`[X] Error: ${error.message}`);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// Main execution
(async () => {
  const target = process.argv[2] ? process.argv[2].replace(/[<>]/g, '') : null;
  if (!target) {
    console.error('Usage: node script.js <@target>');
    process.exit(1);
  }

  console.log(`[•] Memulai pengiriman untuk target: ${target}`);
  const success = await sendTelegramSupportRequest(target);
  
  if (success) {
    console.log('[✓] Proses selesai dengan indikasi sukses');
  } else {
    console.log('[X] Proses selesai dengan error');
  }
})();