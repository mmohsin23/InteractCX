const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
    const orderId = req.body.queryResult.parameters.OrderID;

    if (!orderId) {
        return res.json({
            fulfillmentText: 'I didn’t receive an order ID. Could you provide one, please?'
        });
    }
    console.log(orderId);
    try {
        const response = await axios.post('https://orderstatusapi-dot-organization-project-311520.uc.r.appspot.com/api/getOrderStatus', {
            orderId: orderId
        });

        const shipmentDate = response.data.shipmentDate;
        const formattedDate = new Date(shipmentDate).toDateString(); 


        res.json({
            fulfillmentText: `Your order will be shipped on ${formattedDate}.`
        });
    } catch (error) {
        res.json({
            fulfillmentText: `There was an error fetching the shipment status. Please try again.`,
            error
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
