import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { CITIES, DISTRICTS } from './locations';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  ChevronDown,
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Settings, 
  Sun, 
  Moon,
  PlusCircle,
  Pencil,
  Save,
  X,
  Menu,
  LayoutDashboard,
  Receipt,
  Users,
  Download,
  LogIn,
  LogOut,
  MapPin,
  Building2,
  Package,
  Key,
  Eye,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AppData, Resident, IncomeCategory, IncomeRecord, Expense, Apartment } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { 
  subscribeToData, 
  updateIncome, 
  deleteIncome, 
  saveExpense, 
  deleteExpense, 
  addIncomeCategory, 
  addExpenseCategory, 
  updateResidentName,
  updateApartment,
  deleteResident,
  registerApartment,
  searchApartments,
  getApartmentById,
  deleteApartment,
  getResidents,
  addResident,
  updateCarryover,
  updateIncomeCategoryRequiredAmount
} from './services/firebaseService';
import { TURKISH_CITIES, getDistricts, getNeighborhoods } from './services/locationService';

function AppInfo() {
  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Info size={120} />
        </div>
        
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2">Uygulama Bilgileri</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8 font-medium">Bina ve apartman yönetim sisteminiz hakkında detaylı bilgiler.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.02]">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Geliştirici</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">
                    B
                  </div>
                  <div>
                    <p className="font-bold text-lg">Bekir Buğra Kaş</p>
                    <p className="text-sm text-zinc-500">Yazılım Geliştirici</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 transition-all hover:scale-[1.02]">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">Sürüm Bilgisi</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-black text-2xl text-blue-600 dark:text-blue-400">0.81 BETA</p>
                    <p className="text-sm text-zinc-500 mt-1">Son Güncelleme: {currentDate}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold ring-1 ring-emerald-500/20">
                    GÜNCEL
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-xl mb-4">Dijital Yönetim</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  Bu uygulama, apartman ve site yönetim süreçlerini dijitalleştirmek, aidat takibini kolaylaştırmak ve şeffaf bir gelir-gider yönetimi sağlamak amacıyla geliştirilmiştir.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-xs font-bold uppercase tracking-wider">Güvenli Veri Altyapısı</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-xl font-black">Kullanım Şartları</h3>
          </div>
          <div className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <p className="flex gap-3">
              <span className="font-black text-blue-500">01</span>
              <span>Bu uygulama bireysel ve kurumsal apartman yönetimi amaçları için tasarlanmıştır.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">02</span>
              <span>Verileriniz bulut altyapısında güvenli bir şekilde saklanmakta olup, üçüncü taraflarla paylaşılmamaktadır.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">03</span>
              <span>Sistemin kötüye kullanımı veya yasadışı faaliyetler için kullanılması yasaktır.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">04</span>
              <span>Uygulama üzerindeki tüm hesaplamalar bilgi amaçlıdır, mali ve hukuki sorumluluk kullanıcıya aittir.</span>
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-black">Gizlilik Politikası</h3>
          </div>
          <div className="space-y-4 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            <p className="flex gap-3">
              <span className="font-black text-blue-500">01</span>
              <span>Toplanan veriler sadece apartman yönetimi fonksiyonlarının yerine getirilmesi için kullanılır.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">02</span>
              <span>Şifreleriniz modern şifreleme yöntemleri ile korunmaktadır.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">03</span>
              <span>Kullanıcı verileri KVKK standartlarına uygun olarak işlenmektedir.</span>
            </p>
            <p className="flex gap-3">
              <span className="font-black text-blue-500">04</span>
              <span>Herhangi bir güvenlik açığı bildirmek veya veri silme talebinde bulunmak için yönetici ile iletişime geçebilirsiniz.</span>
            </p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center pb-8">
        <p className="text-xs text-zinc-400 font-medium">© 2026 Bekir Buğra Kaş - Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
}

