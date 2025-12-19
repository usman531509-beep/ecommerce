import Order from "../models/Order.js";

//Create new order (guest)
export const createOrder = async (req, res) => {
  try {
  
    const { customerInfo, orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    
    if (!customerInfo?.name || !customerInfo?.phone) {
      return res.status(400).json({ message: "Name and phone are required in customer info." });
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items." });
    }

   
    const order = new Order({
      customerInfo,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Admin - Get all orders
export const getAllOrders = async (req, res) => {
  try {
  
    const orders = await Order.find().populate("orderItems.product", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id; 
  const { status } = req.body; 

  // 💡 FIX 1: Add "Returned" to the list of valid statuses
  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"]; 
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    order.status = status;

   
    // ⚠️ NOTE: `deliveredAt` field is not defined in your Order model.
    // If you need it, please add it to the schema. Removing the logic here to prevent runtime errors.
    /* if (status === 'Delivered' && !order.deliveredAt) {
      order.deliveredAt = Date.now();
    }
    */
    
  
    const updatedOrder = await order.save();
    res.json(updatedOrder);

  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ message: error.message });
  }
};