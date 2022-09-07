import { Link } from 'react-router-dom';
import { To } from 'history';

// material-ui
import { ButtonBase } from '@mui/material';
import { SxProps } from '@mui/system';
import Farmu from 'assets/images/icons/farmu.svg';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

const LogoSection = ({ sx, to }: Props) => (
  <ButtonBase disableRipple component={Link} to="/" sx={sx}>
    <img src={Farmu} alt="Farmu" style={{ width: 150 }} />
  </ButtonBase>
);

export default LogoSection;
