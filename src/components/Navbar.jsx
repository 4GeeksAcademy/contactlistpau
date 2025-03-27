import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/" className="navbar-brand mb-0 h1">
					Contact List App
				</Link>
				<div className="ml-auto">
					<Link to="/add-contact" className="btn btn-primary">
						Add New Contact
					</Link>
				</div>
			</div>
		</nav>
	);
};