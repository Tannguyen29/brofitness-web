// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Admin/Navigation/Sidebar';
import Exercises from './components/Admin/Exercises/Exercises';
import Header from './components/Admin/Navigation/Header';
import User from './components/Admin/User/User';
import PlanList from './components/Admin/Plan/PlanList';
import Banner from './components/Admin/banner/BannerList'
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
  margin-left: 340px; // Match the width of the sidebar
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
            <Route path="/plans" element={<PlanList />} />
            <Route path="/banner" element={<Banner />} />
          </Routes>
        </ContentContainer>
      </AppContainer>
    </Router>
  );
}

export default App;