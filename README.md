# Structure

| Codebase              |                 Description                  |
|:----------------------|:--------------------------------------------:|
| [jill](apps/jill)     | React Frontend (Hosted on: http://p-doc.com) |
| [trixie](apps/trixie) |                 Nest.js API                  |
| [types](libs/types)   |                Shared typings                |

## Pre Requirements
Create a [Firebase](https://firebase.google.com) project with enabled **Google Authentication** and **Storage bucket**

---

### [trixie:](apps/trixie)
1. Add `.development.env` file to the root of [trixie](apps/trixie) with following structure (without quotes):
   * `DATABASE_URL=`"Mongodb url"\
            `PORT`="5001"\
            `FB_BUCKET_URL`="Firebase storage bucket url"
2. Export **_service-account.json_** from [Firebase](https://firebase.google.com)
   1. Rename exported **_service-account.json_** to **_.development.fbsa.json_**
   2. Place **_.development.fbsa.json_** under [trixie](apps/trixie) root folder
 
---

### [jill:](apps/jill)
1. Add `.env.development` file to the root of [jill](apps/jill) with following structure (without quotes):
   * `REACT_APP_PRODUCTION=`"false"\
     `REACT_APP_API_URL=`"http://localhost:5001" \
     `REACT_APP_FIREBASE_CONFIG=`"JSON.stringify(firebaseWebAppConfig)"

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
