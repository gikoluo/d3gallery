import React, { useEffect, useState, Suspense } from 'react';

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import CardGroup from 'react-bootstrap/CardGroup';
import { Cube, Bruno, SSR2, Envmap, Porsche911, Balls } from '../D3Models/Sample';
import moment from "moment";
import * as Icon from 'react-bootstrap-icons';


function ModelList(model) {
    const models = {
        "Cube": <Cube />,
        "Bruno": <Bruno />,
        "SSR2": <SSR2 />,
        "Envmap": <Envmap />,
        "Porsche911": <Porsche911 />,
        "Balls": <Balls />,
    };
    return models
}
function ModelHtml(props) {
    return ModelList()[props.model]
}


export default function Index() {

    const [d3models, setD3Models] = useState([])
    const [selectedD3Model, setSelectedD3Model] = useState({})

    const [isOpen, setIsOpen] = React.useState(false);
    const [title, setTitle] = React.useState("Demo...");
    const [description, setDescription] = React.useState("Demo...");

    const [body, setBody] = React.useState("Demo...");

    const isFullscreen = true

    useEffect(() => {
        fetchD3Models()
    }, [])

    const fetchD3Models = async () => {
        await axios.get(`/api/d3models`).then(({ data }) => {
            setD3Models(data)
        })
    }

    const showModal = () => {
        setIsOpen(true);
        document.body.style.backgroundColor = "white";
    };
    const hideModal = () => {
        setIsOpen(false);
    };

    const modalLoaded = () => {
        setTitle(selectedD3Model.name)
        setDescription(selectedD3Model.description)
    };

    return (
        <>
            <Modal show={isOpen} fullscreen={isFullscreen} onHide={hideModal} onEntered={modalLoaded}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ModelHtml model={selectedD3Model.html} />
                </Modal.Body>
                <Modal.Footer>
                    {description}
                </Modal.Footer>
            </Modal>

            <Row className="g-4">
                {/* <Col>
                    <Card >
                        <Card.Body>
                            <Card.Title>Sample</Card.Title>
                        </Card.Body>

                        <Balls />

                        <Card.Body>
                            <Card.Text>
                            Sample
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Created at: 00</small>
                        </Card.Footer>
                    </Card>
                    </Col> */}
                {
                    d3models.length > 0 && (
                        d3models.map((row, key) => (
                            <Col key={row.id} id={"d3model-" + row.id}>
                                <Card >
                                    <Card.Header>
                                        <Row>
                                            <Col xs="10">{row.name}</Col>
                                            <Col xs="2">
                                                <Button
                                                    size="sm"
                                                    className="float-end"
                                                    variant="link"
                                                    onClick={() => { setSelectedD3Model(row); showModal() }}>
                                                    <Icon.ArrowsFullscreen className="align-top" />
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Card.Header>
                                    <Card.Body>
                                        <ModelHtml model={row.html} />

                                    </Card.Body>

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
        </>
    )
}
