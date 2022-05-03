import Navbar from 'components/Navbar/Navbar';
import Footer from 'components/Footer/Footer';
import Container from 'components/Container/Container';
import Content from 'components/Content/Content';

import styles from './default-layout.module.scss';

const DefaultLayout = ({ children }) => {
  return (
    <Container className={styles['layout-container']}>
      <Navbar />
      <Content>{children}</Content>
      <Footer />
    </Container>
  )
}

export default DefaultLayout;
