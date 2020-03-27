# Progetto PDGT di **Lorenzo Federici 278716**

## Introduzione
*Web server RESTfull* implementanto in *nodeJS* che ha lo scopo di fornire operazioni riguardanti le *stazioni ferroviarie* in italia. Esso infatti può *visualizzarle*, *aggiungerne nuove*, *eliminarle* e *modificarle*; inoltre può anche trovare la stazione *più vicina* ad un determinato punto.

Il tutto supporta *l’autenticazione* degli utenti.

## Desrizione
Il linguaggio utilizzato sia a lato server che a lato client è nodeJS che offre una vasta gamma di moduli per semplificare l'approccio web.
I *moduli* utilizzati a lato server sono: 

```js

"axios":        "^0.19.2",
"bcrypt":       "^4.0.1",
"body-parser":  "^1.19.0",
"express":      "^4.17.1",
"geolib":       "^3.2.1",
"jsonwebtoken": "^8.5.1",
"mongoose":     "^5.9.5",
"morgan":       "^1.9.1",
"nodemon":      "^2.0.2"

```
-**axios**: esso permette le Promise based HTTP request
```bash
npm install axios --save
```
-**bcrypt**: set di funzioni per la cifratura e decifratura di una password 
```bash
npm install bcrypt --save
```
-**express**: framework per applicazioni Web. E' flessibile e minimale, offre un set robusto di funzionalità per applicazioni Web e mobili.
```bash
npm install express --save
```
-**geolib**: modulo utilizzato per calcolare la distanza tra dua punti geografici utilizzando Latitudine e Longitudine
```bash
npm install geolib --save
```
-**jsonwebtoken**: set di funzioni per utilizzare i token di accesso un volta essersi loggati
```bash
npm install jsonwebtoken --save
```
-**mongoose**: permette l'accesso a MongoDB, manipolare e visualizzare i dati all'interno di esso.
```bash
npm install mongoose --save
```
-**Moduli generici**:
**body-parser**,
**morgan**,
**nodemon**
```bash
npm install --save body-parser morgan nodemon
```

Si è scelto l'utilizzo di mongoDB come databese base, molto piu semplice, veloce ed intuitivo dei databese di concorrenza basati sul linguaggio SQL.
In esso si è scelto di utilizzare due tabelle una per gli **Utenti** e laltra per le varie **Stazioni**.

**Tabella Utente**
```js
_id:        mongoose.Schema.Types.ObjectId,

email:    { type:     String, 
            required: true, 
            unique:   true, 
            match:    emailValidation},  //utilizzato per vedere se l'email aggiunto è valido   e  
                                           derivabile ad uno vero

password: { type:     String, 
            required: true}
```
**Tabella Stazioni**
```js
_id:                mongoose.Schema.Types.ObjectId,

Comune:           { type:     String,
                    required: true },

Provincia:        { type:     String, 
                    required: true },

Regione:          { type:     String, 
                    required: true },

Nome:             { type:     String, 
                    required: true },

Anno_inserimento: { type:     Number, 
                    required: true },

Data_inserimento: { type:     String, 
                    required: true },

ID_OpenStreetMap: { type:     Number, 
                    required: true , 
                    default:  0},

Longitudine:      { type:     Number, 
                    required: true },

Latitudine:       { type:     Number, 
                    required: true }
```

Per il *deploy* del server si è utilizzato il servizio web **Heroku**, ricavando cosi l'**URL** dell **APP**:

https://progetto-pdgt-federici.herokuapp.com

