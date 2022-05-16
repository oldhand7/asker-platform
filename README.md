# asker-platform

Important!

There are three versions of this project.

https://console.firebase.google.com/project/asker-3e929/ - production
https://console.firebase.google.com/project/asker-dev/ - development
https://console.firebase.google.com/project/asker-test-98028/ - testing

If you don't have access ask to be added.

If you have just cloned this repository for the first time your goal should be to connect to development server first and create yourself a user.

1. Create 3 files and fill their contents

.env.production.local
.env.development.local
.env.testing

SMTP_USER=
SMTP_PASS=
SMTP_HOST=localhost
SMTP_PORT=8025
FIREBASE_SERVICE_KEY=(key form firebase)
SESSION_SECRET=(random 32 character string)
NEXT_PUBLIC_LANDING_PAGE_URL=https://www.askertech.com/

2. Start dev server

`npm i`
`npm run dev`

This loads firebase-service-creds-development.json and .env.development.local

Go to http://localhost:3000/admin/ and create yourself a company and a user.

Use credentials to login http://localhost:3000/login/

3. Before publishing

`npm run test`

WARNING: this has many deletions, but should only affect asker-test

You can also run `npm run jest` and `npm run build` and `npm run start` to be extra sure everything is working.

4. Commit changes to `main` and push

Changes are auto-deployed. See link below

https://console.cloud.google.com/cloud-build/builds?referrer=search&project=asker-3e929&pli=1

## Firebase functions

Test functions in development environment, but don't forget to later copy them to both production and testing environments.

Install firebase-cli. Use `firebase use` to switch between production, development and testing environments. Upload functions using this command: `firebase deploy --only functions`

## Firestore and firestorage rules

Test rules in development environment, but don't forget to later copy them to both production and testing environments.

## One more thing...

If your build fails or some file is not uploaded see `.dockerignore`
