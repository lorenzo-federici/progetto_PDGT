# Progetto PDGT di **Lorenzo Federici 278716**

## Introduzione
*Web server RESTfull* implementato in *nodeJS* che ha lo scopo di fornire operazioni riguardanti le *stazioni ferroviarie* in italia. Esso infatti può *visualizzarle*, *aggiungerne nuove*, *eliminarle* e *modificarle*; inoltre può anche trovare la stazione *più vicina* ad un determinato punto.

Il tutto supporta *l’autenticazione* degli utenti.

## Descrizione
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
In esso si è scelto di utilizzare due tabelle una per gli **Utenti** e l'altra per le varie **Stazioni**.

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
"nodemon":               "^2.0.2"

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
```
https://progetto-pdgt-federici.herokuapp.com/stations/view/all 
```
Visualizza tutte le stazioni.

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
```
https://progetto-pdgt-federici.herokuapp.com/stations/near/?lat=LATITUDINE&long=LONGITUDINE 
```
Visualizza la stazione piu vicina al punto dato. Richiede nell'header l'autenticazione tramite il *TOKEN*;

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
```
https://progetto-pdgt-federici.herokuapp.com/stations/view/name?prm=NOME_STAZIONE 
```
Visualizza la stazione con il nome ricercato. Richiede nell'header l'autenticazione tramite il *TOKEN*;

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
```
https://progetto-pdgt-federici.herokuapp.com/stations/view/province?prm=PROVINCIA_STAZIONE 
```
Visualizza tutte le stazioni nella provincia data. Richiede nell'header l'autenticazione tramite il *TOKEN*;
```
https://progetto-pdgt-federici.herokuapp.com/stations/view/region?prm=REGIONE_STAZIONE 
```
Visualizza tutte le stazioni nella regione data. Richiede nell'header l'autenticazione tramite il *TOKEN*;


