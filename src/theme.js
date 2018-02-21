import { createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#757575',
      contrastText: '#000',
    },
    text: '#ffffff'
  },
});

export default theme;
