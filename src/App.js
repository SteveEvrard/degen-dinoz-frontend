import title from './degendinoz-copy.png'
import './App.css';
import MintButton from './components/MintButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E2933D',
      contrastText: '#fff',
    }
  }
})

const App = () =>{
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
          <header className="App-header">
            <img src={title} className="App-logo" alt="logo" />
          </header>
          <MintButton/>
      </ThemeProvider>
    </div>
  );
}

export default App;
