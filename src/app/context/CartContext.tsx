import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  type: "product" | "service";
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, type: CartItem["type"]) => void;
  updateQuantity: (id: string, type: CartItem["type"], quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "ema-rizos-cart";
const getItemKey = (id: string, type: CartItem["type"]) => `${type}-${id}`;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => getItemKey(i.id, i.type) === getItemKey(item.id, item.type)
      );
      if (existing) {
        return prev.map((i) =>
          getItemKey(i.id, i.type) === getItemKey(item.id, item.type)
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, image: item.image ?? "", quantity: 1 }];
    });
  };

  const removeFromCart = (id: string, type: CartItem["type"]) => {
    setItems((prev) =>
      prev.filter((item) => getItemKey(item.id, item.type) !== getItemKey(id, type))
    );
  };

  const updateQuantity = (id: string, type: CartItem["type"], quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, type);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        getItemKey(item.id, item.type) === getItemKey(id, type)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}