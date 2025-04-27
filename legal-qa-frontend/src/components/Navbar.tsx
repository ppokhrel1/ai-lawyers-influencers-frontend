import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function Navigation() {
  const { user, logout } = useAuth()

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Legal QA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  <UserCircleIcon className="icon-small me-1" />
                  {user.username}
                </Navbar.Text>
                <Button variant="outline-light" onClick={logout}>
                  <ArrowRightOnRectangleIcon className="icon-small me-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
  			as={Link as any} // Temporary type assertion
			to="/login" 
  			variant="outline-light" 
  			className="me-2"
		>
	  		Login
		</Button>

		<Button 
  		as={Link as any} // Temporary type assertion
  		to="/register" 
  		variant="light"
		>
  		Register
		</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
