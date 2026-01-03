"use client"

import useSWR from "swr"
import type { Order } from "@/lib/types"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch orders")
  return res.json()
}

export function useOrders(userId?: number) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/orders?userId=${userId}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  })

  const createOrder = async (order: Order) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order, userId }),
    })
    if (!res.ok) throw new Error("Failed to create order")
    const result = await res.json()
    mutate() // Перезагрузить список заказов
    return result
  }

  const updateOrder = async (orderId: number, updates: Partial<Order>) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) throw new Error("Failed to update order")
    const result = await res.json()
    mutate() // Перезагрузить список заказов
    return result
  }

  const cancelOrder = async (orderId: number) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "DELETE",
    })
    if (!res.ok) throw new Error("Failed to cancel order")
    const result = await res.json()
    mutate() // Перезагрузить список заказов
    return result
  }

  return {
    orders: data?.orders || [],
    isLoading,
    isError: error,
    createOrder,
    updateOrder,
    cancelOrder,
    refresh: mutate,
  }
}
