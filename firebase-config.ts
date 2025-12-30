import { initializeApp } from 'firebase/app';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, getAuth } from 'firebase/auth';
import { getDatabase, ref, push, set, get, remove, update, onValue } from 'firebase/database';
import { UserProfile, UserRole, Product, ContactMessage, Order, OrderStatus } from './types';

// Firebase configuration - using actual credentials
const firebaseConfig = {
  apiKey: "AIzaSyCVjuF8MkdJ4TPuXP1MlDc2C-gP3yAkQdY",
  authDomain: "yashvi-studio.firebaseapp.com",
  databaseURL: "https://yashvi-studio-default-rtdb.firebaseio.com",
  projectId: "yashvi-studio",
  storageBucket: "yashvi-studio.firebasestorage.app",
  messagingSenderId: "62576794092",
  appId: "1:62576794092:web:12c302873b871fda4908c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Initial Sample Data in INR
const initialProducts: Product[] = [
  {
    id: 'imperial-burgundy-gown',
    name: 'Imperial Burgundy Floral Gown',
    price: 45000,
    category: 'Gowns',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e96800057?auto=format&fit=crop&q=80',
    description: 'A masterpiece of couture craftsmanship. This floor-length burgundy gown features a majestic strapless silhouette, adorned with hand-stitched floral embroidery and delicate crystalline beading. The multi-layered tulle skirt creates an ethereal movement, perfect for the most grand celebrations.',
    sizes: ['XS', 'S', 'M', 'L'],
    createdAt: Date.now(),
    featured: true
  },
  {
    id: '1',
    name: 'Silk Evening Gown',
    price: 24900,
    category: 'Gowns',
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80',
    description: 'Ethereal silk gown for your most precious evenings. Handcrafted with premium Mulberry silk.',
    sizes: ['S', 'M', 'L'],
    createdAt: Date.now() - 1000,
    featured: true
  },
  {
    id: '2',
    name: 'Velvet Gala Dress',
    price: 28900,
    category: 'Occasion',
    imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80',
    description: 'Deep velvet textures for a premium sophisticated look. Perfect for winter soirées.',
    sizes: ['M', 'L', 'XL'],
    createdAt: Date.now() - 2000,
    featured: true
  },
  {
    id: '3',
    name: 'Minimalist Midi',
    price: 15900,
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80',
    description: 'Clean lines and premium cotton for everyday elegance. A staple for the modern wardrobe.',
    sizes: ['S', 'M', 'L', 'XL'],
    createdAt: Date.now() - 3000,
    featured: true
  }
];

const initializeDatabase = async () => {
  // Check if products exist
  const productsRef = ref(database, 'products');
  const productsSnapshot = await get(productsRef);
  
  if (!productsSnapshot.exists()) {
    // Add initial products
    initialProducts.forEach(async (product) => {
      await set(ref(database, `products/${product.id}`), product);
    });
  }
};

// Initialize database on app start
initializeDatabase();

export const authService = {
  login: async (email: string, password: string): Promise<UserProfile> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get user profile from database
      const userRef = ref(database, `users/${user.uid}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        return userSnapshot.val() as UserProfile;
      } else {
        // Create user profile if it doesn't exist
        const userProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          name: user.email!.split('@')[0], // Default name from email
          role: UserRole.USER,
          createdAt: Date.now()
        };
        await set(userRef, userProfile);
        return userProfile;
      }
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  },

  signup: async (name: string, email: string, password: string): Promise<UserProfile> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name,
        role: UserRole.USER,
        createdAt: Date.now()
      };
      
      // Save user profile to database
      await set(ref(database, `users/${user.uid}`), userProfile);
      
      // Create admin user for specific email
      if (email === 'admin@yashvi.com') {
        const adminProfile: UserProfile = {
          uid: user.uid,
          email: user.email!,
          name,
          role: UserRole.ADMIN,
          createdAt: Date.now()
        };
        await set(ref(database, `users/${user.uid}`), adminProfile);
        return adminProfile;
      }
      
      return userProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },

  getCurrentUser: (): Promise<UserProfile | null> => {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        unsubscribe();
        if (user) {
          const userRef = ref(database, `users/${user.uid}`);
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            resolve(userSnapshot.val() as UserProfile);
          } else {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    });
  },

  onAuthStateChanged: (callback: (user: UserProfile | null) => void) => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          callback(userSnapshot.val() as UserProfile);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
};

export const dbService = {
  getProducts: async (): Promise<Product[]> => {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    const products: Product[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        products.push(childSnapshot.val() as Product);
      });
    }
    
    return products;
  },

  addProduct: async (product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> => {
    const newProductRef = push(ref(database, 'products'));
    const newProduct: Product = {
      ...product,
      id: newProductRef.key!,
      createdAt: Date.now()
    };
    
    await set(newProductRef, newProduct);
    return newProduct;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await remove(ref(database, `products/${id}`));
  },

  updateProduct: async (id: string, updates: Partial<Product>): Promise<void> => {
    await update(ref(database, `products/${id}`), updates);
  },

  getMessages: async (): Promise<ContactMessage[]> => {
    const messagesRef = ref(database, 'messages');
    const snapshot = await get(messagesRef);
    const messages: ContactMessage[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        messages.push(childSnapshot.val() as ContactMessage);
      });
    }
    
    return messages;
  },

  addMessage: async (msg: Omit<ContactMessage, 'id' | 'createdAt'>): Promise<void> => {
    const newMessageRef = push(ref(database, 'messages'));
    const newMessage: ContactMessage = {
      ...msg,
      id: newMessageRef.key!,
      createdAt: Date.now()
    };
    
    await set(newMessageRef, newMessage);
  },

  getOrders: async (): Promise<Order[]> => {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    const orders: Order[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        orders.push(childSnapshot.val() as Order);
      });
    }
    
    return orders;
  },

  addOrder: async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> => {
    const newOrderRef = push(ref(database, 'orders'));
    const newOrder: Order = {
      ...orderData,
      id: `YS-${Math.floor(100000 + Math.random() * 900000)}`,
      status: OrderStatus.PROCESSING,
      createdAt: Date.now()
    };
    
    await set(newOrderRef, newOrder);
    return newOrder;
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<void> => {
    const ordersRef = ref(database, 'orders');
    const snapshot = await get(ordersRef);
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val() as Order;
        if (order.id === id) {
          update(childSnapshot.ref, { status });
        }
      });
    }
  },

  getUsers: async (): Promise<UserProfile[]> => {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    const users: UserProfile[] = [];
    
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        users.push(childSnapshot.val() as UserProfile);
      });
    }
    
    return users;
  },

  // Real-time listeners
  onProductsChange: (callback: (products: Product[]) => void) => {
    const productsRef = ref(database, 'products');
    return onValue(productsRef, (snapshot) => {
      const products: Product[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          products.push(childSnapshot.val() as Product);
        });
      }
      callback(products);
    });
  },

  onOrdersChange: (callback: (orders: Order[]) => void) => {
    const ordersRef = ref(database, 'orders');
    return onValue(ordersRef, (snapshot) => {
      const orders: Order[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          orders.push(childSnapshot.val() as Order);
        });
      }
      callback(orders);
    });
  },

  onMessagesChange: (callback: (messages: ContactMessage[]) => void) => {
    const messagesRef = ref(database, 'messages');
    return onValue(messagesRef, (snapshot) => {
      const messages: ContactMessage[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push(childSnapshot.val() as ContactMessage);
        });
      }
      callback(messages);
    });
  }
};

export { auth, database };
