# asker-platform

Notice there are 3 types of Firebase credentials:

- firebase-service-creds-production.json - company account (deployed automatically)
- firebase-service-creds-development.json - developers account (deploy functions manually)
- firebase-service-creds-testing.json - testing for cypress (deploy functions manually)

## Development and release

1. npm i
2. npm run dev
3. testing `npm run test`
4. push changes to main

Application should be autodeployed in ~10 minutes.

## Firebase functions

If you plan editing `./cloud-functions` log in into firebase-cli. Use `firebase use` to switch between production, development and testing environments. Upload functions using this command: `firebase deploy --only functions`
