import { useMemo, createContext, useContext } from "react";
import { filterManyDocuments, saveCollectionDocument } from "libs/firestore";
import { uploadCompanyFile } from 'libs/firestorage';

export const DbContext = createContext();

export const withDocumentsApi = (WrappedComponent) => {
    const withDocumentsApi = (props) => {
        const documentsApi = useMemo(() => ({
            filterMany: filterManyDocuments,
            save: saveCollectionDocument,
            uploadCompanyFile
        }), [])

        return (
            <DbContext.Provider value={documentsApi}>
                <WrappedComponent {...props} />
            </DbContext.Provider>
        );
    };
  
    return withDocumentsApi;
  };

  export const useDocumentsApi = () => {
    return useContext(DbContext);
  }
  