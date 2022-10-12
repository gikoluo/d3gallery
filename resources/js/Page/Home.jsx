import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../D3Models/Index';
import { createRoot } from 'react-dom/client'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';

function Home() {
    return (
        <Container>
            <Navbar bg="light">
                <Container>
                    <Navbar.Brand href="#home">D3 Models Demo</Navbar.Brand>
                </Container>
            </Navbar>
            <Index />
        </Container>
    );
}

export default Home;

createRoot(document.getElementById('root')).render(
    <Home />
)


