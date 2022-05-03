import Container from 'components/Container/Container';
import Content from 'components/Content/Content';

import styles from './blank-layout.module.scss';

const BlankLayout = ({ children }) => {
  return (
    <Container className={styles['layout-container']}>
      <Content>{children}</Content>
    </Container>
  )
}

export default BlankLayout;
