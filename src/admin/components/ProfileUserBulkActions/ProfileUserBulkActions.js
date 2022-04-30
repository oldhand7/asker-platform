import { BulkDeleteButton } from 'react-admin';

const ProfileUserBulkActions = (props) => (
    <>
        <BulkDeleteButton undoable={false} {...props} />
    </>
);

export default ProfileUserBulkActions;
