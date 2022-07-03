## Structure

| Codebase              |                 Description                  |
|:----------------------|:--------------------------------------------:|
| [jill](apps/jill)     | React Frontend (Hosted on: http://p-doc.com) |
| [trixie](apps/trixie) |                 Nest.js API                  |
| [types](libs/types)   |                Shared typings                |

## Run Locally (order is required)

### Pre Requirements
Create a [firebase](https://firebase.google.com) project with enabled **Google Authentication** and **Storage bucket**

---

### [types](libs/types)
Run project:
```bash
yarn types-start
```

---

### [trixie:](apps/trixie)
1. Add `.development.env` file to the root of [trixie](apps/trixie) with following structure (without quotes):
   * `DATABASE_URL=`"Mongodb url"\
            `PORT`="5001"\
            `FB_BUCKET_URL`="Firebase storage bucket url"
2. Run project:
```bash
yarn trixie-start
```
 
---

### [jill:](apps/jill)
1. Add `.env.development` file to the root of [jill](apps/jill) with following structure (without quotes):
   * `REACT_APP_PRODUCTION`="false"\
     `REACT_APP_API_URL`="http://localhost:5001" \
     `REACT_APP_FIREBASE_API_KEY`="Provided by firebase"\
     `REACT_APP_FIREBASE_AUTH_DOMAIN`="Provided by firebase"\
     `REACT_APP_FIREBASE_PROJECT_ID`="Provided by firebase"\
     `REACT_APP_FIREBASE_STORAGE_BUCKET`="Provided by firebase"\
     `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`="Provided by firebase"\
     `REACT_APP_FIREBASE_APP_ID`="Provided by firebase"\
     `REACT_APP_FIREBASE_MEASURMENT_ID1`="Provided by firebase""
2. Run project:
```bash
yarn jill-start
```