Riguardo il lato *client* si è scelto di implementarlo in un *bot telegram*, questo perchè è uno dei tipi di client piu semplici e intuitivi per visualizzare/manipolare i dati ricavati dalle API.
i moduli utilizzati sono: 
```js

"axios":                 "^0.19.2",
"dotenv":                "^8.2.0",
"node-telegram-bot-api": "^0.40.0",
"nodemon":               "^2.0.2",

```
[BotTelegramGit](https://github.com/BillyPap3/botTelegram_PDGT)



## Dati & Servizi esterni
### Dati
I dati, riguardanti le posizioni delle stazioni, utilizzati sono ricavati dal sito [DatiOpen](http://www.datiopen.it/it/opendata/Mappa_delle_stazioni_ferroviarie_in_Italia)

### Servizi esterni
All'interno dell'app si fa uso delle *API* pubbliche messe a disposizione da [Geocode](https://geocode.xyz/api) che permetterà il reverse-geocoding di una posizione e ricavare cosi da latitudine e longitudine la regione riguardante.

## Documentazione API

### Stazioni:
**GET**

https://progetto-pdgt-federici.herokuapp.com/stations/view/all : Visualizza tutte le stazioni.

*es.di risposta*
```js
"count": 27,
"stations": [
    {
        "Nome": "Piazzola",
        "Comune": "BIBBIANO",
        "Provincia": "REGGIO EMILIA",
        "Regione": "Emilia-Romagna",
        "Longitudine": 10.4508005,
        "Latitudine": 44.6443396,
        "_id": "5e6f9f9da509220612ef49e5",
        "request": {
            "description": "To view this station",
            "type": "GET",
            "url": "https://progetto-pdgt-federici.herokuapp.com/stations/id?prm=5e6f9f9da509220612ef49e5"
        }
    },
    {
        "Nome": "Barco",
        "Comune": "BIBBIANO",
        "Provincia": "REGGIO EMILIA",
        "Regione": "Emilia-Romagna",
        "Longitudine": 10.493069,
        "Latitudine": 44.6904224999999,
        "_id": "5e6f9f9da509220612ef49e4",
        "request": {
            "description": "To view this station",
            "type": "GET",
            "url": "https://progetto-pdgt-federici.herokuapp.com/stations/id?prm=5e6f9f9da509220612ef49e4"
        }
    },
    ...
]
```

https://progetto-pdgt-federici.herokuapp.com/stations/near/?lat=LATITUDINE&long=LONGITUDINE : Visualizza la stazione piu vicina al punto dato. Richiede nell'header l'autenticazione tramite il *TOKEN*;

*es.di risposta*
```js
//https://progetto-pdgt-federici.herokuapp.com/stations/near/?lat=43.71693&long=12.9825

"Nome": "Marotta-Mondolfo",
"Comune": "MONDOLFO",
"Provincia": "PU",
"Regione": "Marche",
"Longitudine": 13.1372509,
"Latitudine": 43.7697173,
"_id": "5e6f9fbfa509220612ef49fa",
"request": {
    "description": "To view this station",
    "type": "GET",
    "url": "https://progetto-pdgt-federici.herokuapp.com/stations/5e6f9fbfa509220612ef49fa"
},
"Distanza": "13.763 km"

```

https://progetto-pdgt-federici.herokuapp.com/stations/view/name?prm=NOME_STAZIONE : Visualizza la stazione con il nome ricercato. Richiede nell'header l'autenticazione tramite il *TOKEN*;

*es.di risposta*
```js
//https://progetto-pdgt-federici.herokuapp.com/stations/view/name?prm=pesaro
"count": 1,
"stations": [
    {
        "Nome": "Pesaro",
        "Comune": "PESARO",
        "Provincia": "PESARO E URBINO",
        "Regione": "Marche",
        "Longitudine": 12.9040376,
        "Latitudine": 43.9061694,
        "_id": "5e6f9fbfa509220612ef49fc",
        "request": {
            "description": "To view this station",
            "type": "GET",
            "url": "https://progetto-pdgt-federici.herokuapp.com/stations/id?prm=5e6f9fbfa509220612ef49fc"
        }
    }
]

```

https://progetto-pdgt-federici.herokuapp.com/stations/view/province?prm=PROVINCIA_STAZIONE : Visualizza tutte le stazioni nella provincia data. Richiede nell'header l'autenticazione tramite il *TOKEN*;

https://progetto-pdgt-federici.herokuapp.com/stations/view/region?prm=REGIONE_STAZIONE : Visualizza tutte le stazioni nella regione data. Richiede nell'header l'autenticazione tramite il *TOKEN*;


**POST**

https://progetto-pdgt-federici.herokuapp.com/stations/ : aggiunge una nuova stazione. Il *body* dovra essere:

```js

//_id:                aggiunto in automatico
"Comune":           "Comune_stazione_nuova",
"Provincia":        "Provincia_stazione_nuova",
"Regione":          "Regione_stazione_nuova",
"Nome":             "Nome_stazione_nuova",    
//"Anno_inserimento": aggiunto in automatico
//"Data_inserimento": aggiunto in automatico
"ID_OpenStreetMap": "ID_OpenStreetMap_stazione_nuova", //se non messo è di default 0
"Longitudine":      "Longitudine_stazione_nuova",
"Latitudine":       "Latitudine_stazione_nuova" 
```
Richiede nell'header l'autenticazione tramite il *TOKEN*;

*es.di risposta*
```js
"message": "Station added successfully",
"addedStation": {
    "Comune": "FANO",
    "Provincia": "PESARO E URBINO",
    "Regione": "Marche",
    "Nome": "Fano",
    "Anno_inserimento": 2020,
    "Data_inserimento": "Fri Mar 27 2020 21:31:25 GMT+0000 (Coordinated Universal Time)",
    "ID_OpenStreetMap": 0,
    "Longitudine": 13.01063,
    "Latitudine": 43.8255,
    "_id": "5e7e70ad228720002447ce54"
},
"request": {
    "description": "To view it",
    "type": "GET",
    "url": "https://progetto-pdgt-federici.herokuapp.com/stations/5e7e70ad228720002447ce54"
}

```

**DELETE**

https://progetto-pdgt-federici.herokuapp.com/stations/ID_STAZIONE : elimina la stazione avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*, ed è riservato solo agli *admin* (ecco perchè per eliminare una stazione bisogna passare nell'url l'id, parametro che solo l'amministratore può visualizzare/sapere).

*es.di risposta*
```js
"message": "Station successfully deleted",
"request": {
    "decription": "To view ALL station",
    "type": "GET",
    "url": "https://progetto-pdgt-federici.herokuapp.com/stations/"
```

**PATCH**
https://progetto-pdgt-federici.herokuapp.com/stations/ID_STAZIONE : modifica una stazione avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*, ed è riservato solo agli *admin*. Il *body* dovra essere:

```js
"Comune":           "Comune_stazione_aggiornato",
"Provincia":        "Provincia_stazione_aggiornato",
"Regione":          "Regione_stazione_aggiornato",
"Nome":             "Nome_stazione_aggiornato",  
"ID_OpenStreetMap": "ID_OpenStreetMap_stazione_aggiornato",
"Longitudine":      "Longitudine_stazione_aggiornato",
"Latitudine":       "Latitudine_stazione_aggiornato" 
```
Se si vuol cambiare soltanto un campo allora sara necessario immettere solo quel campo nella richiesta.

### Utenti

**GET**
https://progetto-pdgt-federici.herokuapp.com/users/ : restuisce tutti gli utenti registrati. Richiede nell'header l'autenticazione tramite il *TOKEN*.

*es.di risposta*
```js
"count": 17,
"user": [
    {
        "email": "test1@test.com"
    },
    {
        "email": "test2@test.com"
    },
    {
        "email": "test3@test.com"
    },
    {
        "email": "admin@sts.it"
    }
    ...
]
```

**POST**
https://progetto-pdgt-federici.herokuapp.com/users/signup/ : serve per registrare un utente. Richiede nell'header l'autenticazione tramite il *TOKEN*. Il *body* dovra essere:

```js
"email":    "Email_utente_nuovo",
"password": "Password_utente_nuovo"
```

*es.di risposta*
```js
"message": "User Created"
```

https://progetto-pdgt-federici.herokuapp.com/users/login/ : serve per far loggare un utente. Richiede nell'header l'autenticazione tramite il *TOKEN*. Il *body* dovra essere:

```js
"email":    "Email_utente_esistente",
"password": "Password_utente_esistente"
```

*es.di risposta*
```js
"message":  "Auth successful",
"token":    "tkn.exmpl.tkn",
"_id":      "id_exmpl"
```

**DELETE**
https://progetto-pdgt-federici.herokuapp.com/users/ID_UTENTE : serve per eliminare un utente avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*.

*es.di risposta*
```js
"message":          "User successfully deleted",
"request": {
    "descriprion":  "To Signup",
    "type":         "POST",
    "body":         { "email":   "String", 
                        "password": "Number" },
    "url":          "http://localhost:3000/users/signup"
}
```

## Esempi d'uso








