import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Add from './containers/Add';
import Home from './containers/Home';
import Search from './containers/Search';


function App() {
  return (
    <Router>
      <Routes>
        <Route exact element={<Home />} path={'/'} />
        <Route exact element={<Add />} path={'/add'} />
        <Route exact element={<Search />} path={'/search'} />
      </Routes>
    </Router>
  );
}

export default App;
