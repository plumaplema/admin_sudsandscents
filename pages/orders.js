import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { styled, Box } from "@mui/material";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  return (
    <Layout>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          overflow: "hidden",
          margin: "3rem 1rem",
        }}
      >
        <DrawerHeader />
        <h1>Orders</h1>
        <table className="basic">
          <thead>
            <tr>
              <th>Date</th>
              <th>Paid</th>
              <th>Recipient</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 &&
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td
                    className={order.paid ? "text-green-600" : "text-red-600"}
                  >
                    {order.paid ? "YES" : "NO"}
                  </td>
                  <td>
                    {order.name} {order.email}
                    <br />
                    {order.city} {order.postalCode} {order.country}
                    <br />
                    {order.streetAddress}
                  </td>
                  <td>
                    {order.line_items.map((l) => (
                      <>
                        {l.price_data?.product_data.name} x{l.quantity}
                        <br />
                      </>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Box>
    </Layout>
  );
}
