import './App.css';
import Login from "./components/Login";
import ManageInvites from "./components/ManageInvites";
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
          <Route path="/invites" element={<ManageInvites/>}/>
          <Route path="/manage-team" element={<ManageTeam/>}/>
          <Route path="/users" element={<Users/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;