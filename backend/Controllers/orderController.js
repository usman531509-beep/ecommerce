import Order from "../models/Order.js";
import Product from "../models/Product.js"; // 💡 Product model import karna lazmi hai

// 1. Create Order (Status default "Pending" hota hai, stock yahan minus nahi hoga)
export const createOrder = async (req, res) => {
  try {
    const { customerInfo, orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!customerInfo?.name || !customerInfo?.phone) {
      return res.status(400).json({ message: "Name and phone are required." });
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
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("orderItems.product", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Status & Manage Stock 📦
export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body; // Frontend se "Processing" ya "Returned" wagera ayega

  const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status provided." });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const oldStatus = order.status;

    // --- 📉 STOCK DEDUCTION (Jab status "Processing" ho jaye) ---
    if (status === "Processing" && oldStatus !== "Processing") {
      // Step 1: Stock check karein
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (!product || product.stock < item.qty) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product?.name}. Available: ${product?.stock || 0}` 
          });
        }
      }
      // Step 2: Stock minus karein
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
      }
    }

    // --- 📈 STOCK RESTORE (Jab status "Returned" ho jaye) ---
    // Hum sirf tab stock wapis karenge agar wo pehle minus (Processing/Shipped/Delivered) ho chuka tha
    const wasProcessed = ["Processing", "Shipped", "Delivered"].includes(oldStatus);
    
    if (status === "Returned" && wasProcessed) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
      }
    }

    // Status save karein
    order.status = status;
    const updatedOrder = await order.save();
    
    res.json({ message: `Status updated to ${status}`, order: updatedOrder });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};