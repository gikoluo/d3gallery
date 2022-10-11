import React from 'react';
import ReactDOM from 'react-dom';
import Index from '../D3Models/Index';
import { createRoot } from 'react-dom/client'

function Home() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">D3 Models Excamples</div>
                        <div className="card-body"><Index /></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;

createRoot(document.getElementById('root')).render(
    <Home />
)


