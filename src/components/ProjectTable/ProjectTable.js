import Table from 'rc-table';
import classNames from 'classnames';
import Stager from 'components/Stager/Stager';
import ProjectTableStatCell from 'components/ProjectTableStatCell/ProjectTableStatCell';

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
    key: 'template'
  },
  {
    title: 'Interviewer name',
    dataIndex: 'interviewer',
    key: 'interviewer'
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
    title: "Status",
    dataIndex: "candidates",
    key: "candidates",
    render: (candidates, project) => {
      return <ProjectTableStatCell project={project} />
    }
  }

];

import demoProjects from 'data/demo/projects.json';

const ProjectTable = ({ className, data = demoProjects }) => {
  return <Table rowKey={row => row.id} className={classNames(
    styles['project-table'],
    className
  )} columns={columns} data={data} />
}

export default ProjectTable;
