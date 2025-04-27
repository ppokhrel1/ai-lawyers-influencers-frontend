import { Form, Button, Card, Alert } from 'react-bootstrap';
import React from 'react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export default function AuthForm({ type }: AuthFormProps) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h2 className="text-center mb-4">
          {type === 'login' ? 'Login' : 'Register'}
        </h2>
        <Form>
          {type === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" />
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email" />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" />
          </Form.Group>
          {type === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Confirm password" />
            </Form.Group>
          )}
          <Button variant="primary" type="submit" className="w-100">
            {type === 'login' ? 'Login' : 'Register'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}


