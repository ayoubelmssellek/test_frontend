import './Footer.css'
import { FaInstagram } from "react-icons/fa";
import { BsWhatsapp } from "react-icons/bs";
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
  <footer>
  <div className="social-icons">
    {/* <i  aria-hidden="true"><FaInstagram size={40}  /></i>
    <i  aria-hidden="true"> <BsWhatsapp size={40} /></i> */}
  </div>


  <div className="links">
    <a href="#">About Us</a>
    <Link to={'/ContactUs'}>Contact Us</Link>
  </div>

  <hr />

  <div className="copyright">
    &copy; 2025 Restaurant Dakhla. All Rights Reserved.
  </div>
</footer>

  )
}

export default Footer
