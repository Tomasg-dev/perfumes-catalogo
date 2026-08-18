"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { ReactNode } from "react";
import type { CartItem } from "./types";

const STORAGE_KEY = "perfumes_cart_v1";
const TOAST_DURATION_MS = 2600;

interface Toast {
  id: number;
  message: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  toast: Toast | null;
}

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: CartItem }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "DISMISS_TOAST"; id: number };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, isHydrated: true };
    case "ADD": {
      if (state.items.some((i) => i.id === action.item.id)) return state;
      return {
        ...state,
        items: [...state.items, action.item],
        toast: { id: Date.now(), message: `${action.item.nombre} agregado al carrito` },
      };
    }
    case "REMOVE": {
      const removed = state.items.find((i) => i.id === action.id);
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
        toast: removed
          ? { id: Date.now(), message: `${removed.nombre} quitado del carrito` }
          : state.toast,
      };
    }
    case "CLEAR":
      if (state.items.length === 0) return state;
      return { ...state, items: [], toast: { id: Date.now(), message: "Carrito vaciado" } };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "DISMISS_TOAST":
      if (state.toast?.id !== action.id) return state;
      return { ...state, toast: null };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  toast: Toast | null;
  itemCount: number;
  total: number;
  pendingPriceCount: number;
  isInCart: (id: string) => boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: CartItem) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    isHydrated: false,
    toast: null,
  });

  // Hidratar desde localStorage una sola vez, después del mount, para
  // evitar un mismatch entre el HTML del servidor y el cliente.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const items = raw ? (JSON.parse(raw) as CartItem[]) : [];
      dispatch({ type: "HYDRATE", items: Array.isArray(items) ? items : [] });
    } catch {
      dispatch({ type: "HYDRATE", items: [] });
    }
  }, []);

  // Persistir solo después de hidratar, para no pisar el carrito guardado
  // con un arreglo vacío mientras el estado inicial aún no se cargó.
  useEffect(() => {
    if (!state.isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // localStorage no disponible (modo privado, cuota excedida, etc.):
      // el carrito sigue funcionando en memoria durante la sesión.
    }
  }, [state.items, state.isHydrated]);

  // Autodescartar la notificación activa; se identifica por id para no
  // cerrar por error una notificación más nueva que llegó mientras corría
  // el temporizador de la anterior.
  useEffect(() => {
    if (!state.toast) return;
    const { id } = state.toast;
    const timer = setTimeout(() => dispatch({ type: "DISMISS_TOAST", id }), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [state.toast]);

  const value = useMemo<CartContextValue>(() => {
    const ids = new Set(state.items.map((i) => i.id));
    return {
      items: state.items,
      isOpen: state.isOpen,
      isHydrated: state.isHydrated,
      toast: state.toast,
      itemCount: state.items.length,
      total: state.items.reduce((sum, i) => sum + (i.precio ?? 0), 0),
      pendingPriceCount: state.items.filter((i) => i.precio === null).length,
      isInCart: (id: string) => ids.has(id),
      addItem: (item: CartItem) => dispatch({ type: "ADD", item }),
      removeItem: (id: string) => dispatch({ type: "REMOVE", id }),
      toggleItem: (item: CartItem) =>
        dispatch(ids.has(item.id) ? { type: "REMOVE", id: item.id } : { type: "ADD", item }),
      clear: () => dispatch({ type: "CLEAR" }),
      openCart: () => dispatch({ type: "OPEN" }),
      closeCart: () => dispatch({ type: "CLOSE" }),
    };
  }, [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
