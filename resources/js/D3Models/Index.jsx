import React, { useEffect, useState, Suspense } from 'react';

import Button from 'react-bootstrap/Button'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import { Cube, Bruno, SSR2, Envmap, Porsche911 } from '../D3Models/Sample';
import moment from "moment";


function ModelList(model) {
    const models = {
        "Cube": <Cube />,
        "Bruno": <Bruno />,
        "SSR2": <SSR2 />,
        "Envmap": <Envmap />,
        "Porsche911": <Porsche911 />,
    };
    return models
}
function ModelHtml(props) {
    return ModelList()[props.model]
}

export default function Index() {

    const [d3models, setD3Models] = useState([])

    useEffect(()=>{
        fetchD3Models()
    },[])

    const fetchD3Models = async () => {
        await axios.get(`/api/d3models`).then(({data})=>{
            setD3Models(data)
        })
    }

    return (
        <Row className="g-4">
            {/* <Card key="sample">
                <Card.Body>
                    <Card.Title>Sample</Card.Title>
                </Card.Body>

                {/* <Cube />
                <Bruno />
                <SSR2 />
                <Envmap />
                <Porsche911 /> */}

                {/* <Card.Body>
                    <Card.Text>
                    Desc
                    </Card.Text>
                </Card.Body>
                <Card.Footer>
                    <small className="text-muted">Last updated 3 mins ago</small>
                </Card.Footer>
            </Card>  */}
        {
            d3models.length > 0 && (
                d3models.map((row, key)=>(
                    <Col key={row.id}>
                    <Card >
                        <Card.Body>
                            <Card.Title>{row.name}</Card.Title>
                        </Card.Body>

                        <ModelHtml model={row.html} />

                        <Card.Body>
                            <Card.Text>
                            {row.description}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Created at: {moment(row.created_at).format("MMMM Do YYYY")}</small>
                        </Card.Footer>
                    </Card>
                    </Col>
                ))
            )
        }
    </Row>   
  )
}
