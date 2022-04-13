import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';
import { useRouter } from 'next/router';

import styles from './ProjectTable.module.scss';

const columns = [
  {
    title: 'Project name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Template name',
    dataIndex: 'template',
    key: 'template',
    render: (template) => template || '-'
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
      return <Stager stages={stages} />
    }
  },
  {
    title: "Interview status",
    render: (candidates, project) => {
      return <ProjectTableStatCell project={project} />
    }
  }
];

import demoProjects from 'data/demo/projects.json';

const ProjectTable = ({ className, data = demoProjects, ...props }) => {
  const router = useRouter()

  const rowHandler = record => {
    return {
      onClick: () => {
        router.push(`/projects/${record.id}`)
      }
    }
  }

  return <Table onRow={rowHandler} rowKey={row => row.id} className={classNames(
    styles['project-table'],
    className
  )} columns={columns} data={data} {...props} />
}

export default ProjectTable;
