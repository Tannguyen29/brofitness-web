import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const SidebarContainer = styled.nav`
  width: 240px;
  height: 100vh;
  background-color: rgb(244, 246, 248);
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  color: #4285F4;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  padding: 0 20px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 30px;
`;

// const Avatar = styled.img`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   margin-right: 10px;
// `;

const Username = styled.span`
  font-size: 14px;
  font-weight: 500;
`;

const StyledNavLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #637381;
  text-decoration: none;
  margin: 4px 8px;
  font-size: 14px;
  border-radius: 8px;
  transition: background-color 0.3s;
  margin-bottom: 6px;
  padding: 12px;

  &.active {
    background-color: rgba(253, 99, 0, 0.1);
    color: #FD6300;
    padding: 12px;
  }

  &:hover{
    background-color: #f0f2f4;
  }

  svg {
    margin-right: 12px;
    font-size: 20px;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-right: 12px;
`;

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarContainer>
      <Logo>N.</Logo>
      <UserInfo>
        {/* <Avatar src="path_to_avatar_image.jpg" alt="User Avatar" /> */}
        <Username>Jaydon Frankie</Username>
      </UserInfo>
      <StyledNavLink to="/" className={location.pathname === "/" ? "active" : ""}>
        <IconWrapper>
          <TrendingUpIcon />
        </IconWrapper>
        Dashboard
      </StyledNavLink>
      <StyledNavLink to="/exercises" className={location.pathname === "/exercises" ? "active" : ""}>
        <IconWrapper>
          <FitnessCenterIcon />
        </IconWrapper>
        Exercises
      </StyledNavLink>
      <StyledNavLink to="/users" className={location.pathname === "/users" ? "active" : ""}>
        <IconWrapper>
          <PeopleIcon />
        </IconWrapper>
        Users
      </StyledNavLink>
    </SidebarContainer>
  );
};

export default Sidebar;