**POST**
```
https://progetto-pdgt-federici.herokuapp.com/stations/ 
```
Aggiunge una nuova stazione. Il *body* dovra essere:

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
```
https://progetto-pdgt-federici.herokuapp.com/stations/ID_STAZIONE 
```
Elimina la stazione avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*, ed è riservato solo agli *admin* (ecco perchè per eliminare una stazione bisogna passare nell'url l'id, parametro che solo l'amministratore può visualizzare/sapere).

*es.di risposta*
```js
"message": "Station successfully deleted",
"request": {
    "decription": "To view ALL station",
    "type": "GET",
    "url": "https://progetto-pdgt-federici.herokuapp.com/stations/"
```

**PATCH**
```
https://progetto-pdgt-federici.herokuapp.com/stations/ID_STAZIONE 
```
Modifica una stazione avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*, ed è riservato solo agli *admin*. Il *body* dovra essere:

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
```
https://progetto-pdgt-federici.herokuapp.com/users/ 
```
Restuisce tutti gli utenti registrati. Richiede nell'header l'autenticazione tramite il *TOKEN*.

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
```
https://progetto-pdgt-federici.herokuapp.com/users/signup/ 
```
Serve per registrare un utente. Richiede nell'header l'autenticazione tramite il *TOKEN*. Il *body* dovra essere:

```js
"email":    "Email_utente_nuovo",
"password": "Password_utente_nuovo"
```

*es.di risposta*
```js
"message": "User Created"
```
```
https://progetto-pdgt-federici.herokuapp.com/users/login/
```
Serve per far loggare un utente. Richiede nell'header l'autenticazione tramite il *TOKEN*. Il *body* dovra essere:

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
```
https://progetto-pdgt-federici.herokuapp.com/users/ID_UTENTE 
```
Serve per eliminare un utente avente l'ID passato nell'url. Richiede nell'header l'autenticazione tramite il *TOKEN*.

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

### Bot Telegram 

Le operazioni tra admin e utente normale sono differenti:

ADMIN | USER
------------ | -------------
View Stations (con ID) | view Stations
Add Stations | Delete me
Update Stations | 
Delete Stations | 
View Users | 
View nearest Stations | View nearest Stations
Logout | Logout



![IMG_1484](https://user-images.githubusercontent.com/36625993/77826898-b1873680-7112-11ea-8a53-06ea98362871.PNG)



**USER**

*Operazioni dell'utente: *

![IMG_1485](https://user-images.githubusercontent.com/36625993/77826923-ebf0d380-7112-11ea-9724-915c33763989.PNG)

***View Stations***

![IMG_1488](https://user-images.githubusercontent.com/36625993/77826947-19d61800-7113-11ea-9aab-b65af22fb296.PNG)

*Tutte*

![IMG_1489](https://user-images.githubusercontent.com/36625993/77826965-35412300-7113-11ea-801f-05aae5583b36.PNG)

*Per Nome*

![IMG_1490](https://user-images.githubusercontent.com/36625993/77827039-b7314c00-7113-11ea-8a43-573526ebf3d9.PNG)

*Per Regione*

![IMG_1491](https://user-images.githubusercontent.com/36625993/77826982-4d18a700-7113-11ea-98ce-dbd30832332e.PNG)

*Per Provincia*

![IMG_1492](https://user-images.githubusercontent.com/36625993/77827043-bc8e9680-7113-11ea-9be6-8605e3016f53.PNG)

***View nearest Stations***
![IMG_1486](https://user-images.githubusercontent.com/36625993/77827054-d4661a80-7113-11ea-941d-f822c1a94eee.PNG)

![IMG_1487](https://user-images.githubusercontent.com/36625993/77827057-d6c87480-7113-11ea-81df-ed4a28d25c10.PNG)

![IMG_1493](https://user-images.githubusercontent.com/36625993/77827061-daf49200-7113-11ea-8b58-7a42a43779d5.PNG)

***Delete me***

![IMG_1496](https://user-images.githubusercontent.com/36625993/77827089-f8296080-7113-11ea-8125-618a4d06e854.PNG)

**ADMIN**

*Operazioni dell'amministratore: *

![IMG_1497](https://user-images.githubusercontent.com/36625993/77827093-fbbce780-7113-11ea-9c03-b0f7441cc9b4.PNG)

***View Stations***

![IMG_1499](https://user-images.githubusercontent.com/36625993/77827111-1727f280-7114-11ea-9cc8-93b2c6d12567.PNG)

La differenza con l'utente normale è che sarà visualizzato anche l'ID, questo perchè l'amministratore potrà anche modificare, aggiungere e eliminare le stazioni. 

***View Users***

![IMG_1500](https://user-images.githubusercontent.com/36625993/77827115-1a22e300-7114-11ea-9751-c5689e2fe56b.PNG)

***Add Stations***
![IMG_1501](https://user-images.githubusercontent.com/36625993/77827361-70445600-7115-11ea-82db-32ad12066691.PNG)
![IMG_1509](https://user-images.githubusercontent.com/36625993/77827359-6de1fc00-7115-11ea-801f-6ec21e32710d.jpg)

***Update Stations***

Quando si sceglierà questa opzione il bot chiederà le opzioni che l'utente vorrà aggiornare.

![IMG_1504](https://user-images.githubusercontent.com/36625993/77827188-843b8800-7114-11ea-9047-aebd647902b0.PNG)

Una volta scritto le opzioni da aggiornare bisognerà scrivere L'ID della stazione da aggiornare seguita dalle informazioni aggiornate, separate da uno spazio.
Molto macchinoso , questo perchè i bot telegram non supportano le form, ma è un operazione che soltanto un amministratore può fare. Uno sviluppo futuro potrebbe essere che nel momento in cui l'amministratore sceglie l'opzione di aggiornare una stazione sarà reindirizzato ad una pagina web con una form di modifica delle stazioni. 

![IMG_1505](https://user-images.githubusercontent.com/36625993/77827191-87cf0f00-7114-11ea-90e4-f05d33f95e7e.PNG)

![IMG_1506](https://user-images.githubusercontent.com/36625993/77827207-99b0b200-7114-11ea-8a61-a0256c3208bd.PNG)
Come possiamo vedere se chiediamo al bot di cercarci la stazione aggiornata esso la trovera.

***Delete Stations***

![IMG_E6997C451B37-1](https://user-images.githubusercontent.com/36625993/77827249-d5e41280-7114-11ea-821d-7efdd41e0b00.jpeg)

![IMG_1507](https://user-images.githubusercontent.com/36625993/77827264-e2686b00-7114-11ea-8969-2de4dff455c4.PNG)
Come possiamo vedere se chiediamo al bot di cercarci la stazione eliminata non riuscirà a trovarla.








