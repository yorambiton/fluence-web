import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Activity, Pill, User, FileText, Heart, Moon, TrendingUp, Users } from 'lucide-react';

const drugDatabase = {
  fluoxetine: {
    name: 'Fluoxetine (Prozac)',
    standardDose: 20,
    minTherapeuticDose: 20,
    maxDose: 80,
    doseSteps: [10, 20, 40, 60, 80],
    halfLife: '4-6 ימים (כולל מטבוליט פעיל)',
    steadyStateWeeks: 5,
    notes: 'זמן מחצית חיים ארוך - יתרון בהיענות, חיסרון בתופעות לוואי ממושכות'
  },
  sertraline: {
    name: 'Sertraline (Zoloft)',
    standardDose: 50,
    minTherapeuticDose: 50,
    maxDose: 200,
    doseSteps: [25, 50, 100, 150, 200],
    halfLife: '26 שעות',
    steadyStateWeeks: 1,
    notes: 'פרופיל תופעות לוואי GI בולט בתחילת טיפול'
  },
  escitalopram: {
    name: 'Escitalopram (Cipralex)',
    standardDose: 10,
    minTherapeuticDose: 10,
    maxDose: 20,
    doseSteps: [5, 10, 15, 20],
    halfLife: '27-32 שעות',
    steadyStateWeeks: 1,
    notes: 'ה-SSRI הסלקטיבי ביותר. טווח מינון צר.'
  },
  paroxetine: {
    name: 'Paroxetine (Seroxat)',
    standardDose: 20,
    minTherapeuticDose: 20,
    maxDose: 50,
    doseSteps: [10, 20, 30, 40, 50],
    halfLife: '21 שעות',
    steadyStateWeeks: 2,
    notes: 'זהירות בהפסקה - תסמיני גמילה. לא מומלץ בהריון.'
  },
  citalopram: {
    name: 'Citalopram (Cipramil)',
    standardDose: 20,
    minTherapeuticDose: 20,
    maxDose: 40,
    doseSteps: [10, 20, 30, 40],
    halfLife: '35 שעות',
    steadyStateWeeks: 1,
    notes: 'מקסימום 20mg מעל גיל 65. סיכון QT במינונים גבוהים.'
  },
  venlafaxine: {
    name: 'Venlafaxine (Efexor)',
    standardDose: 75,
    minTherapeuticDose: 75,
    maxDose: 375,
    doseSteps: [37.5, 75, 150, 225, 300, 375],
    halfLife: '5 שעות (מטבוליט 11 שעות)',
    steadyStateWeeks: 1,
    notes: 'SNRI - מעל 150mg משפיע גם על נוראדרנלין. מעקב ל"ד נדרש.'
  },
  duloxetine: {
    name: 'Duloxetine (Cymbalta)',
    standardDose: 60,
    minTherapeuticDose: 60,
    maxDose: 120,
    doseSteps: [30, 60, 90, 120],
    halfLife: '12 שעות',
    steadyStateWeeks: 1,
    notes: 'SNRI - יעיל גם לכאב נוירופתי. לא לפצל קפסולות.'
  }
};

const getDrugInfo = (drugName) => {
  return drugDatabase[drugName] || {
    name: drugName || 'לא נבחרה תרופה',
    standardDose: 0,
    minTherapeuticDose: 0,
    maxDose: 0,
    doseSteps: [],
    halfLife: 'N/A',
    steadyStateWeeks: 4,
    notes: ''
  };
};

const getHamiltonSeverity = (score) => {
  if (score <= 4) return 'תקין';
  if (score <= 9) return 'דיכאון קל';
  if (score <= 14) return 'דיכאון בינוני';
  return 'דיכאון חמור';
};

