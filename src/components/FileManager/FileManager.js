import Table from 'rc-table';
import TrashIcon from 'components/Icon/TrashIcon';
import classNames from 'classnames';
import Link from 'next/link';
import TrashButton from 'components/TrashButton/TrashButton'
import { humanFileSize, isImage, } from 'libs/helper';
import NODATA from 'components/NODATA/NODATA';

import styles from './FileManager.module.scss';

const getColumns = ({ handleDelete }) => ([
  {
    title: 'Preview',
    key: 'preview',
    render: (_, file) => {
      if (isImage(file.name)) {
        return <img width="2em" height="2em" className={styles['file-manager-thumb']} src={file.url} />
      } else {
        return <NODATA />;
      }
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, file) => <Link href={file.url}>
      <a className={styles['file-manager-link']} target="_blank">{file.name}</a>
    </Link>
  },
  {
    title: 'Size',
    dataIndex: 'size',
    key: 'size',
    render: (size) => humanFileSize(size)
  },
  {
    title: "#",
    render: (_, file) => {
      return <TrashButton type="button" onClick={() => handleDelete(file)} />
    }
  }
])

const FileManager = ({ className, files = [], onChange }) => {
  const handleDelete = (file) => {
    //@TODO: remove from server
    if (confirm('Are you sure?')) {
      onChange([
        ...files.filter(f => f != file)
      ])
    }
  }

  return <Table rowKey={(row, index) => `${row.name}${row.index}`} className={classNames(styles['file-manager'], className)} columns={getColumns({ handleDelete })} data={files} />
}

export default FileManager;
