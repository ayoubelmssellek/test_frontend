import { FiSend } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from './ContactUs.module.css';
import { FaArrowRight } from 'react-icons/fa';
import  Navbar  from '../navbar/Navbar';

 const ContactForm = () => {
  const navigate = useNavigate();

  return (
   <>
   <Navbar/>
    <div className={styles.container}>
      <form className={styles.form}>
        <div className={styles.header}>
          <h2 className={styles.title}>تواصل معنا</h2>
          <button dir="ltr" className={styles.backButton} onClick={() => navigate(-1)}>
            <FaArrowRight  className={styles.backIcon} />
                    رجوع
          </button>
        </div>
        
        <input 
          type="text" 
          placeholder="اسمك" 
          className={styles.input}
          required 
        />
        
        <input 
          type="text" 
          placeholder="البريد الإلكتروني أو رقم الهاتف" 
          className={styles.input}
          required 
        />
        
        <textarea 
          placeholder="رسالتك" 
          className={styles.textarea}
          rows="4"
          required
        ></textarea>
        
        <button 
          type="submit" 
          className={styles.submitButton}
        >
          <FiSend className={styles.sendIcon} />
          إرسال
        </button>
      </form>
    </div></>
  );
};
export default ContactForm;