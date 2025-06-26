import Api from "../../Axios/Api";

// export const fetchUserOrders = async () => {
//     const token = localStorage.getItem('authToken');
  
//     const response = await fetch('/api/userOrders', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });
  
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const data = await response.json();
//     return data.orders;
//   };



export const fetchUserOrders = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await Api.get('/userOrders', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // غالباً response.data هي لي فيها البيانات،  
    // إذا السيرفر يرجع { orders: [...] } فترجع response.data.orders
    return response.data.orders || response.data;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
};




