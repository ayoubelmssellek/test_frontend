import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import i18n from 'i18next';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from 'qrcode.react';
import { useParams } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
import { fetchOrderById } from '../../Api/fetchingData/FetchOrderById';
import { FileText } from 'lucide-react';

import style from './ViewOrderDetails.module.css';

const ViewOrderDetails = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrderById(id),
  });

  const invoiceRef = useRef();

  const exportInvoice = () => {
    const invoiceElement = invoiceRef.current;

    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [imgWidth, imgHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Invoice_${order.id}.pdf`);
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading order details</div>;

  return (
    <div className={style['content']} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Sidebar isOpen={isOpen} onSidebarStateChange={setIsOpen} />
      <div className={`${style['main-content']} ${isOpen ? style['shifted'] : style['inshiftd']}`}>
        <Navbar pagePath={t('order_information')} />

        <div className={style['actions']}>
          <button className={style['export-button']} onClick={exportInvoice}>
            <FileText className="icon" size={30} />
            <span>Export</span>
          </button>
        </div>

        <div className={style['container2']}>
          <div className={style['order-details']}>
            <p><strong>{t('order_id')}:</strong> {order?.order_number}</p>
            <p><strong>{t('name')}:</strong> {order?.name}</p>
            <p><strong>{t('phone_number')}:</strong> {order?.phonenumber}</p>
            <p><strong>{t('order_date')}:</strong> {order?.created_at}</p>
            <p><strong>{t('street')}:</strong> {order?.street}</p>
            <p><strong>{t('house_number')}:</strong> {order?.housenumber}</p>

            <h2>{t('order_items')}</h2>
            <div className={style['items']}>
              {order?.items?.map((item, i) => (
                <div key={i} className={style['item']}>
                  <img src={`${import.meta.env.VITE_API_IMG_BASE_URL}/${item.image_path}`} alt={item.name} />
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.total_price / item.quantity} {t('dirham')} x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <h3 className={style['total']}>{t('total_price')}: {order.total_order} {t('dirham')}</h3>
          </div>

          <div className={style['invoice']} ref={invoiceRef}>
            <div style={{ textAlign: 'center' }}>
              <h2 className={style['store-title']}>Restaurant Fast Food</h2>
              <p>TEL : 0640606282</p>
            </div>
            <div className={style['invoice-info']}>
              <p><strong>Order No:</strong> #{order.order_number}</p>
              <p><strong>Order Time:</strong> {order.created_at}</p>
            </div>
            <table className={style['invoice-table']}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity || 1}</td>
                    <td>{item.total_price / item.quantity}</td>
                    <td>{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h3 className={style['grand-total']}>TOTAL TTC: {order.total_order} {t('dirham')}</h3>
            <div className={style['invoice-footer']}>
              <hr className={style['line']} />
              <p>Merci pour votre achat</p>
              <QRCodeCanvas value="https://www.hespress.com/" size={100} />
              <p>Scan to visit our website</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
