import { getPages } from 'libs/firestore';
import { i18n } from 'libs/config';
import { getApp } from 'libs/firebase-admin'
const { getFirestore } = require('firebase-admin/firestore');

import nc from 'next-connect';

const handler = nc();

const page2route = (routes, page) => {
  for (let i = 0; i < i18n.locales.length; i++) {
    if (page.name) {
      const locale = i18n.locales[i];

      if (page.name[locale]) {
        const route = `/${locale}/${page.name[locale]}/`;
        routes[route] = page.template != 'index' ? page.template : ''
      }
    }
  }

  return routes;
}

handler.get(async (req, res) => {
  const db = await getFirestore(getApp());
  const pages = await getPages(db);

  res.json({
    ...pages.reduce(page2route, {}),
    '/en/test/': 'contact'
  })
})

export default handler;
