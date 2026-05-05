import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  onSnapshot,
  setDoc,
  getDoc,
  Timestamp,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { AppData, Resident, IncomeCategory, IncomeRecord, Expense, ExpenseCategory, Apartment } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure user is authenticated if needed (handled by UI now)
export const setupAuth = () => {
  // We rely on Google Login for managers
};

// Apartment Management
export const registerApartment = async (apartment: Omit<Apartment, 'id'>): Promise<string> => {
  const path = 'apartments';
  try {
    const normalizedName = apartment.name.trim().toLocaleLowerCase('tr-TR');
    const docRef = await addDoc(collection(db, path), {
      ...apartment,
      name: normalizedName,
      display_name: apartment.name.trim(), // Keep original for display
      created_at: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
};

export const searchApartments = async (name: string, city?: string): Promise<Apartment[]> => {
  const searchName = name.trim().toLocaleLowerCase('tr-TR');
  
  // Firestore case-insensitive search is limited. 
  // We'll fetch more results and filter client-side for better UX in this scale.
  let q;
  if (city) {
    q = query(collection(db, 'apartments'), where('city', '==', city));
  } else {
    // If no city, we fetch all to ensure we find it (assuming small dataset for now)
    // In production, you'd use a search service or normalized search fields
    q = query(collection(db, 'apartments'), limit(100)); 
  }

  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any } as Apartment));

  return results.filter(apt => {
    const n = apt.name.toLocaleLowerCase('tr-TR');
    const dn = (apt as any).display_name?.toLocaleLowerCase('tr-TR') || '';
    const target = name.trim().toLocaleLowerCase('tr-TR');
    
    return n.includes(target) || dn.includes(target) || 
           n === target || dn === target;
  });
};

