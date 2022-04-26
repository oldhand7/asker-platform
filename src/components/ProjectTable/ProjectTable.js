import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';
import NODATA from 'components/NODATA/NODATA';
import FilterIcon from 'components/Icon/FilterIcon';
import CompactMenu from 'components/CompactMenu/CompactMenu';

import styles from './ProjectTable.module.scss';

const getColumns = ({ handleCompactMenuChoice }) => ([
  {
    title: 'Project name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Template name',
    dataIndex: 'template',
    key: 'template',
    render: (template) => (template && template.name) || <NODATA />
  },
  {
    title: 'Interviewer name',
    dataIndex: 'interviewers',
    key: 'interviewers',
    render: (interviewers) => {
      return <div>
        {interviewers.map(i => <p key={i.id}>{i.name}</p>)}
      </div>
    }
  },
  {
    title: 'Interview stages',
    dataIndex: 'stages',
    key: 'stages',
    render: (stages) => {
      return <Stager className={styles['project-table-stager']} stages={stages} />
    }
  },
  {
    title: "Interview status",
    render: (candidates, project) => {
      return <ProjectTableStatCell project={project} />
    }
  },
  {
    title: <FilterIcon />,
    render: (_, row) => <CompactMenu options={[
      { id: 'overview', name: 'Interviews' },
      { id: 'edit', name: 'Edit' }
    ]} onChoice={c => handleCompactMenuChoice(c, row)} />
  }
]);

import demoProjects from 'data/demo/projects.json';

const ProjectTable = ({ className, data = demoProjects, ...props }) => {
  const router = useRouter()

  const handleCompactMenuChoice = (c, row) => {
    if (c.id == 'edit') {
      router.push(`/projects/${row.id}/edit/`)
    }

    if (c.id == 'overview') {
      router.push(`/projects/${row.id}/overview/`)
    }
  }

  return <Table rowKey={row => row.id} className={classNames(
    styles['project-table'],
    className
  )} columns={getColumns({ handleCompactMenuChoice })} data={data} {...props} />
}

export default ProjectTable;
