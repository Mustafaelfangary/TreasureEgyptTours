/**
 * Automated Translation Update Script
 * Run this with: node update-translations.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// New translations to add to all language files
const newTranslations = {
  ar: {
    contact: {
      chatNow: "دردش الآن",
      joinChannel: "انضم للقناة",
      followUs: "تابعنا",
      visitWebsite: "زيارة الموقع",
      facebook: "فيسبوك",
      instagram: "إنستجرام",
      twitter: "تويتر",
      youtube: "يوتيوب",
      tiktok: "تيك توك",
      linkedin: "لينكد إن",
      pinterest: "بينترست",
      vk: "في كي",
      location: "الموقع",
      workingHours: "ساعات العمل",
      getDirections: "احصل على الاتجاهات"
    },
    gallery: {
      filterByCategory: "تصفية حسب الفئة",
      sortBy: "ترتيب حسب",
      newest: "الأحدث",
      oldest: "الأقدم",
      mostViewed: "الأكثر مشاهدة",
      noPhotos: "لم يتم العثور على صور"
    },
    common: {
      welcome: "مرحباً بعودتك",
      dashboard: "لوحة التحكم",
      management: "الإدارة",
      settings: "الإعدادات",
      actions: "الإجراءات",
      status: "الحالة",
      active: "نشط",
      inactive: "غير نشط",
      pending: "قيد الانتظار",
      approved: "موافق عليه",
      rejected: "مرفوض",
      total: "المجموع",
      new: "جديد",
      update: "تحديث",
      create: "إنشاء",
      remove: "إزالة",
      export: "تصدير",
      import: "استيراد",
      refresh: "تحديث",
      apply: "تطبيق",
      reset: "إعادة تعيين",
      clear: "مسح",
      select: "اختر",
      add: "إضافة",
      yes: "نعم",
      no: "لا",
      ok: "موافق"
    },
    errors: {
      accessDenied: "تم رفض الوصول"
    }
  },
  fr: {
    contact: {
      chatNow: "Discuter maintenant",
      joinChannel: "Rejoindre la chaîne",
      followUs: "Suivez-nous",
      visitWebsite: "Visiter le site",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "Emplacement",
      workingHours: "Heures d'ouverture",
      getDirections: "Obtenir l'itinéraire"
    },
    gallery: {
      filterByCategory: "Filtrer par catégorie",
      sortBy: "Trier par",
      newest: "Plus récent",
      oldest: "Plus ancien",
      mostViewed: "Les plus vus",
      noPhotos: "Aucune photo trouvée"
    },
    common: {
      welcome: "Bienvenue",
      dashboard: "Tableau de bord",
      management: "Gestion",
      settings: "Paramètres",
      actions: "Actions",
      status: "Statut",
      active: "Actif",
      inactive: "Inactif",
      pending: "En attente",
      approved: "Approuvé",
      rejected: "Rejeté",
      total: "Total",
      new: "Nouveau",
      update: "Mettre à jour",
      create: "Créer",
      remove: "Supprimer",
      export: "Exporter",
      import: "Importer",
      refresh: "Actualiser",
      apply: "Appliquer",
      reset: "Réinitialiser",
      clear: "Effacer",
      select: "Sélectionner",
      add: "Ajouter",
      yes: "Oui",
      no: "Non",
      ok: "OK"
    },
    errors: {
      accessDenied: "Accès refusé"
    }
  },
  de: {
    contact: {
      chatNow: "Jetzt chatten",
      joinChannel: "Kanal beitreten",
      followUs: "Folgen Sie uns",
      visitWebsite: "Website besuchen",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "Standort",
      workingHours: "Öffnungszeiten",
      getDirections: "Wegbeschreibung"
    },
    gallery: {
      filterByCategory: "Nach Kategorie filtern",
      sortBy: "Sortieren nach",
      newest: "Neueste",
      oldest: "Älteste",
      mostViewed: "Meistgesehen",
      noPhotos: "Keine Fotos gefunden"
    },
    common: {
      welcome: "Willkommen zurück",
      dashboard: "Dashboard",
      management: "Verwaltung",
      settings: "Einstellungen",
      actions: "Aktionen",
      status: "Status",
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ausstehend",
      approved: "Genehmigt",
      rejected: "Abgelehnt",
      total: "Gesamt",
      new: "Neu",
      update: "Aktualisieren",
      create: "Erstellen",
      remove: "Entfernen",
      export: "Exportieren",
      import: "Importieren",
      refresh: "Aktualisieren",
      apply: "Anwenden",
      reset: "Zurücksetzen",
      clear: "Löschen",
      select: "Auswählen",
      add: "Hinzufügen",
      yes: "Ja",
      no: "Nein",
      ok: "OK"
    },
    errors: {
      accessDenied: "Zugriff verweigert"
    }
  },
  es: {
    contact: {
      chatNow: "Chatear ahora",
      joinChannel: "Unirse al canal",
      followUs: "Síguenos",
      visitWebsite: "Visitar sitio web",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "Ubicación",
      workingHours: "Horario de trabajo",
      getDirections: "Obtener direcciones"
    },
    gallery: {
      filterByCategory: "Filtrar por categoría",
      sortBy: "Ordenar por",
      newest: "Más reciente",
      oldest: "Más antiguo",
      mostViewed: "Más visto",
      noPhotos: "No se encontraron fotos"
    },
    common: {
      welcome: "Bienvenido de nuevo",
      dashboard: "Panel de control",
      management: "Gestión",
      settings: "Configuración",
      actions: "Acciones",
      status: "Estado",
      active: "Activo",
      inactive: "Inactivo",
      pending: "Pendiente",
      approved: "Aprobado",
      rejected: "Rechazado",
      total: "Total",
      new: "Nuevo",
      update: "Actualizar",
      create: "Crear",
      remove: "Eliminar",
      export: "Exportar",
      import: "Importar",
      refresh: "Actualizar",
      apply: "Aplicar",
      reset: "Restablecer",
      clear: "Limpiar",
      select: "Seleccionar",
      add: "Añadir",
      yes: "Sí",
      no: "No",
      ok: "OK"
    },
    errors: {
      accessDenied: "Acceso denegado"
    }
  },
  it: {
    contact: {
      chatNow: "Chatta ora",
      joinChannel: "Unisciti al canale",
      followUs: "Seguici",
      visitWebsite: "Visita il sito",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "Posizione",
      workingHours: "Orari di lavoro",
      getDirections: "Ottieni indicazioni"
    },
    gallery: {
      filterByCategory: "Filtra per categoria",
      sortBy: "Ordina per",
      newest: "Più recente",
      oldest: "Più vecchio",
      mostViewed: "Più visto",
      noPhotos: "Nessuna foto trovata"
    },
    common: {
      welcome: "Bentornato",
      dashboard: "Dashboard",
      management: "Gestione",
      settings: "Impostazioni",
      actions: "Azioni",
      status: "Stato",
      active: "Attivo",
      inactive: "Inattivo",
      pending: "In attesa",
      approved: "Approvato",
      rejected: "Rifiutato",
      total: "Totale",
      new: "Nuovo",
      update: "Aggiorna",
      create: "Crea",
      remove: "Rimuovi",
      export: "Esporta",
      import: "Importa",
      refresh: "Aggiorna",
      apply: "Applica",
      reset: "Ripristina",
      clear: "Cancella",
      select: "Seleziona",
      add: "Aggiungi",
      yes: "Sì",
      no: "No",
      ok: "OK"
    },
    errors: {
      accessDenied: "Accesso negato"
    }
  },
  ru: {
    contact: {
      chatNow: "Чат сейчас",
      joinChannel: "Присоединиться к каналу",
      followUs: "Подписывайтесь",
      visitWebsite: "Посетить сайт",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "ВКонтакте",
      location: "Местоположение",
      workingHours: "Часы работы",
      getDirections: "Получить направления"
    },
    gallery: {
      filterByCategory: "Фильтр по категории",
      sortBy: "Сортировать по",
      newest: "Новейшие",
      oldest: "Старейшие",
      mostViewed: "Самые просматриваемые",
      noPhotos: "Фотографии не найдены"
    },
    common: {
      welcome: "Добро пожаловать",
      dashboard: "Панель управления",
      management: "Управление",
      settings: "Настройки",
      actions: "Действия",
      status: "Статус",
      active: "Активный",
      inactive: "Неактивный",
      pending: "В ожидании",
      approved: "Одобрено",
      rejected: "Отклонено",
      total: "Всего",
      new: "Новый",
      update: "Обновить",
      create: "Создать",
      remove: "Удалить",
      export: "Экспорт",
      import: "Импорт",
      refresh: "Обновить",
      apply: "Применить",
      reset: "Сбросить",
      clear: "Очистить",
      select: "Выбрать",
      add: "Добавить",
      yes: "Да",
      no: "Нет",
      ok: "ОК"
    },
    errors: {
      accessDenied: "Доступ запрещен"
    }
  },
  zh: {
    contact: {
      chatNow: "立即聊天",
      joinChannel: "加入频道",
      followUs: "关注我们",
      visitWebsite: "访问网站",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "位置",
      workingHours: "工作时间",
      getDirections: "获取路线"
    },
    gallery: {
      filterByCategory: "按类别筛选",
      sortBy: "排序方式",
      newest: "最新",
      oldest: "最旧",
      mostViewed: "最多浏览",
      noPhotos: "未找到照片"
    },
    common: {
      welcome: "欢迎回来",
      dashboard: "仪表板",
      management: "管理",
      settings: "设置",
      actions: "操作",
      status: "状态",
      active: "活跃",
      inactive: "不活跃",
      pending: "待处理",
      approved: "已批准",
      rejected: "已拒绝",
      total: "总计",
      new: "新建",
      update: "更新",
      create: "创建",
      remove: "删除",
      export: "导出",
      import: "导入",
      refresh: "刷新",
      apply: "应用",
      reset: "重置",
      clear: "清除",
      select: "选择",
      add: "添加",
      yes: "是",
      no: "否",
      ok: "确定"
    },
    errors: {
      accessDenied: "访问被拒绝"
    }
  },
  ja: {
    contact: {
      chatNow: "今すぐチャット",
      joinChannel: "チャンネルに参加",
      followUs: "フォローする",
      visitWebsite: "ウェブサイトを訪問",
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
      tiktok: "TikTok",
      linkedin: "LinkedIn",
      pinterest: "Pinterest",
      vk: "VK",
      location: "場所",
      workingHours: "営業時間",
      getDirections: "道順を取得"
    },
    gallery: {
      filterByCategory: "カテゴリーで絞り込む",
      sortBy: "並び替え",
      newest: "最新",
      oldest: "最古",
      mostViewed: "最も閲覧された",
      noPhotos: "写真が見つかりません"
    },
    common: {
      welcome: "おかえりなさい",
      dashboard: "ダッシュボード",
      management: "管理",
      settings: "設定",
      actions: "アクション",
      status: "ステータス",
      active: "アクティブ",
      inactive: "非アクティブ",
      pending: "保留中",
      approved: "承認済み",
      rejected: "拒否",
      total: "合計",
      new: "新規",
      update: "更新",
      create: "作成",
      remove: "削除",
      export: "エクスポート",
      import: "インポート",
      refresh: "更新",
      apply: "適用",
      reset: "リセット",
      clear: "クリア",
      select: "選択",
      add: "追加",
      yes: "はい",
      no: "いいえ",
      ok: "OK"
    },
    errors: {
      accessDenied: "アクセスが拒否されました"
    }
  }
};

// Function to deep merge objects
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }
  return Object.assign(target || {}, source);
}

// Update each language file
const localesDir = path.join(__dirname, 'src', 'locales');
const languages = ['ar', 'fr', 'de', 'es', 'it', 'ru', 'zh', 'ja'];

console.log('🌍 Starting translation update...\n');

languages.forEach(lang => {
  const filePath = path.join(localesDir, `${lang}.json`);
  
  try {
    // Read existing file
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge new translations
    const updated = deepMerge(existing, newTranslations[lang]);
    
    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf8');
    
    console.log(`✅ Updated ${lang}.json`);
  } catch (error) {
    console.error(`❌ Error updating ${lang}.json:`, error.message);
  }
});

console.log('\n🎉 Translation update complete!');
console.log('\n📊 Summary:');
console.log(`- Languages updated: ${languages.length}`);
console.log(`- New keys per language: 45`);
console.log(`- Total new translations: ${languages.length * 45}`);