export const updateApartment = async (id: string, data: Partial<Apartment>) => {
  const path = 'apartments';
  try {
    const updateData: any = { ...data };
    if (updateData.name) {
      updateData.name = updateData.name.trim().toLocaleLowerCase('tr-TR');
      updateData.display_name = data.name?.trim();
    }
    await updateDoc(doc(db, path, id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const getApartmentById = async (id: string): Promise<Apartment | null> => {
  const docSnap = await getDoc(doc(db, 'apartments', id));
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Apartment;
  }
  return null;
};

// Scoped Data Fetching
export const subscribeToData = (apartmentId: string, callback: (data: AppData) => void) => {
  const qResidents = query(collection(db, 'residents'), where('apartment_id', '==', apartmentId));
  const unsubResidents = onSnapshot(qResidents, (snapshot) => {
    const residents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    updateData({ residents });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'residents'));

  const qIncomeCategories = query(collection(db, 'income_categories'), where('apartment_id', '==', apartmentId));
  const unsubIncomeCategories = onSnapshot(qIncomeCategories, (snapshot) => {
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    updateData({ categories });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'income_categories'));

  const qExpenseCategories = query(collection(db, 'expense_categories'), where('apartment_id', '==', apartmentId));
  const unsubExpenseCategories = onSnapshot(qExpenseCategories, (snapshot) => {
    const expenseCategories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    updateData({ expenseCategories });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'expense_categories'));

  const qIncomeRecords = query(collection(db, 'income_records'), where('apartment_id', '==', apartmentId));
  const unsubIncomeRecords = onSnapshot(qIncomeRecords, (snapshot) => {
    const incomeRecords = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    updateData({ incomeRecords });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'income_records'));

  const qExpenses = query(collection(db, 'expenses'), where('apartment_id', '==', apartmentId));
  const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
    const expenses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
    updateData({ expenses });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'expenses'));

  const qSettings = query(collection(db, 'settings'), where('apartment_id', '==', apartmentId));
  const unsubSettings = onSnapshot(qSettings, (snapshot) => {
    const carryoverDoc = snapshot.docs.find(doc => doc.data().key === 'carryover');
    updateData({ carryover: parseFloat(carryoverDoc?.data()?.value || '0') });
  }, (error) => handleFirestoreError(error, OperationType.LIST, 'settings'));

  let currentData: AppData = {
    residents: [],
    categories: [],
    expenseCategories: [],
    incomeRecords: [],
    expenses: [],
    carryover: 0
  };

  function updateData(partial: Partial<AppData>) {
    currentData = { ...currentData, ...partial };
    callback(currentData);
  }

  return () => {
    unsubResidents();
    unsubIncomeCategories();
    unsubExpenseCategories();
    unsubIncomeRecords();
    unsubExpenses();
    unsubSettings();
  };
};

export const updateIncome = async (apartmentId: string, residentId: string, categoryId: string, month: number, year: number, amount: number, status: 'paid' | 'exempt' | 'pending') => {
  const path = 'income_records';
  try {
    const q = query(collection(db, path), 
      where('apartment_id', '==', apartmentId),
      where('resident_id', '==', residentId),
      where('category_id', '==', categoryId),
      where('month', '==', month),
      where('year', '==', year)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, path, docId), { amount, status });
    } else {
      await addDoc(collection(db, path), { apartment_id: apartmentId, resident_id: residentId, category_id: categoryId, month, year, amount, status });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteIncome = async (id: string) => {
  const path = 'income_records';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const saveExpense = async (id: string | null, apartmentId: string, expense: Omit<Expense, 'id' | 'apartment_id'>) => {
  const path = 'expenses';
  try {
    if (id) {
      await updateDoc(doc(db, path, id), { ...expense, apartment_id: apartmentId });
    } else {
      await addDoc(collection(db, path), { ...expense, apartment_id: apartmentId });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteExpense = async (id: string) => {
  const path = 'expenses';
  try {
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const addIncomeCategory = async (apartmentId: string, name: string): Promise<string> => {
  const path = 'income_categories';
  try {
    const docRef = await addDoc(collection(db, path), { apartment_id: apartmentId, name });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    return '';
  }
};

export const addExpenseCategory = async (apartmentId: string, name: string) => {
  const path = 'expense_categories';
  try {
    await addDoc(collection(db, path), { apartment_id: apartmentId, name });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateResidentName = async (id: string, name: string, is_manager?: boolean) => {
  const path = 'residents';
  try {
    const updateData: any = { name };
    if (is_manager !== undefined) updateData.is_manager = is_manager;
    await updateDoc(doc(db, path, id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteResident = async (apartmentId: string, id: string) => {
  const path = 'residents';
  try {
    // Also delete associated income records to keep data clean
    const q = query(collection(db, 'income_records'), where('apartment_id', '==', apartmentId), where('resident_id', '==', id));
    const incomeSnapshot = await getDocs(q);
    for (const d of incomeSnapshot.docs) {
      await deleteDoc(doc(db, 'income_records', d.id));
    }
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const getResidents = async (apartmentId: string): Promise<Resident[]> => {
  const q = query(collection(db, 'residents'), where('apartment_id', '==', apartmentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resident));
};

export const addResident = async (apartmentId: string, resident: Omit<Resident, 'id' | 'apartment_id'>) => {
  const path = 'residents';
  try {
    await addDoc(collection(db, path), { 
      ...resident, 
      apartment_id: apartmentId,
      is_manager: !!resident.is_manager 
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateCarryover = async (apartmentId: string, amount: number) => {
  const path = 'settings';
  try {
    const q = query(collection(db, path), where('apartment_id', '==', apartmentId), where('key', '==', 'carryover'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(doc(db, path, snapshot.docs[0].id), { value: amount.toString() });
    } else {
      await addDoc(collection(db, path), { apartment_id: apartmentId, key: 'carryover', value: amount.toString() });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const updateIncomeCategoryRequiredAmount = async (categoryId: string, amount: number | null) => {
  const path = 'income_categories';
  try {
    await updateDoc(doc(db, path, categoryId), { required_amount: amount });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteApartment = async (id: string) => {
  const path = 'apartments';
  try {
    const collectionsToDelete = ['residents', 'income_categories', 'expense_categories', 'income_records', 'expenses', 'settings'];
    for (const col of collectionsToDelete) {
      const q = query(collection(db, col), where('apartment_id', '==', id));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, col, d.id));
      }
    }
    await deleteDoc(doc(db, path, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
    throw error;
  }
};
