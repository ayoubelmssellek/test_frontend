import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      common: {
        save: "Save",
        cancel: "Cancel",
        settings: "Settings",
        language: "Language",
        logout: "Logout",
        "click_to_upload": "Click to upload image"
      },
      filters:{
        "add_Category": "Add Category",
        "add_Type": "Add Type",
        "Sales by Types": "Sales by Types",
        "Sales by Category": "Sales by Category", 
        "Total Sales": "Total Sales",
        "Total Category": "Total Category",
        "total_revenue": "Total Revenue",
        "daily_sales": "Daily Sales",
        "weekly_sales": "Weekly Sales",
        "monthly_sales": "Monthly Sales",
        "search_placeholder": "Search products...",
        "time": {
          "all": "All Time",
          "day": "Last 24 Hours",
          "week": "Last 7 Days",
          "month": "Last 30 Days"
        },
        "Day": "Day",
        "Week": "Week",
        "Month": "Month",
        "all_names": "All Names",
        "all_roles": "All Roles",
        "clear": "Clear Filters",
        "select_category": "Select Category",
        "select_type": "Select Type",
        "search_name": "Search by Name",
        "all_status": "All Status",
        "all_types": "All Types",
        "pickup": "Pickup",
        "total_reviews": "Total Reviews",
        "accepted_reviews": "Accepted Reviews",
        "rejected_reviews": "Rejected Reviews",
        "no_reviews": "No Reviews avalaible",
        "delivery": "Delivery",
        "total": "Total",
        "daily": "Daily",
        "weekly": "Weekly",
        "monthly": "Monthly",
        "Total Types": "Total Types",
  
      }, 
      navbar: {
        welcome: "Welcome!",
        home:"home",
         menu:'menu',
        account:'account',
        favorites:'favorites',
        cart:'cart',
        profile: "Profile",
        login:'login',
        contact:'contact',
        notifications: "Notifications",
      },
      badges:{
        products: "Products",
        orders: "Orders",
        customers: "Customers",
        reviews: "Reviews",
        sales: "Sales",
        lastUpdate: "Last update"

      },
      sidebar: {
        dashboard: "Dashboard",
        employees: "Employees",
        categories: "Categories",
        types : "types",
        offers: "Offers",
        settings:"Settings",
        logout:"Logout",
        light: "Light mode",
        dark: "Dark mode",
      },
      status: {
        "preparation": "preparation",
        "ready": "ready",
        "delivered": "delivered",
        "avalaible": "avalaible",
        "out of stock": "Out of Stock",
        "active": "Active",
        "disabled": "Disabled",
        "accepted": "Accepted",
        "rejected": "Rejected",
        "completed": "Completed",
        pending:'pending'
      },
      tables:{
        order_id:"Order ID",
        customer:"Customer",
        date:"Date",
        "last_active": "Last Active",
        items:"Items",
        "sale_id": "Sale ID",
        "product_name": "Product Name",
        "total": "Total",
        "phone": "Phone",
        status:"Status",
        "opinion": "Opinion",
        "rating": "Rating",
        "image": "Image",
        actions:"Actions",
        recentOrders:"Recent Orders",
        item:"item",
        "name": "Name",
        "role": "Role",
        "salary": "Salary",
        "total_advance": "Total Advance",
        "num_reports": "Number of Reports",
        "current_salary": "Current Salary",
        "category": "Category",
        "price": "Price",
        "stock": "Stock",
        "type": "Type",
        "change_status": "Change Status",
        "takeaway_orders": "Takeaway Orders",
        "delivery_orders": "Delivery Orders"

      },
      "actions": {
        "view_details": "View Details",
        "edit": "Edit",
        "delete": "Delete"
      },
      "pagination": {
        "previous": "Previous",
        "next": "Next",
        "page": "Page {{currentPage}} of {{totalPages}}"
      },
      "empty_state": {
        "title": "No Employees Found",
        "message": "Click the + icon to add a new employee",
        "no_orders": "No orders avalaible",
        "no_sales": "No sales found matching your criteria",

      },
      "products": {
        "add_product": "Add Product",
        "delete_confirm": "Are you sure you want to delete this product?",
        "no_products": "No products avalaible",
        update_product: "Update Product",
        product_name: "Product Name"
      },
    "titles": {
    "Profile": "Profile",
    "Offers": "Offers",
    "Categories": "Categories",
    "Employees": "Employees",
    "Sales": "Sales",
    "Reviews": "Reviews",
    "Customers": "Customers",
    "Orders": "Orders",
    "Management": "Management",
    "Products": "Products",
    "Orders_T": "Orders Management",
    "manage_types": "Manage Product Types"
   },
   
   "profile": {
    "Admin Profile": "Admin Profile",
    "Msg": "View and edit your profile information",
    "Name": "Name",
    "Phone": "Phone",
    "Password": "Password",
    "Edit": "Edit",
    "Save": "Save"
  },
  "offers": {
    "choose_category": "Choose your Category",
    "product_name": "Product Name",
    "image": "Image",
    "make_offer": "Make your offer",
    "no_products": "No products avalaible"
  },
  errors: {
    fill_all_fields: "Please fill all fields", // English
    invalid_price: "Price must be a valid number",
    positive_price: "Price must be a positive number"
  },
  msg:{
     "If you delete a category, all products belonging to that category will also be removed":"If you delete a category, all products belonging to that category will also be removed",
     "If you delete a type, all products belonging to that type will also be removed":"If you delete a type, all products belonging to that type will also be removed",
     Warning:"Warning"
  }

      
    
    }
  },
  fr: {
    translation: {
      common: {
        save: "Enregistrer",
        cancel: "Annuler",
        settings: "Paramètres",
        language: "Langue",
        logout: "Déconnexion",
        "click_to_upload": "Cliquez pour télécharger l'image"

      },
      filters:{
        "add_Category": "Ajouter catégorie",
         "add_Type": "Ajouter Type",
        "Sales by Types": "Ventes par types",
        "Sales by Category": "Ventes par catégorie",
        "Total Sales": "Ventes totales",
        "Total Category": "Total catégories",
        "Day": "Jour",
        "Week": "Semaine",
        "Month": "Mois",
        "all_names": "Tous les noms",
        "all_roles": "Tous les rôles",
        "clear": "Effacer les filtres",
        "select_category": "Sélectionner une catégorie",
        "select_type": "Sélectionner un type",
        "search_name": "Rechercher par nom",
         "all_status": "Tous les statuts",
        "all_types": "Tous les types",
        "pickup": "À emporter",
        "delivery": "Livraison",
        "total": "Total",
        "daily": "Quotidien",
        "weekly": "Hebdomadaire",
        "total_reviews": "Avis totaux",
        "accepted_reviews": "Avis acceptés",
        "rejected_reviews": "Avis rejetés",
        "no_reviews": "Aucun avis disponible",
        "monthly": "Mensuel",
        "total_revenue": "Revenu Total",
        "daily_sales": "Ventes Quotidiennes",
        "weekly_sales": "Ventes Hebdomadaires",
        "monthly_sales": "Ventes Mensuelles",
        "search_placeholder": "Rechercher des produits...",
        "time": {
          "all": "Toute période",
          "day": "24 dernières heures",
          "week": "7 derniers jours",
          "month": "30 derniers jours",
          "Total Types": "Tous les types",

        }
      },
      navbar: {
        welcome: "Bienvenue !",
        home:"Accueil",
         menu:'menu',
        account:'compte',
        favorites:'favoris',
        cart:'panier',
        contact:'contactez vous',
        login:'se connecter',
        profile: "Profil",
        notifications: "Notifications",
      },
      badges:{
        products: "Produits",
        orders: "Commandes",
        customers: "Clients",
        reviews: "Avis",
        sales: "Ventes",
        lastUpdate: "Dernière mise à jour"

      },
      sidebar: {
        dashboard: "Table de bord",
        employees: "Employés",
        categories: "Catégories",
        types : "types",
        offers: "Offres",
        settings:"Settings",
        logout:"Logout",
        light: "Clair mode",
        dark: "Sombre mode",
      },
      status: {
        "preparation": "En préparation",
        "ready": "Prêt",
        "delivered": "Livré",
        avalaible: "Disponible",
        "out of stock": "En rupture de stock",
        "active": "Actif",
       "disabled": "Désactivé",
       "accepted": "Accepté",
       "rejected": "Rejeté",
       "completed": "Terminé",
       pending:'en attente'
   
      },
      tables:{
        order_id:"ID de commande",
        customer:"Client",
        date:"Date",
        "opinion": "Avis",
        "rating": "Évaluation",
        items:"Articles",
        "last_active": "Dernière activité",
        status:"Statut",
        actions:"Actions",
        recentOrders:"Commandes récentes",
        item:"article",
        "name": "Nom",
        "phone": "Téléphone",
        "role": "Rôle",
        "salary": "Salaire",
        "total_advance": "Avance totale",
        "num_reports": "Nombre de rapports",
        "current_salary": "Salaire actuel",
        "category": "Catégorie",
        "price": "Prix",
        "stock": "Stock",
        "type": "Type",
        "image": "Image",
        "change_status": "Changer le statut",
        "takeaway_orders": "Commandes à emporter",
        "delivery_orders": "Commandes de livraison",
        "sale_id": "ID de vente",
        "product_name": "Nom du produit",
        "total": "Total"
      },
      "actions": {
        "view_details": "Voir les détails",
        "edit": "Modifier",
        "delete": "Supprimer"
      },
      "pagination": {
        "previous": "Précédent",
        "next": "Suivant",
        "page": "Page {{currentPage}} sur {{totalPages}}"
      },
      "empty_state": {
        "title": "Aucun employé trouvé",
        "message": "Cliquez sur l'icône + pour ajouter un nouvel employé",
        "no_orders": "Aucune commande disponible",
        "no_sales": "Aucune vente trouvée correspondant à vos critères"


      },
      "products": {
        "update_product": "Mettre à jour le produit",
        "product_name": "Nom du produit"
      },
      "titles": {
      "Profile": "Profil",
      "Offers": "Offres",
      "Categories": "Catégories",
      "Employees": "Employés",
      "Sales": "Ventes",
      "Reviews": "Avis",
      "Customers": "Clients",
      "Orders": "Commandes",
      "Orders_T": "Gestion des commandes",
      "Management": "Gestion",
      "Products": "Produits",
      "manage_types": "Gérer les types"

    },
    "profile": {
    "Admin Profile": "Profil Administrateur",
    "Msg": "Afficher et modifier les informations de votre profil",
    "Name": "Nom",
    "Phone": "Téléphone",
    "Password": "Mot de passe",
    "Edit": "Modifier",
    "Save": "Enregistrer"
  },
  "offers": {
    "choose_category": "Choisissez votre catégorie",
    "product_name": "Nom du produit",
    "image": "Image",
    "make_offer": "Créer une offre",
    "no_products": "Aucun produit disponible"
  },
  errors: {
    fill_all_fields: "Veuillez remplir tous les champs",
    invalid_price: "Le prix doit être un nombre valide",
    positive_price: "Le prix doit être un nombre positif"
  },
  msg:{
     "If you delete a category, all products belonging to that category will also be removed":"Si vous supprimez une catégorie, tous les produits appartenant à cette catégorie seront également supprimés",
     "If you delete a type, all products belonging to that type will also be removed":"Si vous supprimez une type, tous les produits appartenant à cette type seront également supprimés",
     Warning:"Avertissement"
  }

    }
  },
  ar: {
    translation: {
      common: {
        save: "حفظ",
        cancel: "إلغاء",
        settings: "الإعدادات",
        language: "اللغة",
        logout: "تسجيل الخروج",
        "click_to_upload": "انقر لتحميل الصورة"

      },
      filters:{
        "add_Category": "إضافة فئة" ,
         "add_Type": "إضافة نوع " ,
        "Sales by Types": "المبيعات حسب النوع",
        "Sales by Category": "المبيعات حسب الفئة", 
        "Total Sales": "إجمالي المبيعات",
        "Total Category": " إجمالي الفئات",
        "Day": "يوم",
        "Week": "أسبوع",
        "Month": "شهر",
        "all_names": "جميع الأسماء",
        "all_roles": "جميع الأدوار",
        "clear": "مسح الفلاتر",
        "select_category": "اختر الفئة",
        "select_type": "اختر النوع",
        "search_name": "بحث بالاسم",
        "all_status": "جميع الحالات",
        "all_types": "جميع الأنواع",
        "pickup": "استلام",
        "delivery": "توصيل",
        "total": "المجموع",
        "daily": "يومي",
        "weekly": "أسبوعي",
        "monthly": "شهري",
        "total_reviews": "إجمالي المراجعات",
        "accepted_reviews": "المراجعات المقبولة",
        "rejected_reviews": "المراجعات المرفوضة",
        "no_reviews": "لا توجد مراجعات متاحة",
        "total_revenue": "إجمالي الإيرادات",
        "daily_sales": "المبيعات اليومية",
        "weekly_sales": "المبيعات الأسبوعية",
        "monthly_sales": "المبيعات الشهرية",
        "search_placeholder": "بحث في المنتجات...",
        "time": {
          "all": "كل الوقت",
          "day": "آخر 24 ساعة",
          "week": "آخر 7 أيام",
          "month": "آخر 30 يوم",

        },
        "Total Types": "جميع الأنواع",

    
      },
      navbar: {
        welcome: "مرحبا!",
        home:"الرئيسية",
        menu:'القائمة',
        account:'الحساب',
        favorites:'المفضلة',
        cart:'سلة',
        login:'تسجيل الدخول',
        contact:'تواصل معنا',
        profile: "الملف الشخصي",
        notifications: "الإشعارات",
      },
      badges:{
        products: "المنتجات",
        orders: "الطلبات",
        customers: "العملاء",
        reviews: "التقييمات",
        sales: "المبيعات",
        lastUpdate: "آخر تحديث"

      },
      sidebar: {
        dashboard: "لوحة التحكم",
        employees: "الموظفين",
        categories: "الفئات",
        types : "الانواع",
        offers: "العروض الخاصة",
        settings:"الاعدادات",
        logout:"تسجيل الخروج",
        light: " الوضع الفاتح",
        dark: "الوضع الداكن",
      },
      status: {
        "preparation": "جاري التحضير",
        "ready": "جاهز",
        "delivered": "تم التوصيل",
         avalaible: "متوفر",
        "out of stock": "غير متوفر",
        "active": "نشط",
        "disabled": "معطل",
        "accepted": "مقبول",
        "completed": "مكتمل",
        "rejected": "مرفوض",
         pending:'قيد الانتظار'
      },
      "products": {
        "add_product": "إضافة منتج",
        "delete_confirm": "هل أنت متأكد أنك تريد حذف هذا المنتج؟",
        "no_products": "لا توجد منتجات متاحة",
        "update_product": "تحديث المنتج",
        "product_name": "اسم المنتج"
      },
      tables:{
        order_id:"رقم الطلب",
        customer:"العميل",
        date:"التاريخ",
        items:"العناصر",
        "opinion": "الرأي",
        "rating": "التقييم",
        "last_active": "النشاط الأخير",
        status:"الحالة",
        actions:"الإجراءات",
        recentOrders:"الطلبات الحديثة",
        "phone": "الهاتف",
        item:"عنصر",
        "name": "الاسم",
        "role": "الدور",
        "salary": "الراتب",
        "total_advance": "السلفة الإجمالية",
        "num_reports": "عدد التقارير",
        "current_salary": "الراتب الحالي",
        "category": "الفئة",
        "price": "السعر",
        "stock": "المخزون",
        "type": "النوع",
        "image": "صورة",
        "change_status": "تغيير الحالة",
        "takeaway_orders": "طلبات الاستلام",
        "delivery_orders": "طلبات التوصيل",
        "sale_id": "معرّف البيع",
        "product_name": "اسم المنتج",
        "total": "المجموع"
      },

      "actions": {
        "view_details": "عرض التفاصيل",
        "edit": "تعديل",
        "delete": "حذف"
      },
      "pagination": {
        "previous": "السابق",
        "next": "التالي",
        "page": "الصفحة {{currentPage}} من {{totalPages}}"
      },
      "empty_state": {
        "title": "لا يوجد موظفون",
        "message": "انقر فوق أيقونة + لإضافة موظف جديد",
        "no_orders": "لا توجد طلبات متاحة",
        "no_sales": "لم يتم العثور على مبيعات تطابق معاييرك"
      },
    "titles": {
    "Profile": "الملف الشخصي",
    "Offers": "العروض",
    "Categories": "الفئات",
    "Employees": "الموظفين",
    "Sales": "المبيعات",
    "Reviews": "التقييمات",
    "Customers": "العملاء",
    "Orders": "الطلبات",
    "Management": "الإدارة",
    "Products": "المنتجات",
    "Orders_T": "إدارة الطلبات",
    "manage_types": "إدارة الأنواع"


   },
   "profile": {
    "Admin Profile": "ملف المشرف",
    "Msg": "عرض وتعديل معلومات ملفك الشخصي",
    "Name": "الاسم",
    "Phone": "الهاتف",
    "Password": "كلمة المرور",
    "Edit": "تعديل",
    "Save": "حفظ"
  },
  "offers": {
    "choose_category": "اختر الفئة الخاصة بك",
    "product_name": "اسم المنتج",
    "image": "صورة",
    "make_offer": "إنشاء عرض",
    "no_products": "لا توجد منتجات متاحة"
  },
  errors: {
    fill_all_fields: "يرجى ملء جميع الحقول",
    invalid_price: "يجب أن يكون السعر رقمًا صالحًا",
    positive_price: "يجب أن يكون السعر رقمًا موجبًا"
  }, 
  msg:{
     "If you delete a category, all products belonging to that category will also be removed":"إذا قمت بحذف نوع, فسيتم أيضًا حذف جميع المنتجات التابعة لذلك النوع ",
     "If you delete a type, all products belonging to that type will also be removed":"إذا قمت بحذف نوع , فسيتم أيضًا حذف جميع المنتجات التابعة لذلك النوع",
     Warning:"تحذير"
  }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;