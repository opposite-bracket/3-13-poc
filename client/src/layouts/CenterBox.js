import React from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';

function CenterBox({children}) {

  return (
    <Row>
      <Col md={{ span: 4, offset: 4 }}>
        {children}
      </Col>
    </Row>
  );
}

export default CenterBox;
