import './App.css';
import Panel from "./components/Panel";
import Login from "./components/Login";
import Files from "./components/Files";
import ManageTeam from './components/ManageTeam';
import PrivateRoute from "./components/PrivateRoute";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/panel" element={<Panel/>}/>
          <Route path="/files" element={<Files/>}/>
          <Route path="/manage-team" element={<ManageTeam/>}/>
          {/* <Route path="/panel" element={<PrivateRoute/>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;