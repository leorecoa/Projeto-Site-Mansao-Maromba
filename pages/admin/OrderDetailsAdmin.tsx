import React, { useState } from 'react';
import {
    ChevronLeft,
    Printer,
    Truck,
    CreditCard,
    User,
    MapPin,
    Package,
    Mail,
    Phone,
    Download,
    CheckCircle,
    AlertCircle,
    Clock
} from 'lucide-react';

// --- Types ---

type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';

interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

interface OrderItem {
    id: string;
    productName: string;
    sku: string;
    price: number;
    quantity: number;
    image: string;
}

interface OrderDetails {
    id: string;
    date: string;
    status: OrderStatus;
    paymentMethod: string;
    paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
    customer: {
        name: string;
        email: string;
        phone: string;
        avatar: string;
    };
    shippingAddress: Address;
    billingAddress: Address;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
}

// --- Mock Data ---

const mockOrder: OrderDetails = {
    id: '#ORD-7782',
    date: 'Oct 24, 2023 at 4:30 PM',
    status: 'Processing',
    paymentMethod: 'Visa ending in 4242',
    paymentStatus: 'Paid',
    customer: {
        name: 'Alice Freeman',
        email: 'alice.freeman@example.com',
        phone: '+1 (555) 123-4567',
        avatar: 'AF',
    },
    shippingAddress: {
        street: '123 Maple Avenue, Apt 4B',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        country: 'USA',
    },
    billingAddress: {
        street: '123 Maple Avenue, Apt 4B',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        country: 'USA',
    },
    items: [
        {
            id: '1',
            productName: 'Premium Wireless Headphones',
            sku: 'WH-1000XM4',
            price: 299.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80',
        },
        {
            id: '2',
            productName: 'Ergonomic Mouse Pad',
            sku: 'EMP-2023',
            price: 25.50,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=100&q=80',
        },
    ],
    subtotal: 350.00,
    shippingCost: 15.00,
    tax: 28.00,
    total: 393.00,
};

// --- Components ---

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const styles = {
        Processing: 'bg-blue-100 text-blue-700 border-blue-200',
        Shipped: 'bg-purple-100 text-purple-700 border-purple-200',
        Delivered: 'bg-green-100 text-green-700 border-green-200',
        Cancelled: 'bg-red-100 text-red-700 border-red-200',
        Refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    const icons = {
        Processing: <Clock className="w-3 h-3 mr-1" />,
        Shipped: <Truck className="w-3 h-3 mr-1" />,
        Delivered: <CheckCircle className="w-3 h-3 mr-1" />,
        Cancelled: <AlertCircle className="w-3 h-3 mr-1" />,
        Refunded: <AlertCircle className="w-3 h-3 mr-1" />,
    };

    return (
        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
            {icons[status]}
            {status}
        </span>
    );
};

export default function OrderDetailsAdmin() {
    const [currentStatus, setCurrentStatus] = useState<OrderStatus>(mockOrder.status);

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-10">

            {/* Top Navigation / Breadcrumbs */}
            <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <button className="p-2 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Orders</span>
                                <span>/</span>
                                <span>Details</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                Order {mockOrder.id}
                                <StatusBadge status={currentStatus} />
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={currentStatus}
                            onChange={(e) => setCurrentStatus(e.target.value as OrderStatus)}
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border bg-white shadow-sm"
                        >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Printer className="w-4 h-4 mr-2" />
                            Print
                        </button>
                        <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <Download className="w-4 h-4 mr-2" />
                            Invoice
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Order Items & Timeline */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Order Items Card */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <Package className="w-5 h-5 text-gray-500" />
                                    Order Items
                                    <span className="bg-gray-200 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                        {mockOrder.items.length}
                                    </span>
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {mockOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-12 w-12 flex-shrink-0 rounded-md border border-gray-200 overflow-hidden">
                                                            <img className="h-full w-full object-cover" src={item.image} alt={item.productName} />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                                            <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Order Summary Footer */}
                            <div className="bg-gray-50 px-6 py-6 border-t border-gray-200">
                                <div className="flex flex-col items-end space-y-2">
                                    <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${mockOrder.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                                        <span>Shipping</span>
                                        <span>${mockOrder.shippingCost.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between w-full sm:w-64 text-sm text-gray-600">
                                        <span>Tax</span>
                                        <span>${mockOrder.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 w-full sm:w-64 my-2"></div>
                                    <div className="flex justify-between w-full sm:w-64 text-base font-bold text-gray-900">
                                        <span>Total</span>
                                        <span>${mockOrder.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Transaction Card */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                Payment Details
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white rounded border border-gray-200">
                                        <CreditCard className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{mockOrder.paymentMethod}</p>
                                        <p className="text-xs text-gray-500">Payment ID: #PAY-8832-XJ</p>
                                    </div>
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {mockOrder.paymentStatus}
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Customer & Address Info */}
                    <div className="space-y-6">

                        {/* Customer Card */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-500" />
                                    Customer
                                </h3>
                                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">View Profile</button>
                            </div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                                    {mockOrder.customer.avatar}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900">{mockOrder.customer.name}</h4>
                                    <p className="text-xs text-gray-500">Customer since 2021</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${mockOrder.customer.email}`} className="hover:text-indigo-600 transition-colors">
                                        {mockOrder.customer.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <span>{mockOrder.customer.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-gray-500" />
                                Shipping Address
                            </h3>
                            <address className="not-italic text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{mockOrder.customer.name}</p>
                                <p>{mockOrder.shippingAddress.street}</p>
                                <p>{mockOrder.shippingAddress.city}, {mockOrder.shippingAddress.state} {mockOrder.shippingAddress.zip}</p>
                                <p>{mockOrder.shippingAddress.country}</p>
                            </address>
                        </div>

                        {/* Billing Address */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                Billing Address
                            </h3>
                            <address className="not-italic text-sm text-gray-600 space-y-1">
                                <p className="font-medium text-gray-900">{mockOrder.customer.name}</p>
                                <p>{mockOrder.billingAddress.street}</p>
                                <p>{mockOrder.billingAddress.city}, {mockOrder.billingAddress.state} {mockOrder.billingAddress.zip}</p>
                                <p>{mockOrder.billingAddress.country}</p>
                            </address>
                        </div>

                        {/* Order Note */}
                        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Note</h3>
                            <p className="text-sm text-gray-500 italic">
                                &ldquo;Please leave the package at the front porch if no one is home.&rdquo;
                            </p>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}