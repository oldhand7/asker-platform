import { useState, useEffect } from "react";
import { getSingleDocument, saveCollectionDocument } from 'libs/firestore';

const cache = {}

export const useCompany = (id) => {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (id) {
      if (cache[id]) {
        setCompany(cache[id])
      } else {
        getSingleDocument('companies', id).then(company => {
          cache[id] = company
          setCompany(company)
        })
      }
    }
  }, [id])

  const handleUpdate = (data) => {
    if (!id) {
      return Promise.resolve(new Error('No company.'))
    }

    return saveCollectionDocument('companies', data)
      .then(() => {
        const updated = {
          ...company,
          ...data
        }

        cache[id] = updated

        setCompany(updated)
      })
  }

  return [company, handleUpdate];
}