function ApartmentSettings({ apartment, onUpdate, onDelete }: { apartment: Apartment, onUpdate: (updates: Partial<Apartment>) => Promise<void>, onDelete: () => Promise<void> }) {
  const [name, setName] = useState(apartment.display_name || apartment.name);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTimer, setDeleteTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (deleteTimer > 0) {
      interval = setInterval(() => {
        setDeleteTimer(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [deleteTimer]);

  const handleUpdateName = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await onUpdate({ name: name.trim() });
      setSuccess('Apartman adı başarıyla güncellendi.');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (newPassword.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onUpdate({ manager_password: newPassword });
      setSuccess('Yönetici şifresi başarıyla güncellendi.');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccess(null), 3000);
    } catch (e) {
      setError('Hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Apartman Ayarları</h2>
            <p className="text-sm font-medium text-zinc-500">Genel apartman bilgilerini buradan düzenleyebilirsiniz.</p>
          </div>
        </div>

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 border border-emerald-100">
            <CheckCircle2 size={18} /> {success}
          </motion.div>
        )}

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-6 text-sm font-bold flex items-center gap-3 border border-rose-100">
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <div className="space-y-8">
          {/* Name Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Apartman İsmi</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Apartman Adı"
                className="flex-1 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-emerald-500 transition-all font-bold"
              />
              <button 
                onClick={handleUpdateName}
                disabled={loading || !name.trim() || name === (apartment.display_name || apartment.name)}
                className="bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white px-6 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                GÜNCELLE
              </button>
            </div>
          </section>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Password Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Şifre Değiştir</h3>
            <div className="space-y-3">
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni Şifre"
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-emerald-500 transition-all font-bold"
              />
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Yeni Şifre Tekrar"
                className="w-full p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-2 border-transparent focus:border-emerald-500 transition-all font-bold"
              />
              <button 
                onClick={handleUpdatePassword}
                disabled={loading || !newPassword || !confirmPassword}
                className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-black shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                ŞİFREYİ KAYDET
              </button>
            </div>
            <div className="flex justify-center">
              <button 
                onClick={() => window.location.href = `mailto:bekirb1903@gmail.com?subject=Apartman Yönetici Şifresi Sıfırlama&body=Merhaba,%20${apartment.display_name || apartment.name}%20için%20yönetici%20şifremi%20unuttum.%20Yardımcı%20olur%20musunuz?`}
                className="text-xs text-blue-500 font-bold hover:underline"
              >
                Şifremi Unuttum
              </button>
            </div>
          </section>

          <hr className="border-zinc-100 dark:border-zinc-800" />

          {/* Delete Section */}
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <Trash2 size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">Tehlikeli Alan</h3>
            </div>
            <p className="text-xs text-zinc-500">Apartmanı ve tüm verileri kalıcı olarak silmek için yönetici şifrenizi girin.</p>
            
            {!deleteConfirmOpen ? (
              <div className="space-y-3">
                <input 
                  type="password" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Yönetici Şifresi"
                  className="w-full p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-900/10 border-2 border-transparent focus:border-rose-500 transition-all font-bold"
                />
                <button 
                  onClick={() => {
                    if (deletePassword === apartment.manager_password) {
                      setDeleteConfirmOpen(true);
                      setDeleteTimer(5);
                      setError(null);
                    } else {
                      setError('Hatalı yönetici şifresi.');
                    }
                  }}
                  disabled={!deletePassword || loading}
                  className="w-full bg-white dark:bg-zinc-900 text-rose-500 border-2 border-rose-500 p-4 rounded-2xl font-black hover:bg-rose-500 hover:text-white transition-all disabled:opacity-50"
                >
                  APARTMANI SİL
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-2xl border-2 border-rose-200 dark:border-rose-900/40 space-y-4">
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">
                  DİKKAT: Bu işlem geri alınamaz! Tüm sakinler, gelirler ve giderler kalıcı olarak silinecektir.
                </p>
                <button 
                  onClick={async () => {
                    if (deleteTimer === 0) {
                      setLoading(true);
                      await onDelete();
                      setLoading(false);
                    }
                  }}
                  disabled={deleteTimer > 0 || loading}
                  className="w-full bg-rose-600 text-white p-4 rounded-2xl font-black shadow-lg shadow-rose-600/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {deleteTimer > 0 ? `Lütfen Bekleyin (${deleteTimer}s)` : "KAYDI KALICI OLARAK SİL"}
                </button>
                <button 
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="w-full text-zinc-500 font-bold text-sm hover:underline"
                >
                  Vazgeç
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const DEFAULT_INCOME_REASONS = ['Aidat', 'Asansör Revizyon', 'Boya - Kamera - Hidrofor Bakımı', 'Diğer Gelirler'];
const DEFAULT_EXPENSE_REASONS = ['Asansör Bakım', 'Temizlik Ücreti', 'Asansör Revizyon', 'Boya Alımı', 'Boya Ücreti', 'Kamera Bakım Yenileme', 'Hidrofor Bakım', 'Apartman Malzeme Alımı'];
const HIDDEN_CATEGORIES = ['Apartman Boyama Ücreti', 'Kamera Bakım'];

const trToEn = (text: string) => {
  if (!text) return '';
  return text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
};

const numberToTurkishWords = (n: number) => {
  const units = ["", "BIR", "IKI", "UC", "DORT", "BES", "ALTI", "YEDI", "SEKIZ", "DOKUZ"];
  const tens = ["", "ON", "YIRMI", "OTUZ", "KIRK", "ELLI", "ALTMIS", "YETMIS", "SEKSEN", "DOKSAN"];
  const thousands = ["", "BIN", "MILYON", "MILYAR"];

  if (n === 0) return "SIFIR";

  let words = "";
  let i = 0;
  let tempN = Math.floor(n);

  while (tempN > 0) {
    let chunk = tempN % 1000;
    if (chunk > 0) {
      let chunkWords = "";
      let hundreds = Math.floor(chunk / 100);
      let tens_digit = Math.floor((chunk % 100) / 10);
      let units_digit = chunk % 10;

      if (hundreds > 0) {
        if (hundreds === 1) chunkWords += "YUZ ";
        else chunkWords += units[hundreds] + " YUZ ";
      }
      if (tens_digit > 0) {
        chunkWords += tens[tens_digit] + " ";
      }
      if (units_digit > 0) {
        if (!(i === 1 && chunk === 1)) {
          chunkWords += units[units_digit] + " ";
        }
      }
      
      words = chunkWords + thousands[i] + " " + words;
    }
    tempN = Math.floor(tempN / 1000);
    i++;
  }

  return words.trim();
};

const handleDownloadReceipt = (resident: Resident, apartment: Apartment, record: IncomeRecord, categoryName: string) => {
  const doc = new jsPDF('l', 'mm', [210, 148]); // A5 Landscape
  
  const drawDashedLine = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setLineDashPattern([1, 1], 0);
    doc.line(x1, y1, x2, y2);
    doc.setLineDashPattern([], 0);
  };

  // Border and Yellow Strip
  doc.setDrawColor(200, 200, 200);
  doc.rect(5, 5, 200, 138);
  doc.setFillColor(230, 190, 100);
  doc.rect(5, 5, 10, 138, 'F');

  // Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(20, 20, 20);
  doc.text(trToEn("APARTMAN GELIR"), 145, 20, { align: 'center' });
  doc.text(trToEn("MAKBUZU"), 145, 30, { align: 'center' });
  
  // Underline for Title
  doc.setLineWidth(0.8);
  doc.setDrawColor(20, 20, 20);
  doc.line(110, 32, 180, 32);

  // Table - Left Side
  doc.setLineWidth(0.3);
  doc.setDrawColor(0, 0, 0);
  doc.rect(20, 45, 60, 85); // Table Outer
  doc.line(45, 45, 45, 130); // Vertical divide
  
  // Table Rows
  doc.setFontSize(9);
  doc.text(trToEn("CINSI"), 32, 51, { align: 'center' });
  doc.text(trToEn("TUTARI"), 67, 51, { align: 'center' });
  doc.line(20, 53, 80, 53);

  const categories = [
    "Aidat", "Bakim / Onarim", "Malzeme Alimi", "Elektrik", "Temizlik", "Asansor", "Diger"
  ];
  
  let currentY = 60;
  categories.forEach(cat => {
    doc.setFont('helvetica', 'semibold');
    doc.text(trToEn(cat), 22, currentY);
    
    const normalizedCat = trToEn(categoryName).toLowerCase();
    const normalizedListCat = trToEn(cat).toLowerCase();
    
    // Mapping Logic
    let isMatch = false;
    if (normalizedListCat === 'aidat' && normalizedCat === 'aidat') isMatch = true;
    else if (normalizedListCat === 'bakim / onarim' && (normalizedCat.includes('bakim') || normalizedCat.includes('onarin') || normalizedCat.includes('boya') || normalizedCat.includes('kamera') || normalizedCat.includes('hidrofor')) && !normalizedCat.includes('asansor')) isMatch = true;
    else if (normalizedListCat === 'malzeme alimi' && normalizedCat.includes('malzeme')) isMatch = true;
    else if (normalizedListCat === 'elektrik' && normalizedCat.includes('elektrik')) isMatch = true;
    else if (normalizedListCat === 'temizlik' && normalizedCat.includes('temizlik')) isMatch = true;
    else if (normalizedListCat === 'asansor' && normalizedCat.includes('asansor')) isMatch = true;
    else if (normalizedListCat === 'diger' && !isMatch) {
      // Check if it matched any of the above first
      const matchedAnyOther = 
        (normalizedCat === 'aidat') ||
        ((normalizedCat.includes('bakim') || normalizedCat.includes('onarin') || normalizedCat.includes('boya') || normalizedCat.includes('kamera') || normalizedCat.includes('hidrofor')) && !normalizedCat.includes('asansor')) ||
        (normalizedCat.includes('malzeme')) ||
        (normalizedCat.includes('elektrik')) ||
        (normalizedCat.includes('temizlik')) ||
        (normalizedCat.includes('asansor'));
      if (!matchedAnyOther) isMatch = true;
    }
    
    if (isMatch) {
       doc.text(`${record.amount.toLocaleString()}`, 47, currentY);
    }

    doc.setLineWidth(0.1);
    drawDashedLine(20, currentY + 2, 80, currentY + 2);
    currentY += 8;
  });

  // Total Row
  doc.setLineWidth(0.3);
  doc.line(20, 120, 80, 120);
  doc.setFontSize(10);
  doc.text(trToEn("TOPLAM"), 22, 127);
  doc.text(`${record.amount.toLocaleString()}`, 47, 127);

  // Right Side Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(trToEn("Daire No :"), 95, 45);
  drawDashedLine(115, 45, 140, 45);
  doc.setFont('helvetica', 'bold');
  doc.text(resident.apartment_no, 117, 45);

  doc.setFont('helvetica', 'normal');
  doc.text(trToEn("Ay Yil :"), 95, 55);
  drawDashedLine(105, 55, 140, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(trToEn(`${MONTHS[record.month - 1]} ${record.year}`), 107, 55);

  doc.setFont('helvetica', 'normal');
  doc.text(trToEn("Tarih :"), 150, 55);
  drawDashedLine(163, 55, 195, 55);
  doc.setFont('helvetica', 'bold');
  doc.text(new Date().toLocaleDateString('tr-TR'), 165, 55);

  // Main Receipt Text
  doc.setFont('helvetica', 'normal');
  doc.text(trToEn("Yukarda Yazili Yalniz ..................................................................................................................."), 95, 80);
  doc.text(trToEn(".................................................................................................................................................. TL"), 95, 90);

  doc.setFont('helvetica', 'bold');
  doc.text(trToEn(numberToTurkishWords(record.amount) + " TURK LIRASI"), 95, 89.5);
  doc.text(record.amount.toLocaleString(), 185, 89.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text(trToEn("Sayin ..................................................................................................................'den"), 95, 105);
  doc.text(trToEn("Alinmistir"), 95, 113);
  doc.setFont('helvetica', 'bold');
  doc.text(trToEn(resident.name).toUpperCase(), 107, 104.5);

  // Footer / Sign
  doc.setFontSize(8);
  doc.text(trToEn("TESLIM EDEN (APARTMAN YONETIMI)"), 150, 125, { align: 'center' });
  doc.setFontSize(10);
  doc.text(trToEn(apartment.display_name || apartment.name).toUpperCase(), 150, 132, { align: 'center' });

  doc.save(`Makbuz_${resident.apartment_no}_${MONTHS[record.month-1]}.pdf`);
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'income_list' | 'income_table' | 'expense_list' | 'expense_table' | 'residents' | 'settings' | 'app_info'>('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(''); 
  const [selectedYear] = useState(2026);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Custom Auth State
  const [apartmentId, setApartmentId] = useState<string | null>(localStorage.getItem('apartmentId'));
  const [userRole, setUserRole] = useState<'manager' | 'resident' | null>(localStorage.getItem('userRole') as any);
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(localStorage.getItem('selectedResidentId'));
  const [currentApartment, setCurrentApartment] = useState<Apartment | null>(null);

  // Modals
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeRecord | null>(null);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showExpenseCategoryModal, setShowExpenseCategoryModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ type: 'income' | 'expense' | 'resident', id: string } | null>(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });

    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(savedMode === 'true');
    }

    if (apartmentId) {
      getApartmentById(apartmentId).then(apt => {
        if (apt) {
          setCurrentApartment(apt);
        } else {
          // Clear if invalid
          handleLogout();
        }
      });
    }

    return () => unsubAuth();
  }, []);

  useEffect(() => {
    if (apartmentId) {
      setLoading(true);
      const unsubData = subscribeToData(apartmentId, (newData) => {
        setData(newData);
        setLoading(false);
        if (newData.categories.length > 0 && !selectedCategory) {
          const aidat = newData.categories.find(c => c.name === 'Aidat');
          setSelectedCategory(aidat?.id || newData.categories[0].id);
        }
      });
      return () => unsubData();
    }
  }, [apartmentId]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const handleApartmentLogin = (id: string, role: 'manager' | 'resident', residentId?: string) => {
    setApartmentId(id);
    setUserRole(role);
    if (residentId) {
      setSelectedResidentId(residentId);
      localStorage.setItem('selectedResidentId', residentId);
    }
    localStorage.setItem('apartmentId', id);
    localStorage.setItem('userRole', role);
    getApartmentById(id).then(apt => setCurrentApartment(apt));
  };

  const handleLogout = async () => {
    setApartmentId(null);
    setUserRole(null);
    setSelectedResidentId(null);
    setCurrentApartment(null);
    localStorage.removeItem('apartmentId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('selectedResidentId');
    await signOut(auth);
  };

  const handleDeleteResident = async (id: string) => {
    if (!apartmentId) return;
    setShowDeleteConfirm({ type: 'resident', id });
  };

  const handleIncomeUpdate = async (residentId: string, month: number, amount: number, status: 'paid' | 'exempt' | 'pending', categoryId?: string) => {
    if (!apartmentId) return;
    await updateIncome(apartmentId, residentId, categoryId || selectedCategory, month, selectedYear, amount, status);
  };

  const expenseDescriptions = useMemo(() => {
    if (!data) return [];
    const descs = Array.from(new Set(data.expenses.map(e => e.description)));
    return descs.filter(d => d !== "ELEKTRİK FATURASI").sort();
  }, [data]);

  const totals = useMemo(() => {
    if (!data) return { income: 0, expenses: 0, balance: 0 };
    const incomeTotal = data.incomeRecords.reduce((sum, rec) => sum + (rec.status === 'paid' ? rec.amount : 0), 0) + data.carryover;
    const expenseTotal = data.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      income: incomeTotal,
      expenses: expenseTotal,
      balance: incomeTotal - expenseTotal
    };
  }, [data]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!apartmentId) {
    return (
      <AuthFlow onLogin={handleApartmentLogin} />
    );
  }

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-zinc-950 overflow-hidden">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex bg-stone-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 overflow-x-hidden`}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-400 uppercase">Apartman Yönetim Paneli</h1>
              <p className="text-xs font-black text-zinc-900 dark:text-white truncate max-w-[140px] uppercase tracking-tight">{currentApartment?.display_name || currentApartment?.name || 'Yükleniyor...'}</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto no-scrollbar pr-2">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Panel" 
              active={activeTab === 'dashboard'} 
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} 
            />
            <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gelir Yönetimi</div>
            <NavItem 
              icon={<Plus size={18} />} 
              label="Gelirler" 
              active={activeTab === 'income_list'} 
              onClick={() => { setActiveTab('income_list'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Receipt size={18} />} 
              label="Gelir Çizelgesi" 
              active={activeTab === 'income_table'} 
              onClick={() => { setActiveTab('income_table'); setIsSidebarOpen(false); }} 
            />
            <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Gider Yönetimi</div>
            <NavItem 
              icon={<TrendingDown size={18} />} 
              label="Giderler" 
              active={activeTab === 'expense_list'} 
              onClick={() => { setActiveTab('expense_list'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon={<Receipt size={18} />} 
              label="Gider Çizelgesi" 
              active={activeTab === 'expense_table'} 
              onClick={() => { setActiveTab('expense_table'); setIsSidebarOpen(false); }} 
            />
            {userRole === 'manager' && (
              <>
                <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Yönetim</div>
                <NavItem 
                  icon={<Users size={18} />} 
                  label="Sakinler" 
                  active={activeTab === 'residents'} 
                  onClick={() => { setActiveTab('residents'); setIsSidebarOpen(false); }} 
                />
                <NavItem 
                  icon={<Settings size={18} />} 
                  label="Apartman Ayarları" 
                  active={activeTab === 'settings'} 
                  onClick={() => { setActiveTab('settings'); setIsSidebarOpen(false); }} 
                />
              </>
            )}
            <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Sistem</div>
            <NavItem 
              icon={<Info size={18} />} 
              label="Uygulama Bilgileri" 
              active={activeTab === 'app_info'} 
              onClick={() => { setActiveTab('app_info'); setIsSidebarOpen(false); }} 
            />
          </nav>

          <button 
            onClick={handleLogout}
            className="mt-auto flex items-center gap-3 w-full p-3 rounded-xl text-zinc-500 hover:bg-rose-50 hover:text-rose-500 transition-all"
          >
            <LogOut size={18} />
            <span className="font-semibold">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 md:p-8 w-full max-w-full overflow-x-hidden relative">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold tracking-tight">
                {activeTab === 'dashboard' && 'Genel Bakış'}
                {activeTab === 'income_list' && 'Gelir Kayıtları'}
                {activeTab === 'income_table' && 'Gelir Çizelgesi'}
                {activeTab === 'expense_list' && 'Gider Kayıtları'}
                {activeTab === 'expense_table' && 'Gider Çizelgesi'}
                {activeTab === 'residents' && 'Apartman Sakinleri'}
                {activeTab === 'app_info' && 'Uygulama Bilgileri'}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                Hoş geldiniz, {userRole === 'manager' ? 'Sayın Yönetici' : 'Sayın Apartment Sakini'}.
              </p>
            </div>
            {/* Mobile Title */}
            <div className="lg:hidden">
              <h2 className="text-lg font-bold truncate max-w-[150px] uppercase tracking-tight">
                {currentApartment?.display_name || currentApartment?.name}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              title={darkMode ? "Aydınlık Mod" : "Karanlık Mod"}
            >
              {darkMode ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-zinc-600" />}
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard data={data} totals={totals} apartmentName={currentApartment?.name} userRole={userRole} currentResidentId={selectedResidentId} />}
        {activeTab === 'income_list' && (
          <IncomeList 
            data={data} 
            onAdd={() => { setEditingIncome(null); setShowIncomeModal(true); }}
            onEdit={(rec) => { setEditingIncome(rec); setShowIncomeModal(true); }}
            isManager={userRole === 'manager'}
            currentResidentId={selectedResidentId}
            currentApartment={currentApartment}
          />
        )}
        {activeTab === 'income_table' && (
          <IncomeTable 
            data={data} 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            onUpdate={handleIncomeUpdate}
            onAddCategory={userRole === 'manager' ? () => setShowCategoryModal(true) : undefined}
            isManager={userRole === 'manager'}
            currentResidentId={selectedResidentId}
          />
        )}
        {activeTab === 'expense_list' && (
          <ExpenseList 
            expenses={data.expenses} 
            onEdit={(exp) => {
              setEditingExpense(exp);
              setShowExpenseModal(true);
            }}
            isManager={userRole === 'manager'}
          />
        )}
        {activeTab === 'expense_table' && (
          <ExpenseTable expenses={data.expenses} />
        )}
        {activeTab === 'residents' && (
          <ResidentList 
            residents={data.residents} 
            onUpdate={async (id, name, isManager) => {
              await updateResidentName(id, name, isManager);
            }}
            onDelete={handleDeleteResident}
            isManager={userRole === 'manager'}
            onAddResident={userRole === 'manager' ? async (res) => {
              if (apartmentId) await addResident(apartmentId, { apartment_no: res.apartment_no, name: res.name, is_manager: res.is_manager });
            } : undefined}
          />
        )}
        {activeTab === 'settings' && currentApartment && (
          <ApartmentSettings 
            apartment={currentApartment}
            onUpdate={async (updates) => {
              await updateApartment(currentApartment.id, updates);
              const updated = await getApartmentById(currentApartment.id);
              if (updated) setCurrentApartment(updated);
            }}
            onDelete={async () => {
               await deleteApartment(currentApartment.id);
               handleLogout();
            }}
          />
        )}
        {activeTab === 'app_info' && <AppInfo />}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showIncomeModal && (
          <IncomeModal 
            data={data}
            apartmentId={apartmentId || ''}
            income={editingIncome}
            currentApartment={currentApartment}
            onClose={() => { setShowIncomeModal(false); setEditingIncome(null); }}
            onSave={async (payload) => {
              if (payload.category_id) {
                setSelectedCategory(payload.category_id);
              }
              
              if (payload.months) {
                const amountPerMonth = payload.amount / payload.months.length;
                for (const month of payload.months) {
                  await handleIncomeUpdate(payload.resident_id, month, amountPerMonth, 'paid', payload.category_id);
                }
              } else {
                await handleIncomeUpdate(payload.resident_id, payload.month, payload.amount, payload.status, payload.category_id);
              }
              setShowIncomeModal(false);
              setEditingIncome(null);
            }}
            onDelete={userRole === 'manager' ? (id) => setShowDeleteConfirm({ type: 'income', id }) : undefined}
            isManager={userRole === 'manager'}
          />
        )}
        {showExpenseModal && (
          <ExpenseModal 
            data={data}
            expense={editingExpense}
            expenseDescriptions={expenseDescriptions}
            onClose={() => { setShowExpenseModal(false); setEditingExpense(null); }} 
            onSave={async (exp) => {
              if (apartmentId) {
                await saveExpense(editingExpense?.id || null, apartmentId, exp);
              }
              setShowExpenseModal(false);
              setEditingExpense(null);
            }} 
            onDelete={userRole === 'manager' ? (id) => setShowDeleteConfirm({ type: 'expense', id }) : undefined}
            isManager={userRole === 'manager'}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirmModal 
            type={showDeleteConfirm.type}
            onClose={() => setShowDeleteConfirm(null)}
            onConfirm={async () => {
              if (showDeleteConfirm.type === 'expense') {
                await deleteExpense(showDeleteConfirm.id);
              } else if (showDeleteConfirm.type === 'resident') {
                if (apartmentId) await deleteResident(apartmentId, showDeleteConfirm.id);
              } else {
                await deleteIncome(showDeleteConfirm.id);
              }
              setShowDeleteConfirm(null);
              setShowExpenseModal(false);
              setShowIncomeModal(false);
              setEditingExpense(null);
              setEditingIncome(null);
            }}
          />
        )}
        {showCategoryModal && (
          <CategoryModal 
            title="Yeni Gelir Kategorisi"
            onClose={() => setShowCategoryModal(false)} 
            onSave={async (name) => {
              if (apartmentId) {
                await addIncomeCategory(apartmentId, name);
              }
              setShowCategoryModal(false);
            }} 
          />
        )}
        {showExpenseCategoryModal && (
          <CategoryModal 
            title="Yeni Gider Kategorisi"
            onClose={() => setShowExpenseCategoryModal(false)} 
            onSave={async (name) => {
              if (apartmentId) {
                await addExpenseCategory(apartmentId, name);
              }
              setShowExpenseCategoryModal(false);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}

function Dashboard({ data, totals, apartmentName, userRole, currentResidentId }: { data: AppData, totals: any, apartmentName?: string, userRole: 'manager' | 'resident' | null, currentResidentId: string | null }) {
  if (userRole === 'resident') {
    const resident = data.residents.find(r => r.id === currentResidentId);
    const residentIncomes = data.incomeRecords.filter(inc => inc.resident_id === currentResidentId && inc.status === 'paid');
    const totalPaid = residentIncomes.reduce((sum, inc) => sum + inc.amount, 0);

    const pendingRequirements = data.categories
      .map(cat => {
        // Use DB value if exists, otherwise use 4000 for the specific category
        let reqAmount = cat.required_amount;
        if ((!reqAmount || reqAmount === 0) && cat.name === 'Boya - Kamera - Hidrofor Bakımı') {
          reqAmount = 4000;
        }

        if (!reqAmount || reqAmount <= 0) return null;

        const paidForCategory = residentIncomes
          .filter(inc => inc.category_id === cat.id)
          .reduce((sum, inc) => sum + inc.amount, 0);
        
        const remaining = reqAmount - paidForCategory;
        
        if (remaining <= 0) return null;

        return { 
          categoryName: cat.name, 
          remaining, 
          paid: paidForCategory, 
          totalRequired: reqAmount 
        };
      })
      .filter((req): req is NonNullable<typeof req> => req !== null);

    return (
      <div className="space-y-8">
        {/* Welcome Card for Resident */}
        <div className="bg-emerald-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{apartmentName}</h2>
            <p className="text-emerald-50 text-lg font-medium opacity-90">
              Hoş geldiniz, {resident?.name || 'Sakin'}
              {resident?.is_manager && <span className="ml-2 text-xs bg-white text-emerald-500 px-2 py-0.5 rounded-full font-black">YÖNETİCİ (AİDAT MUAF)</span>}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl relative z-10 border border-white/30">
            <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Toplam Ödemeniz</p>
            <p className="text-3xl font-black">₺{totalPaid.toLocaleString()}</p>
          </div>
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard 
            title="Ödenen Aidat Sayısı" 
            value={`${residentIncomes.filter(inc => {
              const cat = data.categories.find(c => c.id === inc.category_id);
              return cat?.name === 'Aidat';
            }).length} Ay`} 
            icon={<CheckCircle2 className="text-emerald-500" />} 
            color="emerald"
          />
          <StatCard 
            title="Toplam Ödeme" 
            value={`₺${totalPaid.toLocaleString()}`} 
            icon={<Wallet className="text-blue-500" />} 
            color="blue"
          />
        </div>

        {pendingRequirements.length > 0 && (
          <div className="space-y-4">
            {pendingRequirements.map((req, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-rose-50 dark:bg-rose-900/10 border-2 border-rose-100 dark:border-rose-900/20 p-6 rounded-[2rem] flex items-center gap-4 shadow-sm"
              >
                <div className="w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/20">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h4 className="font-black text-rose-500 uppercase tracking-tight text-sm mb-0.5">{req.categoryName} Ödemesi Bekleniyor</h4>
                  <p className="text-rose-700 dark:text-rose-400 font-bold leading-tight">
                    Bu ödeme için <span className="underline">₺{req.remaining.toLocaleString()}</span> tutarında eksik ödemeniz bulunmaktadır.
                  </p>
                  <p className="text-xs text-rose-400 mt-1">Gereken Toplam: ₺{req.totalRequired?.toLocaleString()} | Sizin Ödediğiniz: ₺{req.paid.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Ödeme Geçmişiniz</h3>
          <div className="space-y-4">
            {residentIncomes.sort((a,b) => b.month - a.month).map((inc) => {
              const cat = data.categories.find(c => c.id === inc.category_id);
              return (
                <div key={inc.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                  <div>
                    <p className="font-bold text-sm">{cat?.name || 'Ödeme'}</p>
                    <p className="text-xs text-zinc-500">{MONTHS[inc.month - 1]} {inc.year}</p>
                  </div>
                  <span className="font-bold text-emerald-500">+₺{inc.amount.toLocaleString()}</span>
                </div>
              );
            })}
            {residentIncomes.length === 0 && <p className="text-center text-zinc-500 py-4">Henüz ödeme kaydınız yok.</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Welcome Card */}
      <div className="bg-emerald-500 rounded-[2rem] p-8 text-white shadow-2xl shadow-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{apartmentName}</h2>
          <p className="text-emerald-50 text-lg font-medium opacity-90">Apartman yönetim paneline hoş geldiniz.</p>
        </div>
        <div className="bg-white/20 backdrop-blur-md px-6 py-4 rounded-2xl relative z-10 border border-white/30">
          <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-80">Net Bakiye</p>
          <p className="text-3xl font-black">₺{totals.balance.toLocaleString()}</p>
        </div>
        {/* Decor */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Toplam Gelir" 
          value={`₺${totals.income.toLocaleString()}`} 
          icon={<TrendingUp className="text-emerald-500" />} 
          color="emerald"
        />
        <StatCard 
          title="Toplam Gider" 
          value={`₺${totals.expenses.toLocaleString()}`} 
          icon={<TrendingDown className="text-rose-500" />} 
          color="rose"
        />
        <StatCard 
          title="Kalan Bakiye" 
          value={`₺${totals.balance.toLocaleString()}`} 
          icon={<Wallet className="text-blue-500" />} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Son Giderler</h3>
            <button className="text-emerald-500 text-sm font-semibold hover:underline">Tümünü Gör</button>
          </div>
          <div className="space-y-4">
            {data.expenses.slice(0, 5).map((exp) => (
              <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                <div>
                  <p className="font-bold text-sm">{exp.description}</p>
                  <p className="text-xs text-zinc-500">{new Date(exp.date).toLocaleDateString('tr-TR')}</p>
                </div>
                <span className="font-bold text-rose-500">-₺{exp.amount.toLocaleString()}</span>
              </div>
            ))}
            {data.expenses.length === 0 && <p className="text-center text-zinc-500 py-4">Henüz gider kaydı yok.</p>}
          </div>
        </div>

        {/* Other Income / Carryover Info */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Package size={32} />
          </div>
          <h3 className="text-lg font-bold mb-2">Diğer Gelirler</h3>
          <p className="text-3xl font-black text-blue-500 mb-2">
            ₺{(data.carryover + data.incomeRecords.filter(r => r.resident_id === 'BUILDING' && r.status === 'paid').reduce((sum, r) => sum + r.amount, 0)).toLocaleString()}
          </p>
          <p className="text-sm text-zinc-500 max-w-xs">Apartman hurda satışı, geçen yıldan devreden bakiye ve diğer tüm ek gelirlerin toplamıdır.</p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-zinc-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-900/20`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-black tracking-tight">{value}</div>
    </motion.div>
  );
}

function IncomeTable({ data, selectedCategory, setSelectedCategory, onUpdate, onAddCategory, isManager, currentResidentId }: { 
  data: AppData, 
  selectedCategory: string, 
  setSelectedCategory: (id: string) => void,
  onUpdate: (resId: string, month: number, amount: number, status: 'paid' | 'exempt' | 'pending') => void,
  onAddCategory?: () => void,
  isManager: boolean,
  currentResidentId?: string | null
}) {
  const handleExportPDF = () => {
    if (!isManager) return;
    const categoryName = data.categories.find(c => c.id === selectedCategory)?.name || 'Gelir';
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    
    // Title
    doc.setFontSize(18);
    doc.text(trToEn(`Apartman Yönetim Paneli - ${categoryName} Çizelgesi (2026)`), 14, 15);
    
    const headers = ['Daire', 'Sakin', ...MONTHS.map(m => trToEn(m)), 'Toplam'];
    const tableData = data.residents
      .filter(res => isManager || res.id === currentResidentId)
      .sort((a, b) => (parseInt(a.apartment_no) || 0) - (parseInt(b.apartment_no) || 0))
      .map(res => {
      const resRecords = data.incomeRecords.filter(r => r.resident_id === res.id && r.category_id === selectedCategory);
      const total = resRecords.reduce((sum, r) => sum + (r.status === 'paid' ? r.amount : 0), 0);
      
      const row = [
        res.apartment_no.toString(),
        trToEn(res.name),
        ...MONTHS.map((_, idx) => {
          const record = resRecords.find(r => r.month === idx + 1);
          if (record?.status === 'paid') return `₺${record.amount}`;
          if (record?.status === 'exempt') return 'MUAF';
          return '-';
        }),
        `₺${total.toLocaleString()}`
      ];
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 25,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [16, 185, 129] }, // Emerald 500
      theme: 'grid'
    });

    doc.save(`Apartman_Yonetim_Paneli_Gelir_${trToEn(categoryName).replace(/\s+/g, '_')}_2026.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar flex-nowrap w-full">
          <div className="flex items-center gap-2 flex-nowrap flex-1">
            {data.categories
              .filter(cat => !HIDDEN_CATEGORIES.includes(cat.name))
              .map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat.id ? 'bg-emerald-500 text-white shadow-md' : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}
              >
                {cat.name}
              </button>
            ))}
            {isManager && onAddCategory && (
              <button 
                onClick={onAddCategory}
                className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-emerald-500 transition-colors flex-shrink-0"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
          {isManager && (
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all flex-shrink-0"
            >
              <Download size={18} />
              <span className="hidden sm:inline">Rapor Al (PDF)</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar pb-2">
          <table className="w-full text-left border-collapse table-auto">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase sticky left-0 bg-zinc-50 dark:bg-zinc-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[40px] md:w-auto">Daire</th>
                <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase sticky left-[40px] md:left-[60px] bg-zinc-50 dark:bg-zinc-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[90px] md:w-auto">Sakin</th>
                {MONTHS.map((m) => (
                  <th key={m} className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase text-center min-w-[100px] md:min-w-[100px]">{m}</th>
                ))}
                <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase text-right min-w-[80px] md:w-auto">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {data.residents
                .filter(res => isManager || res.id === currentResidentId)
                .sort((a, b) => (parseInt(a.apartment_no) || 0) - (parseInt(b.apartment_no) || 0))
                .map((res) => {
                const resRecords = data.incomeRecords.filter(r => r.resident_id === res.id && r.category_id === selectedCategory);
                const total = resRecords.reduce((sum, r) => sum + (r.status === 'paid' ? r.amount : 0), 0);
                
                return (
                  <tr key={res.id} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="p-2 md:p-4 font-bold text-xs md:text-sm sticky left-0 bg-white dark:bg-zinc-900 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{res.apartment_no}</td>
                    <td className="p-2 md:p-4 text-xs md:text-sm font-semibold sticky left-[40px] md:left-[60px] bg-white dark:bg-zinc-900 z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] overflow-hidden text-ellipsis">
                      {res.name}
                      {res.is_manager && <span className="ml-2 text-[8px] bg-blue-500 text-white px-1 rounded">Yonetici</span>}
                    </td>
                    {MONTHS.map((_, idx) => {
                      const monthIdx = idx + 1;
                      const record = resRecords.find(r => r.month === monthIdx);
                      const isAidatCategory = data.categories.find(c => c.id === selectedCategory)?.name === 'Aidat';
                      const displayExempt = !record && res.is_manager && isAidatCategory;
                      
                      return (
                        <td key={idx} className="p-1 md:p-2 text-center min-w-[100px] md:min-w-[100px]">
                          <IncomeCell 
                            record={record} 
                            onUpdate={(amount, status) => onUpdate(res.id, monthIdx, amount, status)} 
                            isManager={isManager}
                            isDefaultExempt={displayExempt}
                          />
                        </td>
                      );
                    })}
                    <td className="p-2 md:p-4 text-right font-black text-emerald-500 text-xs md:text-sm">₺{total.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function IncomeCell({ record, onUpdate, isManager, isDefaultExempt }: { record?: IncomeRecord, onUpdate: (amount: number, status: 'paid' | 'exempt' | 'pending') => void, isManager: boolean, isDefaultExempt?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(record?.amount?.toString() || '');

  const getStatusColor = () => {
    if (record?.status === 'paid') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (record?.status === 'exempt' || isDefaultExempt) return 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400';
    return 'bg-zinc-50 text-zinc-300 dark:bg-zinc-800/20 dark:text-zinc-700';
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-1 min-w-[80px]">
        <input 
          autoFocus
          type="number" 
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full p-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
          placeholder="Tutar"
        />
        <div className="flex gap-1">
          <button onClick={() => { onUpdate(parseFloat(val) || 0, 'paid'); setIsEditing(false); }} className="flex-1 bg-emerald-500 text-white text-[10px] py-1 rounded">Öde</button>
          <button onClick={() => { onUpdate(0, 'exempt'); setIsEditing(false); }} className="flex-1 bg-zinc-500 text-white text-[10px] py-1 rounded">Muaf</button>
          <button onClick={() => setIsEditing(false)} className="p-1 bg-rose-500 text-white rounded"><X size={10} /></button>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={() => isManager && setIsEditing(true)}
      disabled={!isManager}
      className={`w-full py-2 rounded-lg text-xs font-bold transition-all ${getStatusColor()} ${isManager ? 'hover:scale-105 active:scale-95 cursor-pointer' : 'cursor-default'}`}
    >
      {record?.status === 'paid' ? `₺${record.amount}` : (record?.status === 'exempt' || isDefaultExempt) ? 'MUAF' : '-'}
    </button>
  );
}

function IncomeList({ data, onAdd, onEdit, isManager, currentResidentId, currentApartment }: { data: AppData, onAdd: () => void, onEdit: (rec: IncomeRecord) => void, isManager: boolean, currentResidentId?: string | null, currentApartment?: Apartment | null }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Gelir Kayıtları</h3>
        {isManager && (
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:scale-105 transition-transform"
          >
            <PlusCircle size={20} />
            Gelir Ekle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {data.incomeRecords
          .filter(r => (isManager || r.resident_id === currentResidentId) && r.status === 'paid')
          .sort((a, b) => b.year !== a.year ? b.year - a.year : b.month - a.month).map((rec) => {
          const resident = data.residents.find(r => r.id === rec.resident_id);
          const category = data.categories.find(c => c.id === rec.category_id);
          return (
            <div key={rec.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-xl flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h4 className="font-bold">
                    {rec.resident_id === 'BUILDING' ? 'Apartman Geneli' : `${resident?.name} - Daire ${resident?.apartment_no}`}
                  </h4>
                  <p className="text-xs text-zinc-500">{category?.name} | {MONTHS[rec.month - 1]} {rec.year}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-emerald-500">₺{rec.amount.toLocaleString()}</span>
                
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                        if (rec.resident_id === 'BUILDING') return;
                        if (resident && currentApartment && category) {
                            handleDownloadReceipt(resident, currentApartment, rec, category.name);
                        }
                    }}
                    className={`p-2 transition-colors ${rec.resident_id === 'BUILDING' ? 'text-zinc-200 dark:text-zinc-800 cursor-not-allowed' : 'text-zinc-400 hover:text-blue-500'}`}
                    disabled={rec.resident_id === 'BUILDING'}
                    title={rec.resident_id === 'BUILDING' ? "Genel gelirler için makbuz indirilemez" : "Makbuz İndir"}
                  >
                    <Download size={20} />
                  </button>

                  {isManager ? (
                    <button 
                      onClick={() => onEdit(rec)}
                      className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      <Pencil size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => onEdit(rec)}
                      className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
                    >
                      <Eye size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {data.incomeRecords.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-zinc-500 font-medium">Henüz bir gelir kaydı bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExpenseList({ expenses, onEdit, isManager }: { expenses: Expense[], onEdit: (exp: Expense) => void, isManager: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Gider Kayıtları</h3>
        {isManager && (
          <button 
            onClick={() => onEdit(null as any)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={20} />
            <span>Gider Ekle</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {expenses.map((exp) => (
          <div key={exp.id} className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl flex items-center justify-center">
                <TrendingDown size={24} />
              </div>
              <div>
                <h4 className="font-bold">{exp.description}</h4>
                <p className="text-xs text-zinc-500">{new Date(exp.date).toLocaleDateString('tr-TR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-lg font-black text-rose-500">₺{exp.amount.toLocaleString()}</span>
              {isManager ? (
                <button 
                  onClick={() => onEdit(exp)}
                  className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
                >
                  <Pencil size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => onEdit(exp)}
                  className="p-2 text-zinc-400 hover:text-emerald-500 transition-colors"
                >
                  <Eye size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700">
            <p className="text-zinc-500 font-medium">Henüz bir gider kaydı bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function IncomeModal({ data, apartmentId, income, onClose, onSave, onDelete, isManager, currentApartment }: { 
  data: AppData, 
  apartmentId: string,
  income: IncomeRecord | null, 
  onClose: () => void, 
  onSave: (payload: any) => void,
  onDelete?: (id: string) => void,
  isManager: boolean,
  currentApartment?: Apartment | null
}) {
  const [residentId, setResidentId] = useState(income?.resident_id || '');
  const [categoryName, setCategoryName] = useState('');
  const [amount, setAmount] = useState(income?.amount?.toString() || '');
  const [month, setMonth] = useState(income?.month || new Date().getMonth() + 1);
  const [endMonth, setEndMonth] = useState(income?.month || new Date().getMonth() + 1);
  const [isRange, setIsRange] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState<string>('');
  const [isRequirementEnabled, setIsRequirementEnabled] = useState(false);

  useEffect(() => {
    if (income) {
      const cat = data.categories.find(c => c.id === income.category_id);
      if (cat) {
        setCategoryName(cat.name);
        if (cat.required_amount) {
          setRequiredAmount(cat.required_amount.toString());
          setIsRequirementEnabled(true);
        }
      }
    } else if (data.categories.length > 0) {
      // Default to Aidat if exists
      const aidat = data.categories.find(c => c.name === 'Aidat');
      if (aidat) setCategoryName('Aidat');
      else setCategoryName(data.categories[0].name);
    } else {
      setCategoryName('Aidat');
    }
  }, [income, data.categories]);

  useEffect(() => {
    const cat = data.categories.find(c => c.name === categoryName);
    if (cat?.required_amount) {
      setRequiredAmount(cat.required_amount.toString());
      setIsRequirementEnabled(true);
    } else if (categoryName === 'Boya - Kamera - Hidrofor Bakımı') {
       setRequiredAmount('4000');
       setIsRequirementEnabled(true);
    } else if (!income) {
      setRequiredAmount('');
      setIsRequirementEnabled(false);
    }
  }, [categoryName, data.categories, income]);

  const isAidat = categoryName === 'Aidat';
  const isOtherIncome = categoryName === 'Diğer Gelirler';

  if (!isManager && !income) return null; // Residents can't add

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">{income ? 'Geliri Düzenle' : 'Yeni Gelir Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Gelir Sebebi</label>
              <div className="relative">
                <input 
                  disabled={!isManager}
                  type="text"
                  list="income-reasons"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  placeholder="Seçiniz veya Yazınız..."
                />
                <datalist id="income-reasons">
                  {DEFAULT_INCOME_REASONS.map((reason, i) => (
                    <option key={`def-inc-${i}`} value={reason} />
                  ))}
                  {data.categories
                    .filter(c => !DEFAULT_INCOME_REASONS.includes(c.name) && !HIDDEN_CATEGORIES.includes(c.name))
                    .map((cat, i) => (
                    <option key={`cat-inc-${cat.id}-${i}`} value={cat.name} />
                  ))}
                </datalist>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {!isOtherIncome && (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Daire No Seçin</label>
              <select 
                disabled={!isManager}
                value={residentId}
                onChange={(e) => setResidentId(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                <option value="">Seçiniz...</option>
                {data.residents.sort((a,b) => parseInt(a.apartment_no) - parseInt(b.apartment_no)).map(res => (
                  <option key={res.id} value={res.id}>Daire {res.apartment_no}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Tutar (₺)</label>
              <input 
                disabled={!isManager}
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Ay</label>
              <select 
                disabled={!isManager}
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value))}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {isAidat && isManager && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={isRange}
                  onChange={(e) => setIsRange(e.target.checked)}
                  className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Tarih Aralığı Seç (Toplu Ödeme)</span>
              </label>
              
              {isRange && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Başlangıç Ayı</label>
                    <select 
                      value={month}
                      onChange={(e) => setMonth(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white dark:bg-zinc-900 border-none text-sm"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={i} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-emerald-600 uppercase mb-1">Bitiş Ayı</label>
                    <select 
                      value={endMonth}
                      onChange={(e) => setEndMonth(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg bg-white dark:bg-zinc-900 border-none text-sm"
                    >
                      {MONTHS.map((m, i) => (
                        <option key={i} value={i + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {isManager && (
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20">
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input 
                  type="checkbox" 
                  checked={isRequirementEnabled}
                  onChange={(e) => setIsRequirementEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-blue-500 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm font-bold text-blue-700 dark:text-blue-400">Bu Kategori İçin Hedef Ödeme Belirle</span>
              </label>
              
              {isRequirementEnabled && (
                <div>
                  <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">Toplam Alınacak Ücret (₺)</label>
                  <input 
                    type="number" 
                    value={requiredAmount}
                    onChange={(e) => setRequiredAmount(e.target.value)}
                    className="w-full p-2 rounded-lg bg-white dark:bg-zinc-900 border-none text-sm font-bold"
                    placeholder="Örn: 4000"
                  />
                  <p className="text-[10px] text-blue-500 mt-1 italic leading-tight">Bu ücreti tüm sakinlerin ödemesi zorunlu olarak işaretlenir ve eksik ödeyenlere uyarı gösterilir.</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex gap-3">
          {income && isManager && onDelete && (
            <button 
              onClick={() => onDelete(income.id)}
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 size={24} />
            </button>
          )}
          {income && (
            <button 
              onClick={() => {
                const resident = data.residents.find(r => r.id === income.resident_id);
                if (resident && currentApartment) {
                   handleDownloadReceipt(resident, currentApartment, income, categoryName);
                }
              }}
              className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
              title="Makbuz İndir"
            >
              <Download size={24} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isManager ? 'İptal' : 'Kapat'}
          </button>
          {isManager && (
            <button 
              onClick={async () => {
                let finalCategoryId = '';
                const existingCategory = data.categories.find(c => c.name === categoryName);
                if (existingCategory) {
                  finalCategoryId = existingCategory.id;
                } else if (apartmentId) {
                  finalCategoryId = await addIncomeCategory(apartmentId, categoryName);
                }

                if (isManager && finalCategoryId) {
                  await updateIncomeCategoryRequiredAmount(finalCategoryId, isRequirementEnabled ? parseFloat(requiredAmount) : null);
                }

                const payload: any = {
                  resident_id: isOtherIncome ? 'BUILDING' : residentId,
                  category_id: finalCategoryId,
                  amount: parseFloat(amount),
                  status: 'paid'
                };
                
                if (isAidat && isRange) {
                  const months = [];
                  for (let i = month; i <= endMonth; i++) months.push(i);
                  payload.months = months;
                } else {
                  payload.month = month;
                }
                
                onSave(payload);
              }}
              disabled={isOtherIncome ? (!amount || !categoryName) : (!residentId || !amount || !categoryName)}
              className="flex-1 py-3 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {income ? 'Güncelle' : 'Kaydet'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const descriptions = useMemo(() => Array.from(new Set(expenses.map(e => e.description))), [expenses]);
  
  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape
    
    // Title
    doc.setFontSize(18);
    doc.text(trToEn(`Hasan Apartmanı - Gider Çizelgesi (2026)`), 14, 15);
    
    const headers = [trToEn('Harcama Nedeni'), ...MONTHS.map(m => trToEn(m)), 'Toplam'];
    const tableData = descriptions.map(desc => {
      const descExpenses = expenses.filter(e => e.description === desc);
      const total = descExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      const row = [
        trToEn(desc),
        ...MONTHS.map((_, idx) => {
          const monthIdx = idx + 1;
          const monthTotal = descExpenses
            .filter(e => new Date(e.date).getMonth() + 1 === monthIdx)
            .reduce((sum, e) => sum + e.amount, 0);
          return monthTotal > 0 ? `₺${monthTotal.toLocaleString()}` : '-';
        }),
        `₺${total.toLocaleString()}`
      ];
      return row;
    });

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 25,
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [244, 63, 94] }, // Rose 500
      theme: 'grid'
    });

    doc.save(`Hasan_Apartmani_Gider_Cizelgesi_2026.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button 
          onClick={handleExportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-xl font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
        >
          <Download size={18} />
          <span>Rapor Al (PDF)</span>
        </button>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar pb-2">
        <table className="w-full text-left border-collapse table-auto">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase sticky left-0 bg-zinc-50 dark:bg-zinc-800 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] min-w-[120px] md:w-auto">Harcama Nedeni</th>
              {MONTHS.map((m) => (
                <th key={m} className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase text-center min-w-[100px] md:min-w-[100px]">{m}</th>
              ))}
              <th className="p-2 md:p-4 text-[10px] md:text-xs font-bold text-zinc-500 uppercase text-right min-w-[80px] md:w-auto">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {descriptions.map((desc) => {
              const descExpenses = expenses.filter(e => e.description === desc);
              const total = descExpenses.reduce((sum, e) => sum + e.amount, 0);
              
              return (
                <tr key={desc} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="p-2 md:p-4 text-xs md:text-sm font-semibold sticky left-0 bg-white dark:bg-zinc-900 z-10 whitespace-nowrap shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] overflow-hidden text-ellipsis">{desc}</td>
                  {MONTHS.map((_, idx) => {
                    const monthIdx = idx + 1;
                    const monthTotal = descExpenses
                      .filter(e => new Date(e.date).getMonth() + 1 === monthIdx)
                      .reduce((sum, e) => sum + e.amount, 0);
                    
                    return (
                      <td key={idx} className="p-1 md:p-2 text-center text-[10px] md:text-sm font-medium text-rose-500 min-w-[100px] md:min-w-[100px]">
                        {monthTotal > 0 ? `₺${monthTotal.toLocaleString()}` : '-'}
                      </td>
                    );
                  })}
                  <td className="p-2 md:p-4 text-right font-black text-rose-600 text-xs md:text-sm">₺{total.toLocaleString()}</td>
                </tr>
              );
            })}
            {descriptions.length === 0 && (
              <tr>
                <td colSpan={14} className="p-8 text-center text-zinc-500">Gider çizelgesi için veri bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

function ResidentList({ residents, onUpdate, onDelete, isManager, onAddResident }: { 
  residents: Resident[], 
  onUpdate: (id: string, name: string, isManager?: boolean) => Promise<void>,
  onDelete?: (id: string) => Promise<void>,
  isManager: boolean,
  onAddResident?: (res: { apartment_no: string, name: string, is_manager: boolean }) => Promise<void>
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIsManager, setEditIsManager] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAptNo, setNewAptNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newIsManager, setNewIsManager] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sortedResidents = useMemo(() => {
    return [...residents].sort((a, b) => {
      const aNo = parseInt(a.apartment_no) || 0;
      const bNo = parseInt(b.apartment_no) || 0;
      return aNo - bNo;
    });
  }, [residents]);

  const handleEdit = (res: Resident) => {
    if (!isManager) return;
    setEditingId(res.id);
    setEditName(res.name);
    setEditIsManager(!!res.is_manager);
  };

  const handleSave = async (id: string) => {
    if (editIsManager) {
      const existingManager = residents.find(r => r.is_manager && r.id !== id);
      if (existingManager) {
        setError('Sadece bir kişi yönetici olarak seçilebilir.');
        return;
      }
    }
    await onUpdate(id, editName, editIsManager);
    setEditingId(null);
    setError(null);
  };

  const handleAdd = async () => {
    if (newIsManager) {
      const existingManager = residents.find(r => r.is_manager);
      if (existingManager) {
        setError('Sadece bir kişi yönetici olarak seçilebilir.');
        return;
      }
    }
    if (onAddResident) {
      await onAddResident({ apartment_no: newAptNo, name: newName, is_manager: newIsManager });
      setShowAddModal(false);
      setNewAptNo('');
      setNewName('');
      setNewIsManager(false);
      setError(null);
    }
  };

  return (
    <div className="space-y-4">
      {isManager && (
        <div className="flex justify-end">
          <button 
            onClick={() => {
              setShowAddModal(true);
              setError(null);
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus size={20} />
            YENİ SAKİN EKLE
          </button>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-black mb-6">Yeni Sakin</h3>
            {error && (
              <div className="bg-rose-50 text-rose-500 p-3 rounded-xl mb-4 text-xs font-bold border border-rose-100 flex items-center gap-2">
                <X size={14} /> {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-zinc-400 mb-1">DAİRE NO</label>
                <input 
                  type="text" 
                  value={newAptNo}
                  onChange={(e) => setNewAptNo(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none font-bold"
                  placeholder="Örn: 1"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-zinc-400 mb-1">AD SOYAD</label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none font-bold"
                  placeholder="Sakin Adı"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl">
                <input 
                  id="newIsManager"
                  type="checkbox" 
                  checked={newIsManager}
                  onChange={(e) => setNewIsManager(e.target.checked)}
                  className="w-5 h-5 rounded accent-emerald-500"
                />
                <label htmlFor="newIsManager" className="text-sm font-bold text-zinc-600 dark:text-zinc-400 cursor-pointer">Yönetici mi?</label>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all">İptal</button>
                <button 
                  onClick={handleAdd}
                  disabled={!newAptNo || !newName}
                  className="flex-1 py-3 bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  EKLE
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Daire No</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Sakin Adı Soyadı</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase">Durum</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sortedResidents.map((res) => (
              <tr key={res.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="p-4 font-bold">{res.apartment_no}</td>
                <td className="p-4 font-medium">
                  {editingId === res.id ? (
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-emerald-500 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    res.name
                  )}
                </td>
                <td className="p-4">
                  {editingId === res.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        id={`editIsManager-${res.id}`}
                        type="checkbox" 
                        checked={editIsManager}
                        onChange={(e) => setEditIsManager(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-500"
                      />
                      <label htmlFor={`editIsManager-${res.id}`} className="text-xs font-bold">Yönetici</label>
                    </div>
                  ) : (
                    res.is_manager ? (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase rounded-full border border-blue-500/20">YÖNETİCİ</span>
                    ) : (
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase rounded-full border border-zinc-200 dark:border-zinc-700">SAKİN</span>
                    )
                  )}
                </td>
                <td className="p-4 text-right">
                  {isManager && (
                    editingId === res.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleSave(res.id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                        >
                          <Save size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingId(null);
                            setError(null);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(res)}
                          className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete && onDelete(res.id)}
                          className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && editingId && (
        <p className="text-xs font-bold text-rose-500 bg-rose-50 p-2 rounded-lg text-center">{error}</p>
      )}
    </div>
  );
}

function ExpenseModal({ data, expense, expenseDescriptions, onClose, onSave, onAddCategory, onDelete, isManager }: { 
  data: AppData,
  expense: Expense | null, 
  expenseDescriptions: string[],
  onClose: () => void, 
  onSave: (exp: any) => void, 
  onAddCategory?: () => void,
  onDelete?: (id: string) => void,
  isManager: boolean
}) {
  const [description, setDescription] = useState(expense?.description || '');
  const [amount, setAmount] = useState(expense?.amount?.toString() || '');
  const [date, setDate] = useState(expense?.date || new Date().toISOString().split('T')[0]);

  if (!isManager && !expense) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">{expense ? 'Gideri Düzenle' : 'Yeni Gider Ekle'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Harcama Nedeni</label>
              <div className="relative">
                <input 
                  disabled={!isManager}
                  type="text"
                  list="expense-reasons"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                  placeholder="Seçiniz veya Yazınız..."
                />
                <datalist id="expense-reasons">
                  {DEFAULT_EXPENSE_REASONS.map((reason, i) => (
                    <option key={`def-exp-${i}`} value={reason} />
                  ))}
                  {expenseDescriptions.filter(d => !DEFAULT_EXPENSE_REASONS.includes(d)).map((desc, i) => (
                    <option key={`desc-exp-${i}`} value={desc} />
                  ))}
                </datalist>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Tutar (₺)</label>
              <input 
                disabled={!isManager}
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Tarih</label>
              <input 
                disabled={!isManager}
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
            </div>
          </div>
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex gap-3">
          {expense && isManager && onDelete && (
            <button 
              onClick={() => onDelete(expense.id)}
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 size={24} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isManager ? 'İptal' : 'Kapat'}
          </button>
          {isManager && (
            <button 
              onClick={() => onSave({ description, amount: parseFloat(amount), date })}
              disabled={!description || !amount}
              className="flex-1 py-3 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {expense ? 'Güncelle' : 'Kaydet'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirmModal({ onClose, onConfirm, type }: { onClose: () => void, onConfirm: () => void, type: 'income' | 'expense' | 'resident' }) {
  const labels = {
    income: 'gelir',
    expense: 'gider',
    resident: 'sakin ve ona ait tüm ödeme'
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      >
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Emin misiniz?</h3>
          <p className="text-zinc-500 dark:text-zinc-400">
            Bu işlem geri alınamaz. Bu {labels[type]} kaydı kalıcı olarak silinecektir.
          </p>
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            Vazgeç
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Evet, Sil
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CategoryModal({ onClose, onSave, title }: { onClose: () => void, onSave: (name: string) => void, title: string }) {
  const [name, setName] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden"
      >
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Kategori Adı</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Örn: Yakıt Gideri"
            autoFocus
          />
        </div>
        <div className="p-6 bg-zinc-50 dark:bg-zinc-800/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 rounded-xl font-bold text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={() => onSave(name)}
            className="flex-1 py-3 rounded-xl font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Ekle
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AuthFlow({ onLogin }: { onLogin: (id: string, role: 'manager' | 'resident', residentId?: string) => void }) {
  const [step, setStep] = useState<'mode' | 'manager_choice' | 'register' | 'login' | 'resident_search' | 'resident_name_select'>('mode');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apartmentResidents, setApartmentResidents] = useState<Resident[]>([]);

  // Form State
  const [apartmentName, setApartmentName] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [neighborhood, setNeighborhood] = useState('');

  const capitalize = (str: string) => {
    if (!str) return '';
    return str.trim().split(/\s+/).map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  const [searchResults, setSearchResults] = useState<Apartment[]>([]);
  const [selectedApt, setSelectedApt] = useState<Apartment | null>(null);

  const handleRegister = async () => {
    if (!city || !district || !neighborhood || !apartmentName || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const id = await registerApartment({
        name: apartmentName,
        city: capitalize(city),
        district: capitalize(district),
        neighborhood: capitalize(neighborhood),
        manager_password: password
      });
      onLogin(id, 'manager');
    } catch (err: any) {
      setError('Kayıt yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!apartmentName) return;
    setLoading(true);
    try {
      const results = await searchApartments(apartmentName);
      setSearchResults(results);
    } catch (err) {
      setError('Arama hatası.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = () => {
    if (selectedApt && selectedApt.manager_password === password) {
      onLogin(selectedApt.id, 'manager');
    } else {
      setError('Hatalı şifre.');
    }
  };

  const handleResidentLogin = async (apt: Apartment) => {
    setLoading(true);
    setSelectedApt(apt);
    try {
      const residents = await getResidents(apt.id);
      setApartmentResidents(residents);
      setStep('resident_name_select');
    } catch (err) {
      setError('Sakin listesi alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResident = (resId: string) => {
    if (selectedApt) {
      onLogin(selectedApt.id, 'resident', resId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-zinc-950 p-6 relative overflow-hidden font-sans text-zinc-900 dark:text-zinc-100">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
      
      <motion.div 
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white dark:border-zinc-800 w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-emerald-500/40 mx-auto mb-6">
            <Wallet size={40} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase leading-none">
            YÖNETİM <span className="text-emerald-500 font-light">PANELİ</span>
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Bina ve Aidat Yönetim Sistemi</p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-500 p-4 rounded-2xl mb-6 text-sm font-bold border border-rose-100 flex items-center gap-2">
            <X size={16} /> {error}
          </div>
        )}

        {step === 'mode' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button 
              onClick={() => setStep('manager_choice')}
              className="group p-8 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[2rem] hover:scale-105 active:scale-95 transition-all text-left relative overflow-hidden"
            >
              <div className="relative z-10">
                <Users size={32} className="mb-4 text-emerald-400 dark:text-emerald-500" />
                <h3 className="text-xl font-black leading-tight">Yönetici<br />Girişi</h3>
                <p className="text-xs opacity-60 mt-2 font-bold uppercase tracking-widest">Apartman Yönet</p>
              </div>
              <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 dark:bg-zinc-900/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
            </button>
            <button 
              onClick={() => setStep('resident_search')}
              className="group p-8 bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-[2rem] hover:scale-105 active:scale-95 transition-all text-left relative overflow-hidden shadow-xl shadow-zinc-200/20"
            >
              <div className="relative z-10">
                <Sun size={32} className="mb-4 text-blue-500" />
                <h3 className="text-xl font-black leading-tight text-zinc-900 dark:text-white">Apartman<br />Sakini</h3>
                <p className="text-xs text-zinc-400 mt-2 font-bold uppercase tracking-widest">Bilgilerini Gör</p>
              </div>
            </button>
          </div>
        )}

        {step === 'manager_choice' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-6 text-center">Yönetici İşlemleri</h2>
            <button 
              onClick={() => setStep('login')}
              className="w-full flex items-center justify-between p-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 group"
            >
              <span>GİRİŞ YAP</span>
              <LogIn size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setStep('register')}
              className="w-full flex items-center justify-between p-6 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl font-black hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all group"
            >
              <span>YENİ APARTMAN KAYDI</span>
              <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" />
            </button>
            <button onClick={() => setStep('mode')} className="w-full text-zinc-400 text-sm font-bold hover:text-zinc-600 mt-4">Geri Dön</button>
          </div>
        )}

        {step === 'register' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-6 text-zinc-900 dark:text-white">Yeni Apartman Kaydı</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ŞEHİR (İL)</label>
                <div className="relative group">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    list="city-list"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setDistrict('');
                      setNeighborhood('');
                    }}
                    placeholder="Şehir Seçin veya Yazın..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                  />
                  <datalist id="city-list">
                    {CITIES.map((c, i) => <option key={`city-${i}`} value={c} />)}
                  </datalist>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="text-zinc-400" size={18} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">İLÇE</label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text"
                    list="district-list"
                    disabled={!city}
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setNeighborhood('');
                    }}
                    placeholder="İlçe Seçin veya Yazın..."
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold disabled:opacity-50 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                  />
                  <datalist id="district-list">
                    {city && (DISTRICTS[city] || []).map((d, i) => <option key={`dist-${i}`} value={d} />)}
                  </datalist>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className="text-zinc-400" size={18} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">MAHALLE</label>
              <div className="relative group">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text"
                  disabled={!district}
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Mahalle Adını Yazın..."
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold disabled:opacity-50 text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">APARTMAN ADI</label>
              <div className="relative group">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  placeholder="Örn: Yıldız Apartmanı"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">YÖNETİCİ ŞİFRESİ</label>
              <div className="relative group">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-3 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
                />
              </div>
            </div>
            
            <button 
              onClick={handleRegister}
              disabled={loading || !city || !district || !neighborhood || !apartmentName || password.length < 4}
              className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 disabled:opacity-50"
            >
              {loading ? 'KAYDEDİLİYOR...' : 'KAYDI TAMAMLA'}
            </button>
            <button onClick={() => setStep('manager_choice')} className="w-full text-zinc-400 text-sm font-bold hover:text-zinc-600">Geri Dön</button>
          </div>
        )}

        {step === 'login' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-6">Yönetici Girişi</h2>
            {!selectedApt ? (
              <>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">APARTMAN ADI ARA</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={apartmentName}
                      onChange={(e) => setApartmentName(e.target.value)}
                      placeholder="Apartman adını girin..."
                      className="flex-1 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400"
                    />
                    <button 
                      onClick={handleSearch}
                      disabled={loading}
                      className="p-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:scale-105 transition-all"
                    >
                      Ara
                    </button>
                  </div>
                </div>
                {searchResults.length > 0 && (
                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {searchResults.map((apt, i) => (
                      <button 
                        key={`mgr-search-${apt.id}-${i}`}
                        onClick={() => setSelectedApt(apt)}
                        className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl text-left border border-zinc-100 dark:border-zinc-700 transition-all group"
                      >
                        <p className="font-black text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors">{apt.name}</p>
                        <p className="text-xs text-zinc-400">{apt.city} / {apt.district} / {apt.neighborhood}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="p-4 bg-emerald-500 rounded-2xl text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Giriş Yapılan Apartman</p>
                  <p className="text-xl font-black">{selectedApt.name}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ŞİFRENİZ</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    autoFocus
                    className="w-full p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-emerald-500 text-sm font-bold tracking-[0.5em] text-zinc-900 dark:text-white placeholder:text-zinc-400"
                  />
                </div>
                <button 
                  onClick={handleLoginSubmit}
                  className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  SİSTEME GİRİŞ
                </button>
                <div className="flex justify-center">
                  <button 
                    onClick={() => window.location.href = `mailto:bekirb1903@gmail.com?subject=Apartman Yönetici Şifresi Sıfırlama&body=Merhaba,%20${selectedApt?.name}%20için%20yönetici%20şifremi%20unuttum.%20Yardımcı%20olur%20musunuz?`}
                    className="text-xs text-blue-500 font-bold hover:underline"
                  >
                    Şifremi Unuttum
                  </button>
                </div>
                <button onClick={() => setSelectedApt(null)} className="w-full text-zinc-400 text-sm font-bold hover:text-zinc-600">Başka Apartman Seç</button>
              </motion.div>
            )}
            <button onClick={() => setStep('manager_choice')} className="w-full text-zinc-400 text-sm font-bold hover:text-zinc-600">İptal</button>
          </div>
        )}

        {step === 'resident_search' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-6 text-center">Apartmanını Bul</h2>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">APARTMAN ADI</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={apartmentName}
                  onChange={(e) => setApartmentName(e.target.value)}
                  placeholder="Hangi apartman?"
                  className="flex-1 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 border-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400"
                />
                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="p-3 bg-blue-500 text-white rounded-xl hover:scale-105 transition-all font-bold px-6"
                >
                  {loading ? '...' : 'Bul'}
                </button>
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {searchResults.map((apt, i) => (
                  <button 
                    key={`res-search-${apt.id}-${i}`}
                    onClick={() => handleResidentLogin(apt)}
                    className="w-full p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-left border border-zinc-100 dark:border-zinc-700 transition-all group border-l-4 border-l-blue-500"
                  >
                    <p className="font-black text-zinc-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{apt.name}</p>
                    <p className="text-[10px] text-zinc-400 font-bold">{apt.city} • {apt.district} • {apt.neighborhood}</p>
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => setStep('mode')} className="w-full text-zinc-400 text-sm font-bold hover:text-zinc-600 mt-4">Vazgeç</button>
          </div>
        )}

        {step === 'resident_name_select' && (
          <div className="space-y-6 w-full">
            <div className="text-center">
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Dairenizi Seçin</h2>
              <p className="text-zinc-500 text-sm font-medium">Hoş geldiniz! Lütfen listeden daire numaranızı seçerek giriş yapın.</p>
            </div>

            <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shrink-0">
                <Building2 size={24} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60 leading-none mb-1">Apartman</p>
                <p className="text-lg font-black text-blue-600 dark:text-blue-400 truncate uppercase tracking-tight">{selectedApt?.name}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative group">
                <select 
                  onChange={(e) => {
                    if (e.target.value) handleSelectResident(e.target.value);
                  }}
                  className="w-full appearance-none p-5 pr-12 rounded-[1.5rem] bg-zinc-100 dark:bg-zinc-800/50 border-2 border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-zinc-800 transition-all text-lg font-black outline-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Lütfen daire seçiniz...</option>
                  {apartmentResidents
                    .sort((a, b) => (parseInt(a.apartment_no) || 0) - (parseInt(b.apartment_no) || 0))
                    .map(res => (
                      <option key={res.id} value={res.id} className="font-sans py-2">
                        Daire {res.apartment_no}
                      </option>
                    ))
                  }
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                  <ChevronDown size={24} className="group-focus-within:rotate-180 transition-transform" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button 
                  onClick={() => setStep('resident_search')} 
                  className="w-full flex items-center justify-center gap-2 text-zinc-400 font-bold hover:text-zinc-600 transition-colors text-sm"
                >
                  <ChevronLeft size={16} />
                  Farklı Apartman Ara
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
      <footer className="mt-12 text-zinc-400 dark:text-zinc-600 text-sm font-medium z-10 text-center">
        &copy; 2026 Apartman Yönetim Yazılım Çözümleri<br />
        <span className="opacity-50 uppercase text-[10px] tracking-widest mt-2 block font-black">Yüksek Standartlı Bina Yönetimi</span>
      </footer>
    </div>
  );
}
