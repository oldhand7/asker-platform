/*
Description: Normalizes project statistics names.
*/

import {
    createApiHandler as getHandler
  } from 'libs/nc';
  import {
    saveCollectionDocument,
    filterManyDocuments,
    filterSingleDocument
  } from 'libs/firestore-admin';
  const {
    Timestamp
  } = require('firebase-admin/firestore');
import path from 'path'
import { getStageKey } from 'libs/stage';

const MGIRATION_ID =  path.basename(__filename, '.js');
const MGIRATION_TARGET = 'templates';
const MIGRATION_CARD = {
  name: MGIRATION_ID,
  createdAt: Timestamp.fromDate(new Date())
}
  
  const handler = getHandler();
  
  const migrate = async () => {

    await filterManyDocuments(MGIRATION_TARGET)
      .then(async records => {
        await Promise.all(records.map(async record => {
            if (!record.stages) {
                return Promise.resolve();
            }

            record.stages = record.stages.map(s => {
                if (s.id != 'introduction' && s.id != 'summary') {
                    return s;
                }

                if (s.config && typeof s.config.html === "string") {
                    s.config = {
                        ...s.config,
                        html: {
                            en: s.config.html,
                            se: s.config.html
                        }
                    }
                }

                const stageId = getStageKey(s)

                record.config[stageId] = s.config;

                return s;
            })

          // End
          if (typeof record.createdAt === 'number') {
            record.createdAt = Timestamp.fromMillis(record.createdAt * 1000)
          }

          if (!record.migrations) {
            record.migrations = []
          }

          record.migrations.push(MGIRATION_ID)
  
          return saveCollectionDocument(MGIRATION_TARGET, record)
        }))
      })
  }
  
  handler.get(async (req, res) => {
    try {
      const migration = await filterSingleDocument('migrations', [['name', '==', MGIRATION_ID]])

      if (!migration) {
        await migrate()
      } else {
        throw new Error("Migration already exists.")
      }

      await saveCollectionDocument('migrations', MIGRATION_CARD)
  
      res.status(200).json({
        success: true
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  })
  
  export default handler;
  