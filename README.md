# Leonardo_Team_Onion

## Tecnologie utilizate

### Builds -> Docker-compose

Abbiamo creato l'ambiente di lavoro utilizzando docker-compose per costruire le immagini relative al backend, al frontend ed al database.
- Backend:
  - Port:
    - 8080:8080
  - Volumes:
    - ./backend:/usr/src/backend
    - ./backend/logs:/usr/src/backend/logs
    - /usr/src/backend/node_modules
  - networks:
    - eventify-network
  - depends-on:
    - postgres

- Frontend:
  - Port:
    - 4200:4200
  - Volumes:
    - ./frontend:/usr/src/frontend
    - /usr/src/frontend/node_modules
  - networks:
    - frontend
    - eventify-network
  - depends_on:
    - postgres
    - backend

- Postgres
  - Ports:
    - 5432:5432
  - Volumes:
    - db:/var/lib/postgresql/data
  - networks:
    - eventify-network

### Backend -> spring boot

Per Spring-Boot abbiamo deciso di intraprendere un approccio tradizionale, implementando i paccheti starter-security e starter-web. Da qua abbiamo cominciato a sviluppare il server per gestire le chiamate API e i rapporti client/server e server/database. Abbiamo abilitato il CORS, in maniera da accettare le richiste API provenienti solamente dall'indirizzo indicato da noi. La password dell'utente viene salvata nel database criptata, e quando un utente prova ad accedere, prendiamo la password inserita, la criptiamo utilizzando la stessa chiave e la confrontiamo con quella salvata. Se la password coincide, l'utente viene autorizzato. Da questo punto possiamo procedere in diverse direzioni. Inizialmente, autorizzavamo l'utente creando un JWT che veniva restituito e poi successivamente richiesto per ogni chiamata API effettuata dall'utente tramite gli headers della richiesta HTTP. In un secondo momento invece abbiamo preferito optare per scambiare il JWT tramite un http-only cookie, in maniera da evitare di salvare il token all'interno del database e da evitare attacchi di tipo XSS. Per l'autenticazione tramite Google oauth invece, abbiamo seguito la procedura descritta da Google. Prima inviamo una richiesta all endpoint google.com/o/oauth2/v2/auth, a cui passiamo il codice cliente della nostra app registrata su Google API. L'utente viene rediretto su una pagina in cui deve accettare di autenticarsi tramite Google. Quest'ultimo ci restituisce un code, il quale utilizzeremo per ottenere il token necessario per ottenere le informazioni dello user, mandando una richiesta all'endpoint oauth2.googleapis.com/token. Ottenute le informazioni, salviamo l'utente nel database per rendere persistenti i suoi cambiamenti, e restituiamo un JWT da passare come http-only cookie, utilizzando la stessa logica che abbiamo utilizzato per un user registrato normalmente.

### Frontend -> Angular

Per Angual abbiamo costruito i componenti necessari per rendere la nostra webapp responsive, impostanto dei range di definizioni in base alle quali modellare la visualizzazione delle nostra pagine. Ogni richiesta API fatta al server deve contenere l'header 'Access-Control-Allow-Credentials', in maniera da passare insieme alla richiesta il nostro http-only cookie. Se l'utente ha cominciato una sessione, autenticandosi ed ottenendo il cookie, quando accede alla webapp verra' reindirizzato automaticamente alla pagina di admin. Se invece lo user prova ad accedere ad un endpoint successivo all autenticazione senza aver prima ottenuto il cookie, verra' reindirizzato alla home. Lo user puo' creare venti, fare l'upload di immagini, cambiare il proprio avatar, sottoscriversi agli eventi e filtrarli in base a criteri selezionabili. Ogni evento puo' essere reindirizzato ad un suo endpoint specifico, in maniera da rendere possibile la sua condivisione, passando l'id dell'evento come query string, e facendo una richiesta al database il quale restituira' l'evento. In caso di esito negativo, lo user verra' reindirizzato alla pagina di admin e, se non presente il cookie di sessione, ulteriormente alla home. All'interno dell'endpoint dell'evento inoltre e' presenta una chat minimale, cosi' da permettere agli utenti di scambiarsi informazioni riguardanti l'evento. Ogni evento ovviamente ha la sua chat. Una campanella di notifiche avverte qualora la scadenza di un evento a cui lo user si e' registrato sia inferiore a 24h

### Database -> Postgresql

All'interno del database abbiamo creato 2 tabelle, una per gli user ed una per gli eventi. Le query al database vengono fatte tramite JPA, un modulo di spring boot che permette di automatizzare le queli definendo semplicemente i metodi. Sostanzialmente, ogni volta che un utente si registra viene create lo user all'interno del database, che viene restituito al momento dell autenticazione tramite login. L'utente puo' aggiornare la propria immagine profilo fornendone una, tutte le immagini vengono salvate all'interno del server, e rese accessibili tramite la trasformazione del path del file in un endpoint. Ogni avatar caricato sovrascrive il precedente, e per semplicita' viene salvato col nome della mail piu' l'estensione. Ogni volta che viene creato un evento, invece, viene creata anche una cartella di riferimento chiamata come l'id dell'evento a cui si riferisce, dove vengono salvate le immagine caricate relative all'evento, passando per uan cartella temporanea nel caso in cui l'utente decidesse di rimuoverle. Inoltre, il server esegue una routine in cui controlla periodicamente gli eventi all'interno del database, eliminandoli nel caso in cui siamo scaduti. Questa routine si occupa anche di inviare le notifiche a tutti gli utenti che hanno sottoscritto ad un evento per informarlo della scua scadenza o modifica.