export default function ProzacCDSS() {
  const [activeTab, setActiveTab] = useState('patient');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [isLicenseValid, setIsLicenseValid] = useState(false);
  const [licenseExpiry, setLicenseExpiry] = useState(null);
  const [licenseDuration, setLicenseDuration] = useState('');
  const [activeLicenses, setActiveLicenses] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  
  const ADMIN_PASSWORD = 'Yokoraz1968';
  
  const generateLicenseKey = (duration) => {
    const prefix = duration === 'week' ? 'WK' : duration === 'month' ? 'MO' : 'YR';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };
  
  const validateLicense = (key) => {
    const license = activeLicenses.find(l => l.key === key);
    if (license && new Date() < new Date(license.expiry)) {
      setIsLicenseValid(true);
      setLicenseExpiry(license.expiry);
      setLicenseDuration(license.duration);
      setActiveTab('patient');
      return true;
    }
    return false;
  };

  const [patientData, setPatientData] = useState({
    age: '', weight: '', gender: 'male', diagnosis: '', treatmentWeek: ''
  });

  const [medication, setMedication] = useState({
    drugName: '', currentDose: '', startDate: '', previousDoses: []
  });

  const [weeklyData, setWeeklyData] = useState({
    avgRestingHR: '', hrvTrend: 'stable', avgSteps: '', sleepQuality: '', sleepHours: '', weightChange: '',
    moodAvg: 5, energyAvg: 5, anxietyAvg: 5, appetiteChange: 'stable', restlessnessLevel: 3,
    nausea: false, headache: false, insomnia: false, sexualSideEffects: false, agitation: false,
    familyObservesImprovement: null, familyObservesAgitation: null, socialWithdrawal: null,
  });

  const antidepressantKnowledge = {
    commonSideEffects: [
      'בחילות (שבועות 1-2)', 'כאבי ראש', 'נדודי שינה או ישנוניות',
      'אקטיבציה / אי-שקט', 'ירידה בתפקוד מיני', 'שינויים בתיאבון ומשקל'
    ]
  };

  const calculateHamiltonScore = (data) => {
    let score = 0;
    const moodVal = parseInt(data.moodAvg) || 5;
    score += Math.min(4, Math.max(0, Math.round((10 - moodVal) / 2.5)));
    const sleepScore = data.sleepQuality === 'poor' ? 4 : data.sleepQuality === 'fair' ? 2 : data.sleepQuality === 'good' ? 1 : 0;
    score += sleepScore;
    const stepsVal = parseInt(data.avgSteps) || 0;
    score += (stepsVal < 3000 ? 4 : stepsVal < 5000 ? 2 : stepsVal < 7000 ? 1 : 0);
    const anxietyVal = parseInt(data.anxietyAvg) || 5;
    score += Math.min(6, Math.round(anxietyVal / 2));
    score += (Math.abs(parseFloat(data.weightChange) || 0) > 2 ? 2 : 0);
    return score;
  };

  const detectActivation = (data) => {
    const restlessnessVal = parseInt(data.restlessnessLevel) || 3;
    const anxietyVal = parseInt(data.anxietyAvg) || 5;
    const activationScore = 
      (restlessnessVal > 6 ? 30 : 0) +
      (data.agitation ? 25 : 0) +
      (anxietyVal > 7 ? 20 : 0) +
      (data.insomnia ? 15 : 0) +
      (data.familyObservesAgitation ? 20 : 0);
    return { score: activationScore, level: activationScore > 60 ? 'high' : activationScore > 30 ? 'moderate' : 'low' };
  };

  const assessTherapeuticResponse = (data, week) => {
    const moodVal = parseInt(data.moodAvg) || 5;
    const energyVal = parseInt(data.energyAvg) || 5;
    const anxietyVal = parseInt(data.anxietyAvg) || 5;
    const stepsVal = parseInt(data.avgSteps) || 0;
    const restlessnessVal = parseInt(data.restlessnessLevel) || 3;
    const improvementIndicators = [moodVal > 6, energyVal > 5, stepsVal > 5000, data.sleepQuality === 'good' || data.sleepQuality === 'excellent', data.familyObservesImprovement === true, anxietyVal < 5].filter(Boolean).length;
    const negativeIndicators = [moodVal < 4, energyVal < 3, anxietyVal > 7, data.socialWithdrawal === true, restlessnessVal > 7].filter(Boolean).length;
    if (week < 4) return { status: 'early', message: 'תגובה מוקדמת - נדרש זמן נוסף להערכה מלאה' };
    if (improvementIndicators >= 4) return { status: 'good', message: 'תגובה טיפולית חיובית' };
    if (negativeIndicators >= 3) return { status: 'poor', message: 'תת-תגובה לטיפול - שקול התאמת מינון או החלפת תרופה' };
    return { status: 'partial', message: 'תגובה חלקית - מעקב המשך נדרש' };
  };

  const analyzeTreatment = () => {
    const week = parseInt(patientData.treatmentWeek) || 0;
    const dose = parseFloat(medication.currentDose) || 0;
    const drugInfo = getDrugInfo(medication.drugName);
    const moodVal = parseInt(weeklyData.moodAvg) || 5;
    const energyVal = parseInt(weeklyData.energyAvg) || 5;
    const anxietyVal = parseInt(weeklyData.anxietyAvg) || 5;
    const stepsVal = parseInt(weeklyData.avgSteps) || 0;
    
    const results = {
      patientInfo: patientData, medication, drugInfo, weeklyData,
      hamiltonScore: calculateHamiltonScore(weeklyData),
      steadyStateReached: week >= 4,
      activation: detectActivation(weeklyData),
      therapeuticResponse: assessTherapeuticResponse(weeklyData, week),
      confidence: 0, trend: '', keyDrivers: [],
      recommendation: { status: '', action: '', icon: '', reviewDays: 0 },
      recommendations: [], alerts: [],
      continuousMonitoring: {
        sleepPattern: `${weeklyData.sleepHours || 'N/A'} שעות ממוצע`,
        activityLevel: `${weeklyData.avgSteps || 'N/A'} צעדים ביום`,
        heartRate: `${weeklyData.avgRestingHR || 'N/A'} BPM ממוצע`,
        weightTrend: weeklyData.weightChange || 'יציב'
      }
    };

    let cs = 50;
    if (stepsVal > 7000) cs += 15; else if (stepsVal > 5000) cs += 10; else if (stepsVal > 3000) cs += 5; else cs -= 10;
    if (weeklyData.sleepQuality === 'excellent') cs += 15; else if (weeklyData.sleepQuality === 'good') cs += 10; else if (weeklyData.sleepQuality === 'fair') cs += 5; else cs -= 10;
    const sleepHrs = parseFloat(weeklyData.sleepHours) || 0;
    if (sleepHrs >= 7 && sleepHrs <= 9) cs += 10; else cs -= 5;
    const wc = Math.abs(parseFloat(weeklyData.weightChange) || 0);
    if (wc < 1) cs += 10; else if (wc > 3) cs -= 10;
    if (moodVal >= 7) cs += 10; else if (moodVal >= 5) cs += 5; else cs -= 10;
    if (energyVal >= 6) cs += 10; else if (energyVal >= 4) cs += 5; else cs -= 5;
    if (anxietyVal <= 4) cs += 10; else if (anxietyVal <= 6) cs += 5; else cs -= 10;
    if (results.activation.level === 'low') cs += 10; else if (results.activation.level === 'moderate') cs -= 5; else cs -= 20;
    if (weeklyData.familyObservesImprovement === true) cs += 5;
    if (weeklyData.familyObservesAgitation === true) cs -= 5;
    const subjImp = moodVal > 6 && energyVal > 5;
    const objImp = stepsVal > 5000 && (weeklyData.sleepQuality === 'good' || weeklyData.sleepQuality === 'excellent');
    if (subjImp !== objImp) cs -= 15;
    cs = Math.max(0, Math.min(100, cs));
    results.confidence = cs;
    results.trend = cs >= 70 ? 'מגמת שיפור (14 יום)' : cs >= 50 ? 'יציב' : 'מגמת ירידה';

    results.keyDrivers = [];
    if (stepsVal > 7000) results.keyDrivers.push({ label: 'פעילות גופנית', value: `${stepsVal} צעדים/יום`, impact: 'positive' });
    else if (stepsVal < 3000) results.keyDrivers.push({ label: 'פעילות גופנית', value: `${stepsVal} צעדים/יום`, impact: 'negative' });
    else results.keyDrivers.push({ label: 'פעילות גופנית', value: `${stepsVal} צעדים/יום`, impact: 'neutral' });
    const sqHeb = { poor: 'גרועה', fair: 'סבירה', good: 'טובה', excellent: 'מעולה' };
    const sqL = sqHeb[weeklyData.sleepQuality] || weeklyData.sleepQuality;
    if (weeklyData.sleepQuality === 'good' || weeklyData.sleepQuality === 'excellent') results.keyDrivers.push({ label: 'שינה', value: `${weeklyData.sleepHours} שעות, ${sqL}`, impact: 'positive' });
    else if (weeklyData.sleepQuality === 'poor') results.keyDrivers.push({ label: 'שינה', value: `${weeklyData.sleepHours} שעות, ${sqL}`, impact: 'negative' });
    else results.keyDrivers.push({ label: 'שינה', value: `${weeklyData.sleepHours} שעות, ${sqL}`, impact: 'neutral' });
    if (subjImp !== objImp) results.keyDrivers.push({ label: 'דיווח עצמי', value: 'לא עקבי עם נתונים', impact: 'neutral' });
    if (weeklyData.avgRestingHR || weeklyData.hrvTrend !== 'stable') {
      const hrvH = { improving: 'משתפר', stable: 'יציב', declining: 'יורד' };
      results.keyDrivers.push({ label: 'HRV/דופק (לידיעה)', value: `${weeklyData.avgRestingHR || 'N/A'} BPM, ${hrvH[weeklyData.hrvTrend]}`, impact: 'neutral', note: 'לא נכלל בחישוב' });
    }

    if (cs >= 70 && results.activation.level !== 'high') results.recommendation = { status: 'continue', action: 'המשך מינון נוכחי', icon: '🟢', reviewDays: 10 };
    else if (results.activation.level === 'high' || cs < 40) results.recommendation = { status: 'urgent', action: 'נדרשת בדיקה דחופה', icon: '🔴', reviewDays: 3 };
    else results.recommendation = { status: 'adjust', action: 'שקול התאמת טיפול', icon: '🟡', reviewDays: 7 };

    if (week <= 3) results.alerts.push({ type: 'info', title: 'שלב מוקדם בטיפול', message: 'תגובה טיפולית מלאה צפויה רק לאחר 4-6 שבועות. ניטור צמוד לאקטיבציה נדרש.' });
    if (results.activation.level === 'high') {
      results.recommendations.push({ type: 'danger', category: 'אקטיבציה', message: 'סימנים ברורים לאקטיבציה - שקול הפחתת מינון או הוספת תרופה מייצבת' });
      results.alerts.push({ type: 'warning', title: 'אזהרה: אקטיבציה גבוהה', message: `ציון אקטיבציה: ${results.activation.score}. נדרש מעקב צמוד.` });
    } else if (results.activation.level === 'moderate') {
      results.recommendations.push({ type: 'warning', category: 'אקטיבציה', message: 'סימנים לאקטיבציה קלה-בינונית - המשך מעקב יומי' });
    }

    if (results.therapeuticResponse.status === 'poor' && week >= 6 && drugInfo.maxDose > 0) {
      const nextDose = drugInfo.doseSteps.find(d => d > dose);
      results.recommendations.push({ type: 'warning', category: 'יעילות', message: nextDose ? `תת-תגובה לאחר ${week} שבועות - שקול העלאה ל-${nextDose}mg (מקסימום ${drugInfo.maxDose}mg)` : `תת-תגובה במינון מקסימלי - שקול החלפת תרופה או augmentation` });
    } else if (results.therapeuticResponse.status === 'good') {
      results.recommendations.push({ type: 'success', category: 'יעילות', message: 'תגובה טיפולית חיובית - המשך מינון נוכחי עם מעקב תקופתי' });
    }

    const seCount = [weeklyData.nausea, weeklyData.headache, weeklyData.insomnia, weeklyData.sexualSideEffects, weeklyData.agitation].filter(Boolean).length;
    if (seCount >= 3) results.recommendations.push({ type: 'warning', category: 'תופעות לוואי', message: 'מספר תופעות לוואי משמעותיות - שקול איטיות בהעלאת מינון או החלפת תרופה' });

    if (subjImp && !objImp) results.alerts.push({ type: 'info', title: 'פער סובייקטיבי-אובייקטיבי', message: 'המטופל מדווח שיפור, אך הנתונים לא משקפים זאת.' });
    else if (!subjImp && objImp) results.alerts.push({ type: 'info', title: 'פער סובייקטיבי-אובייקטיבי', message: 'נתוני הפעילות משתפרים, אך המטופל לא מדווח שיפור. שקול אפתיה.' });

    if (drugInfo.maxDose > 0) {
      if (dose < drugInfo.minTherapeuticDose && week >= 4 && results.therapeuticResponse.status !== 'good') {
        results.recommendations.push({ type: 'info', category: 'מינון', message: `מינון (${dose}mg) תת-טיפולי - שקול העלאה ל-${drugInfo.minTherapeuticDose}mg` });
      } else if (dose >= drugInfo.minTherapeuticDose && dose < drugInfo.maxDose && week >= 8 && results.therapeuticResponse.status === 'poor') {
        const nd = drugInfo.doseSteps.find(d => d > dose);
        if (nd) results.recommendations.push({ type: 'info', category: 'מינון', message: `שקול העלאה ל-${nd}mg (מקסימום ${drugInfo.maxDose}mg)` });
      }
      if (medication.drugName === 'citalopram' && parseInt(patientData.age) >= 65 && dose > 20) {
        results.alerts.push({ type: 'warning', title: 'אזהרת מינון - גיל 65+', message: 'Citalopram: מקסימום 20mg מעל גיל 65 (סיכון QT).' });
      }
    }

    setAnalysis(results);
    setActiveTab('results');
  };

  const FluenceLogo = ({ size = 48 }) => (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-3 shadow-lg inline-block">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none"><path d="M12 8H20V16H12V8Z" fill="white" fillOpacity="0.9"/><path d="M24 8H32V16H24V8Z" fill="white" fillOpacity="0.7"/><path d="M36 8H44V16H36V8Z" fill="white" fillOpacity="0.5"/><path d="M12 20H20V28H12V20Z" fill="white" fillOpacity="0.7"/><path d="M24 20H32V28H24V20Z" fill="white" fillOpacity="0.9"/><path d="M36 20H44V28H36V20Z" fill="white" fillOpacity="0.5"/><path d="M12 32H20V40H12V32Z" fill="white" fillOpacity="0.5"/><path d="M24 32H32V40H24V32Z" fill="white" fillOpacity="0.7"/><path d="M36 32H44V40H36V32Z" fill="white" fillOpacity="0.9"/></svg>
    </div>
  );

  const TriButton = ({ options, value, onChange }) => (
    <div className="flex gap-3">
      {options.map(opt => (
        <button key={String(opt.val)} onClick={() => onChange(opt.val)} className={`px-6 py-2 rounded-lg font-medium transition ${value === opt.val ? opt.active : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{opt.label}</button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-r-4 border-indigo-500">
          <div className="flex items-center gap-4 mb-2">
            <FluenceLogo />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text" style={{WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>FLUENCE</h1>
                <Activity className="text-indigo-600" size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">מערכת ניטור רציף לטיפול בנוגדי דיכאון</h2>
              <p className="text-gray-600 text-sm mt-1">מערכת מייעצת רב-ממדית: נתונים אובייקטיביים, דיווחים עצמיים ומעקב משפחתי</p>
            </div>
          </div>
        </div>

        {isLicenseValid && licenseExpiry && (
          <div className="bg-green-50 border border-green-300 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><CheckCircle className="text-green-600" size={20} /><span className="font-medium text-green-900">רישיון פעיל</span></div>
              <div className="text-sm text-green-700">תוקף עד: {new Date(licenseExpiry).toLocaleDateString('he-IL')}</div>
            </div>
          </div>
        )}

        {isLicenseValid && (
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: 'patient', label: 'פרטי מטופל', icon: <User size={20}/>, color: 'indigo' },
              { id: 'medication', label: 'נוגד דיכאון', icon: <Pill size={20}/>, color: 'indigo' },
              { id: 'wearables', label: 'מכשירים חכמים', icon: <Heart size={20}/>, color: 'indigo' },
              { id: 'daily', label: 'דיווח יומי', icon: <Moon size={20}/>, color: 'indigo' },
              { id: 'family', label: 'דיווח משפחתי', icon: <Users size={20}/>, color: 'indigo' },
              { id: 'results', label: 'ניתוח מקיף', icon: <FileText size={20}/>, color: 'indigo', disabled: !analysis },
              { id: 'admin', label: 'מנהל', icon: <User size={20}/>, color: 'red' },
            ].map(tab => (
              <button key={tab.id} onClick={() => !tab.disabled && setActiveTab(tab.id)} disabled={tab.disabled}
                className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id ? (tab.color === 'red' ? 'bg-red-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg') :
                  tab.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}>{tab.icon}{tab.label}</button>
            ))}
          </div>
        )}

        {!isLicenseValid ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-block mb-4"><FluenceLogo size={64} /></div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text mb-2" style={{WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>FLUENCE</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">הפעלת רישיון</h2>
                <p className="text-gray-600 text-sm">יש להזין מפתח רישיון תקף להמשך שימוש במערכת</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900 font-medium mb-2">💡 איך מקבלים רישיון?</p>
                <p className="text-xs text-blue-800">רק מנהל המערכת יכול ליצור מפתחות רישיון. פנה למנהל לקבלת מפתח הפעלה.</p>
              </div>
              <input type="text" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                onKeyPress={(e) => { if (e.key === 'Enter') { if (validateLicense(licenseKey)) alert('רישיון הופעל בהצלחה!'); else { alert('מפתח רישיון שגוי או פג תוקף'); setLicenseKey(''); } } }}
                placeholder="הזן מפתח רישיון (לדוגמה: MO-ABC123-XYZ789)" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4 text-center font-mono text-lg" />
              <button onClick={() => { if (validateLicense(licenseKey)) alert('רישיון הופעל בהצלחה!'); else { alert('מפתח שגוי או פג תוקף'); setLicenseKey(''); } }}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"><CheckCircle size={20} />הפעל רישיון</button>
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center mb-3">מנהל מערכת? הזן סיסמת מנהל:</p>
                <div className="flex gap-2">
                  <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyPress={(e) => { if (e.key === 'Enter') { if (adminPassword === ADMIN_PASSWORD) { setIsLicenseValid(true); setIsAdminUnlocked(true); setAdminPassword(''); setActiveTab('admin'); } else { alert('סיסמה שגויה'); setAdminPassword(''); } } }}
                    placeholder="סיסמת מנהל" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-400" />
                  <button onClick={() => { if (adminPassword === ADMIN_PASSWORD) { setIsLicenseValid(true); setIsAdminUnlocked(true); setAdminPassword(''); setActiveTab('admin'); } else { alert('סיסמה שגויה'); setAdminPassword(''); } }}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-800 transition">כניסה</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'patient' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">פרטי מטופל בסיסיים</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-gray-700 font-medium mb-2">גיל</label><input type="number" value={patientData.age} onChange={(e) => setPatientData({...patientData, age: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="35" /></div>
                <div><label className="block text-gray-700 font-medium mb-2">משקל (ק"ג)</label><input type="number" value={patientData.weight} onChange={(e) => setPatientData({...patientData, weight: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="70" /></div>
                <div><label className="block text-gray-700 font-medium mb-2">מין</label><select value={patientData.gender} onChange={(e) => setPatientData({...patientData, gender: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="male">זכר</option><option value="female">נקבה</option></select></div>
                <div><label className="block text-gray-700 font-medium mb-2">שבוע בטיפול</label><input type="number" value={patientData.treatmentWeek} onChange={(e) => setPatientData({...patientData, treatmentWeek: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="6" /></div>
                <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">אבחנה</label><input type="text" value={patientData.diagnosis} onChange={(e) => setPatientData({...patientData, diagnosis: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="דיכאון מז'ורי, הפרעת חרדה כללית" /></div>
              </div>
              <button onClick={() => setActiveTab('medication')} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">המשך לבחירת תרופה ←</button>
            </div>
          )}

          {activeTab === 'medication' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">נוגד דיכאון</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-blue-900 mb-2">מידע כללי</h3>
                <div className="text-sm text-blue-800 space-y-1"><p>• תגובה טיפולית מלאה: 4-6 שבועות</p><p>• מינון אפקטיבי משתנה בין מטופלים</p><p>• חשוב להמשיך טיפול גם לאחר שיפור</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div><label className="block text-gray-700 font-medium mb-2">תרופה</label>
                  <select value={medication.drugName||''} onChange={(e) => setMedication({...medication, drugName: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                    <option value="">בחר תרופה</option><option value="fluoxetine">Fluoxetine (Prozac)</option><option value="sertraline">Sertraline (Zoloft)</option><option value="escitalopram">Escitalopram (Cipralex)</option><option value="paroxetine">Paroxetine (Seroxat)</option><option value="citalopram">Citalopram (Cipramil)</option><option value="venlafaxine">Venlafaxine (Efexor)</option><option value="duloxetine">Duloxetine (Cymbalta)</option><option value="other">אחר</option>
                  </select></div>
                <div><label className="block text-gray-700 font-medium mb-2">מינון נוכחי (mg)</label><input type="number" value={medication.currentDose} onChange={(e) => setMedication({...medication, currentDose: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder={String(getDrugInfo(medication.drugName).standardDose||20)} /></div>
                <div><label className="block text-gray-700 font-medium mb-2">תאריך התחלת טיפול</label><input type="date" value={medication.startDate} onChange={(e) => setMedication({...medication, startDate: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" /></div>
              </div>
              {medication.drugName && medication.drugName !== 'other' && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-indigo-900 mb-2">📋 {getDrugInfo(medication.drugName).name}</h3>
                  <div className="text-sm text-indigo-800 space-y-1">
                    <p>• מינון סטנדרטי: {getDrugInfo(medication.drugName).standardDose}mg</p>
                    <p>• טווח: {getDrugInfo(medication.drugName).doseSteps.join(', ')}mg</p>
                    <p>• מקסימום: {getDrugInfo(medication.drugName).maxDose}mg</p>
                    <p>• T½: {getDrugInfo(medication.drugName).halfLife}</p>
                    {getDrugInfo(medication.drugName).notes && <p className="mt-2 text-xs bg-white p-2 rounded border border-indigo-100">💡 {getDrugInfo(medication.drugName).notes}</p>}
                  </div>
                </div>
              )}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="font-bold text-yellow-900 mb-2">תופעות לוואי נפוצות</h3>
                <ul className="text-sm text-yellow-800 list-disc list-inside space-y-1">{antidepressantKnowledge.commonSideEffects.map((se,i)=><li key={i}>{se}</li>)}</ul>
              </div>
              <button onClick={() => setActiveTab('wearables')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">המשך לנתוני מכשירים חכמים ←</button>
            </div>
          )}

          {activeTab === 'wearables' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">נתונים ממכשירים חכמים - שבוע אחרון</h2>
              <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2 mb-4">⚠️ HRV ודופק מושפעים מתרופות פסיכיאטריות - לידיעה בלבד, לא משפיעים על הניתוח</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-3 border-2 border-gray-300"><p className="text-xs font-bold text-gray-600">🔹 נתונים אובייקטיביים - משקל גבוה בניתוח</p></div>
                <div><label className="block text-gray-700 font-medium mb-2">צעדים יומיים ממוצע</label><input type="number" value={weeklyData.avgSteps} onChange={(e)=>setWeeklyData({...weeklyData, avgSteps: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="6500" /></div>
                <div><label className="block text-gray-700 font-medium mb-2">שעות שינה ממוצע</label><input type="number" step="0.5" value={weeklyData.sleepHours} onChange={(e)=>setWeeklyData({...weeklyData, sleepHours: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="7.5" /></div>
                <div><label className="block text-gray-700 font-medium mb-2">איכות שינה</label><select value={weeklyData.sleepQuality} onChange={(e)=>setWeeklyData({...weeklyData, sleepQuality: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="">בחר</option><option value="poor">גרועה</option><option value="fair">סבירה</option><option value="good">טובה</option><option value="excellent">מעולה</option></select></div>
                <div><label className="block text-gray-700 font-medium mb-2">שינוי במשקל (ק"ג)</label><input type="number" step="0.1" value={weeklyData.weightChange} onChange={(e)=>setWeeklyData({...weeklyData, weightChange: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="0.5 או -0.5" /></div>
                <div className="md:col-span-2 bg-yellow-50 rounded-lg p-3 border-2 border-yellow-300 mt-4"><p className="text-xs font-bold text-yellow-800">⚪ לידיעה בלבד - לא משפיע על ניתוח</p></div>
                <div><label className="block text-gray-700 font-medium mb-2">דופק מנוחה ממוצע (BPM)</label><input type="number" value={weeklyData.avgRestingHR} onChange={(e)=>setWeeklyData({...weeklyData, avgRestingHR: e.target.value})} className="w-full px-4 py-2 border border-yellow-200 bg-yellow-50 rounded-lg" placeholder="72" /></div>
                <div><label className="block text-gray-700 font-medium mb-2">מגמת HRV</label><select value={weeklyData.hrvTrend} onChange={(e)=>setWeeklyData({...weeklyData, hrvTrend: e.target.value})} className="w-full px-4 py-2 border border-yellow-200 bg-yellow-50 rounded-lg"><option value="improving">משתפר</option><option value="stable">יציב</option><option value="declining">יורד</option></select></div>
              </div>
              <button onClick={() => setActiveTab('daily')} className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">המשך לדיווח יומי ←</button>
            </div>
          )}

          {activeTab === 'daily' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">דיווח עצמי יומי - ממוצע שבועי</h2>
              <p className="text-gray-600 mb-6 text-sm">דיווח של 1-2 דקות מדי יום</p>
              <div className="space-y-6 mb-6">
                {[
                  { key: 'moodAvg', label: 'מצב רוח', low: 'מדוכא מאוד', high: 'מצב רוח טוב' },
                  { key: 'energyAvg', label: 'רמת אנרגיה', low: 'מותש לחלוטין', high: 'אנרגיה גבוהה' },
                  { key: 'anxietyAvg', label: 'רמת חרדה', low: 'רגוע', high: 'חרדה גבוהה' },
                  { key: 'restlessnessLevel', label: 'רמת אי-שקט/אקטיבציה', low: 'רגוע', high: 'אי-שקט גבוה' },
                ].map(s => (
                  <div key={s.key}>
                    <label className="block text-gray-700 font-medium mb-2">{s.label} (1-10): {weeklyData[s.key]}</label>
                    <input type="range" min="1" max="10" value={weeklyData[s.key]} onChange={(e)=>setWeeklyData({...weeklyData, [s.key]: parseInt(e.target.value)})} className="w-full" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1"><span>{s.low}</span><span>{s.high}</span></div>
                  </div>
                ))}
                <div><label className="block text-gray-700 font-medium mb-2">שינוי בתיאבון</label><select value={weeklyData.appetiteChange} onChange={(e)=>setWeeklyData({...weeklyData, appetiteChange: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg"><option value="decreased">ירידה</option><option value="stable">יציב</option><option value="increased">עלייה</option></select></div>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">תופעות לוואי נוכחיות</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[{key:'nausea',label:'בחילות'},{key:'headache',label:'כאבי ראש'},{key:'insomnia',label:'נדודי שינה'},{key:'sexualSideEffects',label:'תפקוד מיני'},{key:'agitation',label:'אקטיבציה/תסיסה'}].map(item=>(
                    <label key={item.key} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"><input type="checkbox" checked={weeklyData[item.key]} onChange={(e)=>setWeeklyData({...weeklyData, [item.key]: e.target.checked})} className="w-4 h-4" /><span>{item.label}</span></label>
                  ))}
                </div>
              </div>
              <button onClick={() => setActiveTab('family')} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">המשך לדיווח משפחתי ←</button>
            </div>
          )}

          {activeTab === 'family' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">דיווח משפחתי שבועי</h2>
              <p className="text-gray-600 mb-6 text-sm">תצפית של בן משפחה - פעם בשבוע</p>
              <div className="space-y-4">
                <div><label className="block text-gray-700 font-medium mb-2">האם נצפה שיפור כללי?</label>
                  <TriButton value={weeklyData.familyObservesImprovement} onChange={(v)=>setWeeklyData({...weeklyData, familyObservesImprovement: v})} options={[{val:true,label:'כן',active:'bg-green-600 text-white'},{val:false,label:'לא',active:'bg-red-600 text-white'},{val:null,label:'לא בטוח',active:'bg-gray-600 text-white'}]} /></div>
                <div><label className="block text-gray-700 font-medium mb-2">האם נצפתה אקטיבציה או אי-שקט?</label>
                  <TriButton value={weeklyData.familyObservesAgitation} onChange={(v)=>setWeeklyData({...weeklyData, familyObservesAgitation: v})} options={[{val:true,label:'כן',active:'bg-red-600 text-white'},{val:false,label:'לא',active:'bg-green-600 text-white'},{val:null,label:'לא בטוח',active:'bg-gray-600 text-white'}]} /></div>
                <div><label className="block text-gray-700 font-medium mb-2">האם נצפתה הסתגרות חברתית?</label>
                  <TriButton value={weeklyData.socialWithdrawal} onChange={(v)=>setWeeklyData({...weeklyData, socialWithdrawal: v})} options={[{val:true,label:'כן',active:'bg-red-600 text-white'},{val:false,label:'לא',active:'bg-green-600 text-white'},{val:null,label:'לא בטוח',active:'bg-gray-600 text-white'}]} /></div>
              </div>
              <div className="mt-6"><button onClick={analyzeTreatment} className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2"><TrendingUp size={20} />נתח טיפול ←</button></div>
            </div>
          )}

          {activeTab === 'admin' && (
            <div>
              {!isAdminUnlocked ? (
                <div className="max-w-md mx-auto mt-12">
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
                    <div className="text-center mb-6"><div className="inline-block mb-4"><FluenceLogo /></div><h2 className="text-2xl font-bold text-gray-800 mb-2">כניסה למנהל</h2><p className="text-gray-600 text-sm">אזור זה מיועד למנהלי מערכת בלבד</p></div>
                    <input type="password" value={adminPassword} onChange={(e)=>setAdminPassword(e.target.value)} onKeyPress={(e)=>{if(e.key==='Enter'&&adminPassword===ADMIN_PASSWORD){setIsAdminUnlocked(true);setAdminPassword('');}}} placeholder="הזן סיסמת מנהל" className="w-full px-4 py-3 border border-red-300 rounded-lg mb-4 text-center" />
                    <button onClick={()=>{if(adminPassword===ADMIN_PASSWORD){setIsAdminUnlocked(true);setAdminPassword('');}else alert('סיסמה שגויה');}} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition">כניסה</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">פאנל מנהל</h2>
                    <button onClick={()=>{setIsAdminUnlocked(false);setActiveTab('patient');}} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">התנתק</button>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-200 mb-6">
                    <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2"><FileText size={24} />מקרה לדוגמה: מטופל בן 42, דיכאון מז'ורי תחת SSRI</h3>
                    <div className="bg-white rounded-lg p-4 mb-4"><h4 className="font-bold text-gray-800 mb-2">פרטים</h4><p className="text-sm text-gray-700">• גיל: 42, נשוי + 2, מהנדס תוכנה<br/>• אבחנה: דיכאון מז'ורי, אפיזודה ראשונה<br/>• תרופה: Escitalopram 10mg, שבוע 3<br/>• תלונות: בחילות קלות, נדודי שינה (השתפרו)</p></div>
                    <div className="bg-white rounded-lg p-4 mb-4"><h4 className="font-bold text-gray-800 mb-2">ניטור</h4><p className="text-sm text-gray-700">• צעדים: 4,200/יום (ירידה מ-6,500)<br/>• שינה: 6.5 שעות, סבירה<br/>• מצב רוח: 4/10, אנרגיה: 3/10, חרדה: 7/10</p></div>
                    <div className="bg-green-50 rounded-lg p-4 border-2 border-green-300"><h4 className="font-bold text-green-900 mb-3">ניתוח צפוי</h4><div className="text-sm space-y-1 text-gray-700"><p>1. שלב מוקדם - טרם ניתן להעריך תגובה מלאה</p><p>2. אקטיבציה: נמוכה ✓</p><p>3. HAM-D חלקי: ~12 (בינוני)</p><p>4. המלצה: המשך מעקב, הערכה בשבוע 6</p><p>5. אם אין שיפור: שקול העלאה ל-15mg או 20mg</p></div></div>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-300 mb-6">
                    <h3 className="text-xl font-bold text-yellow-900 mb-4">יצירת רישיונות הפעלה</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {[{dur:'week',label:'שבוע',days:'7 ימים',fn:(d)=>{d.setDate(d.getDate()+7);return d;}},{dur:'month',label:'חודש',days:'30 ימים',fn:(d)=>{d.setMonth(d.getMonth()+1);return d;}},{dur:'year',label:'שנה',days:'365 ימים',fn:(d)=>{d.setFullYear(d.getFullYear()+1);return d;}}].map(p=>(
                        <button key={p.dur} onClick={()=>{const k=generateLicenseKey(p.dur);const exp=p.fn(new Date());const nl={key:k,duration:p.label,expiry:exp.toISOString()};setActiveLicenses([...activeLicenses,nl]);alert(`נוצר רישיון ${p.label}:\n\n${k}\n\nתוקף עד: ${exp.toLocaleDateString('he-IL')}`);}} className="bg-white rounded-lg p-4 border-2 border-gray-300 hover:bg-gray-50 transition">
                          <p className="text-sm text-gray-600 mb-1">{p.label}</p><p className="text-2xl font-bold text-indigo-700">{p.days}</p><p className="text-xs text-gray-500 mt-2">לחץ ליצירה</p>
                        </button>
                      ))}
                    </div>
                    {activeLicenses.length > 0 && (
                      <div className="bg-white rounded-lg p-4"><h4 className="font-bold text-gray-800 mb-3">רישיונות ({activeLicenses.length})</h4><div className="space-y-2 max-h-64 overflow-y-auto">{activeLicenses.map((l,i)=>(
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border"><div><p className="font-mono text-sm font-bold">{l.key}</p><p className="text-xs text-gray-600">{l.duration} • עד: {new Date(l.expiry).toLocaleDateString('he-IL')}</p></div><button onClick={()=>{navigator.clipboard.writeText(l.key);alert('הועתק');}} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded">העתק</button></div>
                      ))}</div></div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200"><p className="text-xs text-gray-600"><strong>הערה:</strong> POC להדגמה. סיסמאות ורישיונות בצד לקוח בלבד. בפרודקשן - לשרת מאובטח.</p></div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'results' && analysis && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ניתוח מקיף - שבוע {patientData.treatmentWeek}</h2>
              {analysis.drugInfo?.name && <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-4 flex items-center gap-2"><Pill className="text-indigo-600" size={18}/><span className="font-medium text-indigo-900">{analysis.drugInfo.name}</span><span className="text-sm text-indigo-700">• {medication.currentDose}mg</span></div>}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl p-6 mb-6 shadow-xl">
                <div className="flex items-center justify-between"><div><p className="text-sm opacity-90 mb-1">HAM-D משוער (5 פריטים מתוך 17)</p><div className="flex items-baseline gap-3"><p className="text-5xl font-bold">{analysis.hamiltonScore}</p><p className="text-sm opacity-90">{getHamiltonSeverity(analysis.hamiltonScore)}</p></div></div><div className="text-right"><p className="text-xs opacity-75 mb-1">מבוסס על:</p><p className="text-xs opacity-90">מצב רוח, שינה, פעילות, חרדה, משקל</p><p className="text-xs opacity-75 mt-2">ספים מכוילים לציון חלקי</p></div></div>
              </div>
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-xl p-6 mb-6 shadow-xl">
                <div className="flex items-center justify-between"><div><p className="text-sm opacity-90 mb-1">ציון ביטחון בטיפול</p><div className="flex items-baseline gap-3"><p className="text-5xl font-bold">{analysis.confidence}%</p><div className="flex items-center gap-1 text-green-300"><TrendingUp size={20}/><span className="text-sm font-medium">{analysis.trend}</span></div></div></div><div className={`px-4 py-2 rounded-lg font-bold text-lg ${analysis.recommendation.status==='continue'?'bg-green-500':analysis.recommendation.status==='adjust'?'bg-yellow-500':'bg-red-500'}`}>{analysis.recommendation.icon} {analysis.recommendation.action}</div></div>
                <div className="mt-4 pt-4 border-t border-white/20"><p className="text-sm opacity-90 mb-1">סקירה הבאה</p><p className="font-medium">{analysis.recommendation.reviewDays} ימים</p></div>
              </div>
              <div className="mb-6"><h3 className="text-lg font-bold text-gray-800 mb-3">גורמים מרכזיים</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{analysis.keyDrivers.map((d,i)=>(<div key={i} className={`p-3 rounded-lg border-r-4 ${d.impact==='positive'?'bg-green-50 border-green-500':d.impact==='negative'?'bg-red-50 border-red-500':'bg-yellow-50 border-yellow-500'}`}><p className="text-sm font-medium">{d.label}</p><p className="text-xs text-gray-600 mt-1">{d.value}</p>{d.note&&<p className="text-xs text-gray-400 mt-1">{d.note}</p>}</div>))}</div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4"><p className="text-sm text-gray-600 mb-1">שבוע בטיפול</p><p className="text-2xl font-bold text-blue-900">{patientData.treatmentWeek}</p><p className="text-xs text-gray-500 mt-1">{analysis.steadyStateReached?'✓ תגובה מלאה צפויה':'⏳ טרם הגיע למצב יציב'}</p></div>
                <div className={`border-2 rounded-lg p-4 ${analysis.activation.level==='high'?'bg-red-50 border-red-500':analysis.activation.level==='moderate'?'bg-yellow-50 border-yellow-500':'bg-green-50 border-green-500'}`}><p className="text-sm text-gray-600 mb-1">ציון אקטיבציה</p><p className="text-2xl font-bold">{analysis.activation.score}</p><p className="text-xs mt-1">{analysis.activation.level==='high'?'⚠️ גבוה':analysis.activation.level==='moderate'?'⚡ בינוני':'✓ נמוך'}</p></div>
                <div className={`border-2 rounded-lg p-4 ${analysis.therapeuticResponse.status==='good'?'bg-green-50 border-green-500':analysis.therapeuticResponse.status==='poor'?'bg-red-50 border-red-500':analysis.therapeuticResponse.status==='early'?'bg-blue-50 border-blue-500':'bg-yellow-50 border-yellow-500'}`}><p className="text-sm text-gray-600 mb-1">תגובה טיפולית</p><p className="text-sm font-bold mt-1">{analysis.therapeuticResponse.message}</p></div>
              </div>
              {analysis.alerts.length>0&&<div className="mb-6 space-y-3">{analysis.alerts.map((a,i)=>(<div key={i} className={`p-4 rounded-lg border-r-4 flex items-start gap-3 ${a.type==='warning'?'bg-yellow-50 border-yellow-500':'bg-blue-50 border-blue-500'}`}><AlertTriangle className={a.type==='warning'?'text-yellow-600':'text-blue-600'} size={24}/><div><p className="font-bold">{a.title}</p><p className="text-sm mt-1">{a.message}</p></div></div>))}</div>}
              {analysis.recommendations.length>0&&<div className="mb-6"><h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2"><FileText size={24}/>המלצות קליניות</h3>{analysis.recommendations.map((r,i)=>(<div key={i} className={`mb-3 p-4 rounded-lg border-r-4 ${r.type==='danger'?'bg-red-50 border-red-500':r.type==='warning'?'bg-yellow-50 border-yellow-500':r.type==='success'?'bg-green-50 border-green-500':'bg-blue-50 border-blue-500'}`}><p className="font-bold text-sm text-gray-600">{r.category}</p><p className="mt-1">{r.message}</p></div>))}</div>}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={24} className="text-indigo-600"/>סיכום ניטור אובייקטיבי (משקל גבוה)</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-sm text-gray-600">שינה</p><p className="font-bold text-lg">{analysis.continuousMonitoring.sleepPattern}</p></div>
                  <div><p className="text-sm text-gray-600">פעילות</p><p className="font-bold text-lg">{analysis.continuousMonitoring.activityLevel}</p></div>
                  <div><p className="text-sm text-gray-600">משקל</p><p className="font-bold text-lg">{analysis.continuousMonitoring.weightTrend}</p></div>
                  <div className="bg-yellow-100 rounded p-2"><p className="text-sm text-gray-600">דופק (לידיעה)</p><p className="font-bold text-lg text-yellow-800">{analysis.continuousMonitoring.heartRate}</p></div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"><p className="text-sm text-gray-700"><strong>הערה חשובה:</strong> זהו POC להדגמה. המערכת מיועדת לשמש כלי תומך החלטה בלבד ואינה מחליפה שיקול דעת רפואי.</p></div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
