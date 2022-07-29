import {
    Toolbar,
    SaveButton,
    Button,
    DeleteWithConfirmButton,
    CommentIcon,
    useStyles,
    useRecordContext
} from 'react-admin';
import { useRouter } from 'next/router'
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import styles from './ProfileUserToolbar.module.scss';

const ProfileUserToolbar = ({ handleSubmitWithRedirect, showDelete = true, ...props}) => {
  const router = useRouter()
  const record = useRecordContext();

  return <Toolbar {...props} className={styles['profile-user-toolbar']}>
    <div className={styles['profile-user-toolbar-buttons']}>
      <Button size='medium' onClick={() => router.back()} label="Back" variant="outlined">
        <ArrowBackIcon />
      </Button>
      <SaveButton handleSubmitWithRedirect={handleSubmitWithRedirect} redirect="list" submitonenter={true} />
    </div>
    {showDelete ?
    <DeleteWithConfirmButton confirmTitle={`Are you sure?`} confirmContent={`Delete user ${record.name}`} /> : null}
</Toolbar>
}

export default ProfileUserToolbar;
