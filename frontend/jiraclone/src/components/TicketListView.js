import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Style from './styles/ticketlistview.module.css'
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Card from 'react-bootstrap/Card';


export function TicketListView({ id, description, assigned, completed, priority, story_points, project }) {

    if (project) {
        return (

            <Row>
                <Col xs={7}>Ticket {id} - {description}</Col>
                <Col>{completed ? "\u2713" : "X"}</Col>
                <Col xs={2}>{project}</Col>
                <Col>{priority}</Col>
                <Col>{story_points}</Col>
            </Row>

        )
    }

    if (assigned) {
        return (

            <Row className={Style.ticketBox}>
                <Col xs={7}>Ticket {id} - {description}</Col>
                <Col xs={2}>{assigned}</Col>
                <Col>{completed ? "\u2713" : "X"}</Col>
                <Col>{priority}</Col>
                <Col>{story_points}</Col>
            </Row>

        )
    }

    return (

        <Row className={Style.ticketBox}>
            <Col xs={9}>Ticket {id} - {description}</Col>
            <Col xs={1}>{completed ? "\u2713" : "X"}</Col>
            <Col xs={1}>{priority}</Col>
            <Col xs={1}>{story_points}</Col>
        </Row>



    )
}