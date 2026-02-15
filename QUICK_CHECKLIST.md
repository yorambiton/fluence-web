# ✅ Checklist מהיר - סמן V כשעשית

## לפני שמתחילים
```bash
# הרץ את זה כדי לראות את משתני הסביבה
node extract-env.js
```

---

## [ ] 1. העלאת קבצים ל-Git (30 שניות)

```bash
git add vercel.json VERCEL_SETUP.md extract-env.js QUICK_CHECKLIST.md
git commit -m "Add Vercel deployment files"
git push origin main
```

✅ אישור: ראית "done" בטרמינל

---

## [ ] 2. כניסה ל-Vercel (1 דקה)

🔗 פתח: https://vercel.com

- [ ] לחצתי "Continue with GitHub"
- [ ] אישרתי את הגישה

---

## [ ] 3. יבוא הפרויקט (2 דקות)

- [ ] לחצתי "Add New..." → "Project"
- [ ] מצאתי את fluence-cdss ברשימה
- [ ] לחצתי "Import"
- [ ] ראיתי "Framework Preset: Vite"

⚠️ **עצור כאן! אל תלחץ Deploy!**

---

## [ ] 4. הוספת משתני סביבה (3 דקות)

```bash
# הרץ שוב את זה ובצד תעתיק ל-Vercel:
node extract-env.js
```

בעמוד של Vercel:
- [ ] גללתי למטה ל-"Environment Variables"
- [ ] הוספתי VITE_FIREBASE_API_KEY
- [ ] הוספתי VITE_FIREBASE_AUTH_DOMAIN
- [ ] הוספתי VITE_FIREBASE_PROJECT_ID
- [ ] הוספתי VITE_FIREBASE_STORAGE_BUCKET
- [ ] הוספתי VITE_FIREBASE_MESSAGING_SENDER_ID
- [ ] הוספתי VITE_FIREBASE_APP_ID

✅ סה"כ 6 משתנים

---

## [ ] 5. Deploy (2 דקות)

- [ ] לחצתי על הכפתור הכחול "Deploy"
- [ ] חיכיתי ל-"Congratulations!"
- [ ] העתקתי את ה-URL (משהו כמו `fluence-cdss-xxx.vercel.app`)

**ה-URL שלי:** ___________________ (כתוב כאן)

---

## [ ] 6. הוספת דומיין ל-Firebase (2 דקות)

🔗 פתח: https://console.firebase.google.com

- [ ] בחרתי את הפרויקט fluence-cdss
- [ ] לחצתי על Authentication בתפריט שמאל
- [ ] לשונית Settings
- [ ] גללתי ל-Authorized domains
- [ ] לחצתי "Add domain"
- [ ] הדבקתי את ה-URL מ-Vercel (ללא https://)
- [ ] לחצתי "Add"

---

## [ ] 7. בדיקה אחרונה

- [ ] פתחתי את ה-URL בדפדפן
- [ ] ניסיתי להתחבר
- [ ] 🎉 עובד!

---

## 🆘 אם לא עובד

1. לחץ F12 בדפדפן
2. לשונית Console
3. צלם מסך של השגיאות האדומות
4. שלח לי את הצילום

---

**זמן כולל: ~10 דקות**
