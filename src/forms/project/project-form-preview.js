import ProjectForm from './project-form';
import {DbContext} from 'libs/db';
import { UserContext } from 'libs/user';

const dummyData = {
    users: [
        { id: 'u1', name: 'User 1' }
    ]
}

const ProjectFormPreview = () => {
    const dbApi = {
        filterMany: (c) => {
            if (dummyData[c]) {
                return Promise.resolve(dummyData[c])
            } else {
                throw new Error("TEST DATA MISSING")
            }
        },
        save: () => alert('saves')
    }
    return <DbContext.Provider value={dbApi}>
        <UserContext.Provider value={{user: dummyData.users[0]}}>
            <ProjectForm test={1} />
        </UserContext.Provider></DbContext.Provider>
}

export default ProjectFormPreview;