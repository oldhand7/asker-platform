
import Button from './Button';
import MailIcon from './assets/icons/mdi_email-fast-outline.svg';
import Icon from 'components/Icon/Icon';

const GetInTouchButton = ({ text='Get in Touch', href = '#', className }) => {
  return <Button href={href} className={className}>
    <span>{text}</span>
    <Icon icon={<MailIcon />} />
  </Button>
}

export default GetInTouchButton;
