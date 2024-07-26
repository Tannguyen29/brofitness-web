// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Navigation/Sidebar';
import Exercises from './components/Exercises/Exercises';
import Header from './components/Navigation/Header';
import User from './components/User/User';
import styled, { createGlobalStyle } from 'styled-components';

// Tạo một global style
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: rgb(244, 246, 248);
  }
`;

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: rgb(244, 246, 248);
`;

const ContentContainer = styled.div`
  margin-left: 400px; // Match the width of the sidebar
  padding: 64px 20px 20px; // Add top padding to account for the fixed header
  flex-grow: 1;
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <AppContainer>
        <Sidebar />
        <ContentContainer>
        <Header/>
          <Routes>
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/users" element={<User />} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;