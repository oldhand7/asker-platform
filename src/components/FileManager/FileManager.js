import Table from 'rc-table';
import classNames from 'classnames';
import Link from 'next/link';
import TrashButton from 'components/TrashButton/TrashButton'
import { humanFileSize, isImage, } from 'libs/helper';
import NODATA from 'components/NODATA/NODATA';
import { useTranslation } from 'libs/translation';

import styles from './FileManager.module.scss';

const getColumns = ({ handleDelete, t }) => {

  return [
    {
      title: t('labels.preview'),
      render: (_, file) => {
        if (isImage(file.name)) {
          return <img alt="" width="2em" height="2em" className={styles['file-manager-thumb']} src={file.url} />
        } else {
          return <NODATA />;
        }
      }
    },
    {
      title: t('labels.name'),
      dataIndex: 'name',
      render: (name, file) => <Link href={file.url}>
        <a className={styles['file-manager-link']} target="_blank">{file.name}</a>
      </Link>
    },
    {
      title: t('labels.size'),
      dataIndex: 'size',
      render: (size) => humanFileSize(size)
    },
    {
      title: "#",
      render: (_, file) => {
        return <TrashButton type="button" onClick={() => handleDelete(file)} />
      }
    }
  ]
}

const FileManager = ({ className, files = [], onChange }) => {
  const { t } = useTranslation();

  const handleDelete = (file) => {
    if (confirm(t('actions.confirm'))) {
      onChange([
        ...files.filter(f => f != file)
      ])
    }
  }

  return <Table rowKey={(row, index) => `${row.name}${row.index}`} className={classNames(styles['file-manager'], className)} columns={getColumns({ handleDelete, t })} data={files} />
}

export default FileManager;
