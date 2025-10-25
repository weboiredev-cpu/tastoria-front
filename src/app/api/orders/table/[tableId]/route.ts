import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tableId: string }> }
) {
  try {
    const { tableId } = await params;
    console.log('[API] Getting order for table:', tableId);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:5000';
    console.log('[API] Using backend URL:', baseUrl);
    const res = await fetch(`${baseUrl}/api/orders/table/${tableId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error('[API] Error response:', res.status);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch order from backend' },
        { status: res.status }
      );
    }

    const order = await res.json();
    console.log('[API] Order data:', order);

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'No order found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      order: {
        customerName: order.customerName || 'Guest',
        phoneNumber: order.phoneNumber || '',
        tableId: order.tableId,
        orderTime: order.orderTime,
        status: order.status
      } 
    });
  } catch (error) {
    console.error('[API] Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
