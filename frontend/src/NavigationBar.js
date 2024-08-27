import React, {useEffect, useReducer, useRef, useState} from "react";
import {Button, Container, Modal, Nav, Navbar, NavDropdown} from "react-bootstrap";

function GeneralModal(props){

      return(
          <Modal theme={props.theme} className={'modal-theme'}
              {...props}
              size="lg"
              centered
          >
              <Modal.Header closeButton>
                  <Modal.Title>
                      {props.title}
                  </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  {props.bodyText}
              </Modal.Body>
          </Modal>
      );
}


function NavigationBar(params){
    const [state,action] = useReducer((state,action)=> {
        const objToSet = {show: !state.show}
        switch (action) {
            case 1: {objToSet.bodyText='Enter Code in "Code" TextArea, then click on "Run" Button, after compilation result of your Code be located in output field.';
                objToSet.title='How to Use'
            }
                break
            case 2: {
                objToSet.bodyText = 'Java 17 VM';
                objToSet.title = 'About Compiler'
            }
                break
            case 3: {
                objToSet.bodyText = <a href={'https://antonwhite.us'} target={'_blank'} className={'link'}>Click!</a>;
                objToSet.title = 'About Dev'
            }
        }
        return objToSet
    }, {show: false})

    return(
        <>
            <GeneralModal title={state.title} theme={params.currTheme} bodyText={state.bodyText} show={state.show} onHide={()=>{action()}}/>

        <Navbar expand="lg" className="navbar navbar-expand" bg={params.currTheme} data-bs-theme={params.currTheme}>
            <Container fluid>
                <Navbar.Brand>Online Java Compiler</Navbar.Brand>

                <Nav className="ms-auto">
                    <NavDropdown title="Help">
                        <NavDropdown.Item onClick={()=>{action(1)}}>How to Use</NavDropdown.Item>
                        <NavDropdown.Item onClick={()=>{action(2)}}>About Compiler</NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item onClick={()=>{action(3)}}>About Dev</NavDropdown.Item>
                    </NavDropdown>
                </Nav>

                <Button variant={params.currTheme === 'dark' ? 'light' : 'dark'} onClick={params.setTheme}>Change
                    Theme</Button>
            </Container>
        </Navbar>
        </>
    );
}
export default NavigationBar