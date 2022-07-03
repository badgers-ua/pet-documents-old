# Structure

| Codebase              |                 Description                  |
|:----------------------|:--------------------------------------------:|
| [jill](apps/jill)     | React Frontend (Hosted on: http://p-doc.com) |
| [trixie](apps/trixie) |                 Nest.js API                  |
| [types](libs/types)   |                Shared typings                |

## Pre Requirements
Create a [firebase](https://firebase.google.com) project with enabled **Google Authentication** and **Storage bucket**

---

### [trixie:](apps/trixie)
1. Add `.development.env` file to the root of [trixie](apps/trixie) with following structure (without quotes):
   * `DATABASE_URL=`"Mongodb url"\
            `PORT`="5001"\
            `FB_BUCKET_URL`="Firebase storage bucket url"
 
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

## Run Locally
```bash
yarn run start
```

## Steps to add _app_ or _lib_ to monorepo
1. Must be a typescript project
2. Application should be created under [apps](./apps) folder
3. Shared library should be created under [libs](./libs) folder
4. Update [README.ME](./README.md) _**Structure**_ section with newly created project
5. Following fields of `package.json` should be:
```bash
{
  "name": "@pdoc/your-project-name",
  "private": true,
  "scripts": {
    "build": "...",
    "start": "..."
  }
}
```
6. If you created a _lib_ please update [tsconfig.libs.json](./libs/tsconfig.libs.json) to include your new lib
7. If you created an _app_ please add following line to newly created apps `tsconfig.json`:
```bash
"extends": "/libs/tsconfig.libs.json"
```
