# 🚀 מדריך פריסה ל-Vercel - עקוב אחרי המספרים

## ✅ מה שכבר מוכן
- [x] vercel.json נוצר
- [x] הקוד ב-GitHub
- [x] Firebase מוגדר

## 📋 מה שנשאר לך לעשות (10 דקות)

---

## 🔴 שלב 1: העלאת vercel.json

```bash
git add vercel.json
git commit -m "Add Vercel config"
git push origin main
```

---

## 🟠 שלב 2: פריסה ל-Vercel

### 2.1 כניסה ל-Vercel
1. לך ל: https://vercel.com
2. לחץ "Sign Up" או "Log In"
3. בחר "Continue with GitHub"
4. אשר את הגישה

### 2.2 יצירת פרויקט חדש
1. לחץ על הכפתור הכחול **"Add New..."** → **"Project"**
2. תראה רשימת repositories מ-GitHub שלך
3. מצא את **fluence-cdss** (או שם הריפו שלך)
4. לחץ **"Import"**

### 2.3 הגדרות פרויקט
Vercel יזהה אוטומטית שזה Vite. תראה:

```
Framework Preset: Vite ✅
Build Command: npm run build ✅
Output Directory: dist ✅
```

⚠️ **אל תלחץ Deploy עדיין!**

---

## 🟡 שלב 3: הוספת משתני סביבה

### 3.1 פתח את .env.local שלך (במחשב שלך)

### 3.2 ב-Vercel, גלול למטה ל-"Environment Variables"

### 3.3 העתק כל שורה מ-.env.local כך:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | מה שכתוב אחרי = ב-.env.local שלך |
| `VITE_FIREBASE_AUTH_DOMAIN` | מה שכתוב אחרי = ב-.env.local שלך |
| `VITE_FIREBASE_PROJECT_ID` | מה שכתוב אחרי = ב-.env.local שלך |
| `VITE_FIREBASE_STORAGE_BUCKET` | מה שכתוב אחרי = ב-.env.local שלך |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | מה שכתוב אחרי = ב-.env.local שלך |
| `VITE_FIREBASE_APP_ID` | מה שכתוב אחרי = ב-.env.local שלך |

**כל אחד בשורה נפרדת:**
- לחץ "Add" → הקלד Name → הקלד Value → לחץ "Add"
- חזור על זה 6 פעמים

---

## 🟢 שלב 4: Deploy!

1. לחץ על הכפתור הכחול **"Deploy"**
2. חכה 2-3 דקות
3. תראה **"Congratulations!"** 🎉
4. העתק את ה-URL שקיבלת (משהו כמו `fluence-cdss-xxx.vercel.app`)

---

## 🔵 שלב 5: הוספת הדומיין ל-Firebase

### 5.1 פתח Firebase Console
1. לך ל: https://console.firebase.google.com
2. בחר את הפרויקט **fluence-cdss**

### 5.2 הוסף דומיין מורשה
1. תפריט שמאל → **Authentication** (🔐)
2. לשונית **Settings** (למעלה)
3. גלול ל-**Authorized domains**
4. לחץ **"Add domain"**
5. הדבק את ה-URL מ-Vercel (ללא https://)
   ```
   דוגמה: fluence-cdss-abc123.vercel.app
   ```
6. לחץ **"Add"**

---

## ✅ שלב 6: בדיקה

1. פתח את ה-URL של Vercel בדפדפן
2. נסה להתחבר
3. אם עובד → **סיימת!** 🎉
4. אם לא עובד → ראה למטה 👇

---

## 🆘 אם משהו לא עובד

### שגיאה: "auth/unauthorized-domain"

**פתרון:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. ודא שה-URL של Vercel נמצא ברשימה
3. אם לא - הוסף אותו
4. חכה 30 שניות ונסה שוב

### הדף לבן / שגיאה 404

**פתרון:**
1. Vercel Dashboard → הפרויקט שלך → Settings → Environment Variables
2. ודא שכל 6 המשתנים קיימים ומתחילים ב-`VITE_`
3. אם חסר משהו - הוסף
4. Deployments → לחץ על ה-... ליד הפריסה האחרונה → **"Redeploy"**

### פתיחת Console לבדיקת שגיאות

1. בדפדפן, לחץ `F12`
2. לשונית **Console**
3. חפש טקסט אדום
4. העתק את השגיאה ושלח לי

---

## 📞 צריך עזרה?

שלח לי:
1. צילום מסך של השגיאה
2. ה-URL של Vercel
3. צילום מסך של Console (F12)

אני אפתור!
