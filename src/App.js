import './App.css';
import Panel from "./components/Panel";
import Login from "./components/Login";
import Files from "./components/Files";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}>
          </Route>
          <Route path="/panel" element={<Panel/>}>
          </Route>
          <Route path="/files" element={<Files/>}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;