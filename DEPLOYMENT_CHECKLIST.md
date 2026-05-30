# ✅ Production Deployment Checklist

## Before Deployment / לפני ההעלאה

- [ ] All sensitive files in .gitignore / כל הקבצים הרגישים ב-.gitignore
- [ ] appsettings.json is clean of sensitive values / appsettings.json ריק מערכים רגישים
- [ ] All environment variables are prepared / יש לך את כל משתני הסביבה מוכנים
- [ ] Code tested in Development / בדקת שהקוד עובד ב-Development

## Deploying Backend API / העלאת API

- [ ] Create environment variables in cloud provider:
  - [ ] Supabase__Url
  - [ ] Supabase__Key
  - [ ] ConnectionStrings__DefaultConnection
  - [ ] AllowedOrigins (temporary: http://localhost:5173)
  - [ ] ASPNETCORE_ENVIRONMENT=Production
- [ ] Upload code to cloud provider / העלית את הקוד
- [ ] Application running successfully / האפליקציה רצה בהצלחה
- [ ] Save the API URL / שמרת את ה-URL של ה-API

## Deploying Frontend / העלאת Frontend

- [ ] Update API URL in code / עדכנת את ה-API URL בקוד
- [ ] Build production bundle: `npm run build` / הרצת `npm run build`
- [ ] Upload build to cloud provider / העלית את ה-build
- [ ] Website loads successfully / האתר נטען בהצלחה
- [ ] Save the Frontend URL / שמרת את ה-URL של ה-Frontend

## Update CORS Policy / עדכון CORS

- [ ] Update AllowedOrigins with actual Frontend URL / עדכנת את AllowedOrigins עם ה-URL האמיתי של ה-Frontend
- [ ] Restart API / הפעלת מחדש את ה-API

## Final Tests / בדיקות סופיות

- [ ] Created new card - works ✓ / יצרת כרטיס חדש - עובד ✓
- [ ] Footer appears on all pages ✓ / ה-Footer מופיע בכל הדפים ✓
- [ ] QR Code works ✓ / ה-QR Code עובד ✓
- [ ] Form validation works (email, URLs) ✓ / הולידציה עובדת (אימייל, URLs) ✓
- [ ] Swagger not accessible in Production ✓ / Swagger לא זמין ב-Production ✓
- [ ] No Stack Trace exposed in errors ✓ / אין Stack Trace בשגיאות ✓

## 🎉 Ready!

Your project is live! / הפרויקט שלך באוויר!
