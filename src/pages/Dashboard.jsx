import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Chat from '../components/Chat';
import Poll from '../components/Poll';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4">Welcome to the Dashboard</h1>
          <p className="mb-4">You are logged in as: {currentUser.email}</p>
          <Button onClick={handleLogout} variant="danger">Log Out</Button>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6}>
          <Chat />
        </Col>
        <Col md={6}>
          <Poll />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;