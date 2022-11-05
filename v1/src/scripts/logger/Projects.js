const winston = require('winston');

// winston ile file(dosya) olusturulacak. bunu yapmamızın sebebi logger'ı bu dosyalara basacağız(models'de basılacak burda sadece file'lar olusturuldu)
// bu alttaki logger yapısını winston documanından kopyala yapıstırık yaptık ve eklemeler yaptık üstüne.
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'project-service' },
    transports: [
        // altta yollar belirledik, burada logs diye dosya açıp logları kaydedecek.(logu bastırma işlemi loglama yapılacak yerde olacak.)
      new winston.transports.File({ filename: 'v1/src/logs/projects/error.log', level: 'error' }), // error.log'u olusturacağımız yolu seçtik: v1/src/logs/projects/error.log
      new winston.transports.File({ filename: 'v1/src/logs/projects/info.log', level: 'info' }), 
      new winston.transports.File({ filename: 'v1/src/logs/projects/combined.log' }), // lvl belirtmeyip combined yaparsak log'ların hepsini birleştirir
      
    ],
  });


  module.exports = logger;


