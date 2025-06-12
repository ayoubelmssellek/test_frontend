import PropTypes from "prop-types";
import './Modal.css'; // Create this CSS file for styling

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {children}

            </div>
        </div>
    );
};

export default Modal;
Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.element.isRequired
  };