import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import fetchNewOrders from '../../Api/fetchingData/FetchNewOrders';
import doordash from '../assets/doordash.mp3'

const OrderNotifier = () => {
  const audioRef = useRef(null);
  const lastPlayedRef = useRef(false);

  // إنشاء العنصر الصوتي مرة وحدة
  useEffect(() => {
    audioRef.current = new Audio(doordash);
  }, []);

  const { data } = useQuery({
    queryKey: ['new-orders'],
    queryFn: fetchNewOrders,
   refetchInterval: 5000 ,
    enabled: true,
  });

  

  useEffect(() => {
    if (data?.hasNewOrder && !lastPlayedRef.current) {
      audioRef.current?.play();
      lastPlayedRef.current = true;
    }

    if (!data?.hasNewOrder) {
      lastPlayedRef.current = false;
    }
  }, [data]);

  return null;
};

export default OrderNotifier;
