import logo from './logo.svg';
import './App.css';
import React from 'react';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Tasks from './pages/tasks.jsx';
import AddTask from './pages/addTask.jsx';
import EditTask from './pages/editTask.jsx';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login></Login>}></Route>
        <Route path='/register' element={<Register></Register>}></Route>
        <Route path='/dashboard' element ={<Tasks></Tasks>}></Route>
        <Route path='/addTask' element={<AddTask></AddTask>}></Route>
        <Route path='/editTask/:id' element = {<EditTask></EditTask>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
