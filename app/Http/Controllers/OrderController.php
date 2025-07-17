<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        \Log::info('Session ID: ' . session()->getId());
        \Log::info('CSRF header: ' . $request->header('X-CSRF-TOKEN'));
        \Log::info('CSRF input: ' . $request->input('_token'));
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $order = Order::create([
            'customer_id' => $user->id,
            'username' => $user->name,
            'total_price' => $validated['total_price'],
            'discount_price' => $validated['discount_price'] ?? 0,
        ]);

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $lineTotal = $product->price * $item['quantity'];
            $lineDiscount = ($item['quantity'] > 1) ? $lineTotal * 0.15 : 0;
            $order->items()->create([
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $product->price,
                'discount_price' => $lineDiscount,
            ]);
        }

        return response()->json(['message' => 'Order placed successfully', 'order_id' => $order->id], 201);
    }

    public function status(Request $request)
    {
        $user = $request->user();
        $orders = $user->orders()->with('items.product')->orderBy('created_at', 'desc')->get();
        return response()->json(['orders' => $orders]);
    }
} 