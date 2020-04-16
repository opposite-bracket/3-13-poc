import React from 'react';
import {
  Row,
  Col
} from 'react-bootstrap';

function CenterBox({children, className}) {

  return (
    <Row>
      <Col md={{ span: 6, offset: 2 }} className={className}>
        {children}
      </Col>
    </Row>
  );
}

export default CenterBox;
