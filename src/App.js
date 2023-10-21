import './App.css';
import Panel from "./components/Panel";
import Login from "./components/Login";
import Dashboard from "./components/Files";
import ManageTeam from './components/ManageTeamDashboard';
import Users from './components/Users';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/panel" element={<Panel/>}/>
          <Route path="/files" element={<Dashboard/>}/>
          <Route path="/manage-team" element={<ManageTeam/>}/>
          <Route path="/users" element={<Users/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;