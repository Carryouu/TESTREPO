import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loadUserData = async (username) => {
  const { data, error } = await supabase.from("ppl_data").select("data").eq("username", username).single();
  if (error || !data) return null;
  return data.data;
};

const saveUserData = async (username, userData) => {
  await supabase.from("ppl_data").upsert({ username, data: userData, updated_at: new Date().toISOString() });
};

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => { const h = setTimeout(() => setDv(value), delay); return () => clearTimeout(h); }, [value, delay]);
  return dv;
}

const EXERCISES = [
  { id:"crunch_cable", name:"Crunch Câble", emoji:"🔗", default1RM:30, category:"Core" },
  { id:"crunch_dec", name:"Crunch Décliné", emoji:"📐", default1RM:0, category:"Core" },
  { id:"rdj", name:"Relevé de Jambes", emoji:"🦵", default1RM:0, category:"Core" },
  { id:"ab_wheel", name:"Ab Wheel", emoji:"⚙️", default1RM:0, category:"Core" },
  { id:"crunch_russe", name:"Crunch Russe Lesté", emoji:"🔄", default1RM:10, category:"Core" },
  { id:"pallof", name:"Pallof Press", emoji:"🎯", default1RM:15, category:"Core" },
  { id:"press_vert", name:"Presse Verticale", emoji:"🦾", default1RM:120, category:"Legs" },
  { id:"leg_curl_al", name:"Leg Curl Allongé", emoji:"🦵", default1RM:40, category:"Legs" },
  { id:"dc", name:"Développé Couché", emoji:"🏋️", default1RM:95, category:"Push" },
  { id:"di", name:"Développé Incliné", emoji:"📐", default1RM:60, category:"Push" },
  { id:"dm", name:"Développé Militaire", emoji:"🔝", default1RM:70, category:"Push" },
  { id:"dips", name:"Dips Lestés", emoji:"⬇️", default1RM:120, category:"Push" },
  { id:"pecdeck", name:"Pec Deck", emoji:"🦋", default1RM:60, category:"Push" },
  { id:"cables", name:"Câbles Croisés", emoji:"✂️", default1RM:15, category:"Push" },
  { id:"lateral", name:"Écarté Latéral", emoji:"🙆", default1RM:12, category:"Push" },
  { id:"poulie_lat", name:"Poulie Latérale", emoji:"🔁", default1RM:10, category:"Push" },
  { id:"bf", name:"Barre Front", emoji:"🧠", default1RM:50, category:"Push" },
  { id:"tirage_uni", name:"Tirage Unilatéral", emoji:"🎯", default1RM:15, category:"Push" },
  { id:"trac_neutre", name:"Tractions Neutre", emoji:"🔼", default1RM:20, category:"Pull" },
  { id:"trac_pro", name:"Tractions Pronation", emoji:"⬆️", default1RM:15, category:"Pull" },
  { id:"th", name:"Tirage Horizontal", emoji:"↔️", default1RM:80, category:"Pull" },
  { id:"tbar", name:"T-Bar Row", emoji:"🏗️", default1RM:60, category:"Pull" },
  { id:"facepull", name:"Face Pull", emoji:"😤", default1RM:20, category:"Pull" },
  { id:"curl_marteau", name:"Curl Marteau", emoji:"🔨", default1RM:20, category:"Pull" },
  { id:"curl_classique", name:"Curl Classique", emoji:"💪", default1RM:15, category:"Pull" },
  { id:"curl_incline", name:"Curl Incliné", emoji:"〰️", default1RM:12, category:"Pull" },
  { id:"squat", name:"Squat Barre", emoji:"🦵", default1RM:100, category:"Legs" },
  { id:"hack", name:"Hack Squat", emoji:"🏔️", default1RM:80, category:"Legs" },
  { id:"squat_disque", name:"Squat Disque", emoji:"💿", default1RM:60, category:"Legs" },
  { id:"leg_ext", name:"Leg Extension", emoji:"🦿", default1RM:60, category:"Legs" },
  { id:"leg_curl", name:"Leg Curl", emoji:"🦶", default1RM:50, category:"Legs" },
];

const ABDOS = [
  { exoId:"crunch_cable", sets:3, repsMin:15, repsMax:20, intensityPct:null, note:"Haut ventre" },
  { exoId:"rdj", sets:3, repsMin:15, repsMax:20, intensityPct:null, note:"Bas ventre" },
  { exoId:"crunch_russe", sets:3, repsMin:15, repsMax:20, intensityPct:null, note:"Obliques" },
];

const PROGRAM = {
  1:{ name:"PUSH — Force", type:"Push", cardio:"20 min tapis incliné (4km/h / 15%)", exercises:[
    { exoId:"dc", sets:4, repsMin:4, repsMax:6, intensityPct:87.5, note:"Force max" },
    { exoId:"di", sets:3, repsMin:6, repsMax:8, intensityPct:77.5, note:"Accent haut pec" },
    { exoId:"dips", sets:3, repsMin:6, repsMax:8, intensityPct:null, note:"Lest max possible" },
    { exoId:"dm", sets:4, repsMin:5, repsMax:6, intensityPct:82.5, note:"Debout de préférence" },
    { exoId:"lateral", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Contrôle strict" },
    { exoId:"poulie_lat", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Finition" },
    { exoId:"bf", sets:4, repsMin:8, repsMax:10, intensityPct:null, note:"Coudes fixes" },
    { exoId:"tirage_uni", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Isolation triceps" },
    ...ABDOS,
  ]},
  2:{ name:"PULL — Force", type:"Pull", cardio:"20 min tapis incliné (4km/h / 15%)", exercises:[
    { exoId:"trac_neutre", sets:4, repsMin:5, repsMax:8, intensityPct:null, note:"Lestées si possible" },
    { exoId:"trac_pro", sets:3, repsMin:6, repsMax:8, intensityPct:null, note:"Coudes vers le bas" },
    { exoId:"th", sets:4, repsMin:8, repsMax:10, intensityPct:null, note:"Rétraction scapulaire" },
    { exoId:"curl_marteau", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Brachial + biceps" },
    { exoId:"curl_classique", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Supination en haut" },
    ...ABDOS,
  ]},
  3:{ name:"LEGS — Lourd", type:"Legs", cardio:null, exercises:[
    { exoId:"squat", sets:5, repsMin:4, repsMax:6, intensityPct:87.5, note:"Priorité absolue" },
    { exoId:"hack", sets:4, repsMin:6, repsMax:8, intensityPct:null, note:"Focus quadri" },
    { exoId:"press_vert", sets:4, repsMin:8, repsMax:12, intensityPct:null, note:"Amplitude complète" },
    { exoId:"leg_ext", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Finition quadri" },
    { exoId:"leg_curl", sets:4, repsMin:10, repsMax:12, intensityPct:null, note:"Ischio, amplitude max" },
    { exoId:"leg_curl_al", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Ischio en allongé" },
    ...ABDOS,
  ]},
  4:{ name:"PUSH — Variante", type:"Push", cardio:"20 min tapis incliné (4km/h / 15%)", exercises:[
    { exoId:"dc", sets:4, repsMin:4, repsMax:6, intensityPct:87.5, note:"Force max" },
    { exoId:"di", sets:3, repsMin:6, repsMax:8, intensityPct:77.5, note:"Haltères si fatigue" },
    { exoId:"pecdeck", sets:3, repsMin:6, repsMax:8, intensityPct:null, note:"Alternative dips" },
    { exoId:"dm", sets:4, repsMin:5, repsMax:6, intensityPct:82.5, note:"Debout" },
    { exoId:"lateral", sets:4, repsMin:10, repsMax:12, intensityPct:null, note:"+1 série vs lundi" },
    { exoId:"poulie_lat", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Finition" },
    { exoId:"bf", sets:4, repsMin:8, repsMax:10, intensityPct:null, note:"Coudes fixes" },
    { exoId:"cables", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Finition pec" },
    ...ABDOS,
  ]},
  5:{ name:"PULL — Variante", type:"Pull", cardio:"20 min tapis incliné (4km/h / 15%)", exercises:[
    { exoId:"trac_neutre", sets:4, repsMin:5, repsMax:8, intensityPct:null, note:"Lestées si possible" },
    { exoId:"trac_pro", sets:3, repsMin:6, repsMax:8, intensityPct:null, note:"Amplitude complète" },
    { exoId:"tbar", sets:4, repsMin:8, repsMax:10, intensityPct:null, note:"Alternative tirage" },
    { exoId:"facepull", sets:3, repsMin:12, repsMax:15, intensityPct:null, note:"Santé épaule" },
    { exoId:"curl_marteau", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Brachial + biceps" },
    { exoId:"curl_incline", sets:3, repsMin:10, repsMax:12, intensityPct:null, note:"Alternative curl" },
    ...ABDOS,
  ]},
  6:{ name:"REPOS ACTIF", type:null, cardio:"40 min marche rapide", exercises:[] },
  0:{ name:"REPOS TOTAL", type:null, cardio:null, exercises:[] },
};

const ZONES = [
  { label:"Force Max", pct:90, color:"#FF4444", reps:"3-5 reps" },
  { label:"Force", pct:85, color:"#FF7700", reps:"4-6 reps" },
  { label:"Hypertrophie+", pct:80, color:"#FFB300", reps:"6-8 reps" },
  { label:"Hypertrophie", pct:75, color:"#44CC44", reps:"8-10 reps" },
  { label:"Volume", pct:70, color:"#44AAFF", reps:"10-12 reps" },
  { label:"Endurance", pct:60, color:"#AA88FF", reps:"12-15 reps" },
];

const ACTIVITY_LEVELS = [
  { id:"sed", label:"Sédentaire", factor:1.2, example:"Bureau, 0 sport" },
  { id:"light", label:"Légèrement actif", factor:1.375, example:"Bureau + 1-2 séances/sem" },
  { id:"mod", label:"Modérément actif", factor:1.55, example:"Bureau + PPL sans cardio" },
  { id:"active", label:"Très actif", factor:1.725, example:"Bureau + PPL + cardio ✅" },
  { id:"athlete", label:"Athlète", factor:1.9, example:"2x/jour ou boulot physique" },
];

const OBJECTIFS = [
  { id:"seche_douce", label:"🔥 Sèche douce", desc:"−0.25 kg/sem", deficit:-250, protPerKg:2.2, fatPerKg:1.0 },
  { id:"seche_standard", label:"🔥 Sèche standard", desc:"−0.5 kg/sem", deficit:-500, protPerKg:2.4, fatPerKg:0.9 },
  { id:"seche_rapide", label:"🔥 Sèche rapide", desc:"−0.75 kg/sem", deficit:-750, protPerKg:2.5, fatPerKg:0.9 },
  { id:"seche_agressive", label:"🔥 Sèche agressive", desc:"−1 kg/sem", deficit:-1000, protPerKg:2.6, fatPerKg:0.8 },
  { id:"recompo", label:"⚖️ Recompo", desc:"Gras↓ Muscle↑", deficit:-150, protPerKg:2.2, fatPerKg:1.0 },
  { id:"maintenance", label:"🎯 Maintenance", desc:"Maintenir", deficit:0, protPerKg:1.8, fatPerKg:1.0 },
  { id:"pdm_lean", label:"📈 PDM Lean", desc:"+0.25 kg/sem", deficit:250, protPerKg:2.0, fatPerKg:1.0 },
  { id:"pdm_standard", label:"📈 PDM Standard", desc:"+0.5 kg/sem", deficit:500, protPerKg:1.8, fatPerKg:1.0 },
  { id:"pdm_rapide", label:"💪 PDM Rapide", desc:"+1 kg/sem", deficit:1000, protPerKg:1.8, fatPerKg:1.1 },
];

const CARDIO_TYPES = [
  { id:"pas", name:"Pas Quotidiens", emoji:"👟", isSteps:true },
  { id:"tapis", name:"Tapis Incliné", emoji:"📐", isIncline:true },
  { id:"marche", name:"Marche", emoji:"🚶", isDistance:true, kcalPerKm:1.0 },
  { id:"course", name:"Course", emoji:"🏃", isDistance:true, kcalPerKm:1.1 },
  { id:"velo", name:"Vélo cardio", emoji:"🚴", kcalPerMin:{ low:6, med:9, high:12 } },
  { id:"rameur", name:"Rameur", emoji:"🚣", kcalPerMin:{ low:7, med:10, high:13 } },
  { id:"hiit", name:"HIIT", emoji:"⚡", kcalPerMin:{ low:10, med:14, high:18 } },
];

const REST_OPTIONS = [
  { label:"45s", s:45 }, { label:"1 min", s:60 }, { label:"90s", s:90 },
  { label:"2 min", s:120 }, { label:"3 min", s:180 }, { label:"5 min", s:300 },
];

const TABS = [
  { id:"programme", label:"🗓️ Séance" },
  { id:"log", label:"📝 Logger" },
  { id:"kcal", label:"🍽️ Nutrition" },
  { id:"poids", label:"⚖️ Poids" },
  { id:"stats", label:"📈 Stats" },
  { id:"calc", label:"📊 Charges" },
  { id:"coach", label:"🤖 Coach" },
];

const round = n => Math.round(n / 2.5) * 2.5;
const todayKey = () => new Date().toISOString().split("T")[0];
const WEEK_KEY = () => { const n=new Date(),s=new Date(n.getFullYear(),0,1); return `${n.getFullYear()}-W${Math.ceil(((n-s)/86400000+s.getDay()+1)/7)}`; };
const dateToKey = d => d.toISOString().split("T")[0];
const keyToDate = k => new Date(k+"T12:00:00");
const fmtShort = k => keyToDate(k).toLocaleDateString("fr-FR",{weekday:"short",day:"numeric",month:"short"});
const catColor = { Push:"#FF6B35", Pull:"#4ECDC4", Legs:"#FFE66D", Core:"#AA88FF" };

const Card = ({ children, style={} }) => (
  <div style={{ background:"#111118", border:"1px solid #1E1E2E", borderRadius:14, padding:16, marginBottom:10, ...style }}>{children}</div>
);
const Label = ({ children }) => (
  <div style={{ fontSize:11, color:"#555", textTransform:"uppercase", letterSpacing:2, marginBottom:8 }}>{children}</div>
);
const Btn = ({ onClick, children, color="#FF6B35", textColor="#000", disabled=false, style={} }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ background:disabled?"#1A1A2A":color, border:"none", borderRadius:12, color:disabled?"#444":textColor, padding:14, fontWeight:900, fontSize:15, cursor:disabled?"not-allowed":"pointer", width:"100%", ...style }}>
    {children}
  </button>
);
const NumInput = ({ value, onChange, placeholder, style={} }) => (
  <input type="text" inputMode="decimal" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
    style={{ width:"100%", background:"#0D0D14", border:"1px solid #2A2A3A", borderRadius:10, color:"#fff", padding:12, fontSize:16, fontWeight:700, outline:"none", boxSizing:"border-box", ...style }} />
);

const LineChart = ({ data, color="#4ECDC4", unit="" }) => {
  if (!data||data.length<2) return <div style={{color:"#333",textAlign:"center",padding:20,fontSize:12}}>Pas assez de données</div>;
  const vals=data.map(d=>d.val),mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const W=300,H=110,P=20,iW=W-P*2,iH=H-P*2-14;
  const pts=data.map((d,i)=>({x:P+(i/(data.length-1))*iW,y:P+(1-(d.val-mn)/rng)*iH,v:d.val,l:d.label}));
  const path=pts.map((p,i)=>`${i?"L":"M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join("");
  const gId=`g${color.replace("#","")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
      <defs><linearGradient id={gId} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      {[0,0.5,1].map(t=><line key={t} x1={P} y1={P+t*iH} x2={W-P} y2={P+t*iH} stroke="#1A1A2A" strokeWidth="1"/>)}
      <path d={`${path}L${pts[pts.length-1].x},${P+iH}L${P},${P+iH}Z`} fill={`url(#${gId})`}/>
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=>(
        <g key={i}><circle cx={p.x} cy={p.y} r="4" fill={color} stroke="#0A0A0F" strokeWidth="2"/>
          {(i===0||i===pts.length-1)&&<>
            <text x={Math.min(Math.max(p.x,28),W-28)} y={p.y-8} textAnchor="middle" fill={color} fontSize="10" fontWeight="700">{p.v}{unit}</text>
            <text x={Math.min(Math.max(p.x,22),W-22)} y={H} textAnchor="middle" fill="#444" fontSize="8">{p.l}</text>
          </>}
        </g>
      ))}
    </svg>
  );
};

const BarChart = ({ data }) => {
  if (!data||!data.length) return <div style={{color:"#333",textAlign:"center",padding:16,fontSize:12}}>Pas encore de données</div>;
  const maxAbs=Math.max(...data.map(d=>Math.abs(d.deficit)),200);
  const W=300,H=120,P=18,iW=W-P*2,mid=H/2,bw=Math.max(6,iW/data.length-4);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%"}}>
      <line x1={P} y1={mid} x2={W-P} y2={mid} stroke="#2A2A3A" strokeWidth="1"/>
      {data.map((d,i)=>{
        const x=P+(i/data.length)*iW+(iW/data.length-bw)/2;
        const ratio=Math.min(1,Math.abs(d.deficit)/maxAbs),h=ratio*(mid-P-4),isOk=d.deficit>=0;
        const color=isOk?"#44CC44":"#FF4444";
        return(<g key={i}>
          <rect x={x} y={isOk?mid-h:mid} width={bw} height={h} rx="2" fill={color} opacity="0.8"/>
          {(i===0||i===data.length-1)&&<>
            <text x={x+bw/2} y={isOk?mid-h-3:mid+h+10} textAnchor="middle" fill={color} fontSize="8" fontWeight="700">{d.deficit>0?"+":""}{d.deficit}</text>
            <text x={x+bw/2} y={H} textAnchor="middle" fill="#444" fontSize="7">{d.label}</text>
          </>}
        </g>);
      })}
    </svg>
  );
};

const ExoSelector = ({ filterCat, setFilterCat, selectedExo, setSelectedExo }) => (
  <>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {["Push","Pull","Legs","Core"].map(cat=>(
        <button key={cat} onClick={()=>{setFilterCat(cat);setSelectedExo(EXERCISES.find(e=>e.category===cat)?.id);}}
          style={{flex:1,padding:9,borderRadius:10,border:"none",cursor:"pointer",background:filterCat===cat?catColor[cat]:"#111118",color:filterCat===cat?"#000":"#555",fontWeight:filterCat===cat?800:400,fontSize:14}}>{cat}</button>
      ))}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
      {EXERCISES.filter(e=>e.category===filterCat).map(e=>(
        <button key={e.id} onClick={()=>setSelectedExo(e.id)}
          style={{padding:"6px 11px",borderRadius:20,border:"none",cursor:"pointer",background:selectedExo===e.id?catColor[e.category]:"#16161F",color:selectedExo===e.id?"#000":"#666",fontWeight:selectedExo===e.id?800:500,fontSize:12}}>
          {e.emoji} {e.name}
        </button>
      ))}
    </div>
  </>
);

function LoginScreen({ onLogin }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    try {
      const { data } = await supabase.from("ppl_data").select("username").eq("username", trimmed).single();
      onLogin(trimmed, !!data);
    } catch { onLogin(trimmed, false); }
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0F",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:56,marginBottom:8}}>🏋️</div>
          <div style={{fontSize:10,letterSpacing:4,color:"#FF6B35",fontWeight:700,textTransform:"uppercase"}}>PPL TRACKER</div>
          <div style={{fontSize:22,fontWeight:900,marginTop:6}}>Qui s'entraîne ?</div>
          <div style={{fontSize:12,color:"#444",marginTop:6}}>Tes données sont sauvegardées dans le cloud ☁️</div>
        </div>
        <div style={{background:"#111118",border:"1px solid #1E1E2E",borderRadius:16,padding:24}}>
          <Label>Ton prénom</Label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder="ex: Mehdi" autoFocus
            style={{width:"100%",background:"#0D0D14",border:"1px solid #2A2A3A",borderRadius:10,color:"#fff",padding:14,fontSize:20,fontWeight:700,outline:"none",boxSizing:"border-box",marginBottom:16}}/>
          <Btn onClick={handleLogin} disabled={!name.trim()||loading}>{loading?"Connexion...":"Accéder à mon profil →"}</Btn>
        </div>
        <div style={{marginTop:14,fontSize:11,color:"#444",textAlign:"center",lineHeight:1.8}}>
          Nouveau ? Tape ton prénom et crée ton profil.<br/>Déjà inscrit ? Tape le même prénom pour retrouver tes données.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  if (!currentUser) return <LoginScreen onLogin={(user) => setCurrentUser(user)} />;
  return <Tracker user={currentUser} onLogout={() => setCurrentUser(null)} />;
}

function Tracker({ user, onLogout }) {
  const defaultMaxes = Object.fromEntries(EXERCISES.map(e=>[e.id,e.default1RM]));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [maxes, setMaxes] = useState(defaultMaxes);
  const [history, setHistory] = useState({});
  const [sessions, setSessions] = useState({});
  const [profile, setProfile] = useState({age:22,taille:186,poids:80,sexe:"homme",activite:"active"});
  const [objectif, setObjectif] = useState("recompo");
  const [poidsLog, setPoidsLog] = useState({});
  const [cardioLog, setCardioLog] = useState({});
  const [calMangees, setCalMangees] = useState({});

  useEffect(() => {
    const init = async () => {
      const data = await loadUserData(user);
      if (data) {
        if (data.maxes) setMaxes(data.maxes);
        if (data.history) setHistory(data.history);
        if (data.sessions) setSessions(data.sessions);
        if (data.profile) setProfile(data.profile);
        if (data.objectif) setObjectif(data.objectif);
        if (data.poidsLog) setPoidsLog(data.poidsLog);
        if (data.cardioLog) setCardioLog(data.cardioLog);
        if (data.calMangees) setCalMangees(data.calMangees);
      }
      setIsLoaded(true);
    };
    init();
  }, [user]);

  const userData = { maxes, history, sessions, profile, objectif, poidsLog, cardioLog, calMangees };
  const debouncedData = useDebounce(userData, 2000);

  useEffect(() => {
    if (!isLoaded) return;
    setIsSaving(true);
    saveUserData(user, debouncedData).finally(() => setIsSaving(false));
  }, [debouncedData]);

  const [activeTab, setActiveTab] = useState("programme");
  const [selectedExo, setSelectedExo] = useState("dc");
  const [filterCat, setFilterCat] = useState("Push");
  const [selectedSessionDate, setSelectedSessionDate] = useState(todayKey());
  
  // ⚡ LA NOUVELLE MASTER DATE UNIQUE POUR LA NUTRITION ET LE CARDIO
  const [selectedNutriDate, setSelectedNutriDate] = useState(todayKey());
  
  // 📅 State pour le nouveau module "Recap depuis une date"
  const [customRecapDate, setCustomRecapDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 7); return dateToKey(d);
  });

  const [logWeight, setLogWeight] = useState("");
  const [logReps, setLogReps] = useState("");
  const [editingMax, setEditingMax] = useState(false);
  const [tempMax, setTempMax] = useState("");
  const [timerDuration, setTimerDuration] = useState(120);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerEndTime, setTimerEndTime] = useState(null);
  const [notification, setNotification] = useState(null);
  const [cardioType, setCardioType] = useState("pas");
  const [cardioVal, setCardioVal] = useState("");
  const [cardioIntensite, setCardioIntensite] = useState("med");
  const [tapisVitesse, setTapisVitesse] = useState("");
  const [tapisPente, setTapisPente] = useState("");
  const [tapisDuree, setTapisDuree] = useState("");
  const [inputPoids, setInputPoids] = useState("");
  const [statsExo, setStatsExo] = useState("dc");
  const [statsFilter, setStatsFilter] = useState("Push");
  const [statsMode, setStatsMode] = useState("1rm");
  const [coachInput, setCoachInput] = useState("");
  const [coachHistory, setCoachHistory] = useState([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [tmpProfile, setTmpProfile] = useState({});
  const coachEndRef = useRef(null);

  useEffect(() => { coachEndRef.current?.scrollIntoView({behavior:"smooth"}); }, [coachHistory]);

  useEffect(() => {
    if (!timerEndTime) { setTimerActive(false); setTimerSeconds(0); return; }
    const update = () => {
      const rem = Math.round((timerEndTime - Date.now()) / 1000);
      if (rem <= 0) { setTimerActive(false); setTimerSeconds(0); setTimerEndTime(null); }
      else { setTimerActive(true); setTimerSeconds(rem); }
    };
    update(); const iv = setInterval(update, 1000); return () => clearInterval(iv);
  }, [timerEndTime]);

  const startTimer = dur => setTimerEndTime(Date.now() + dur * 1000);
  const stopTimer = () => { setTimerEndTime(null); setTimerActive(false); setTimerSeconds(0); };
  const notify = (msg, type="success") => { setNotification({msg,type}); setTimeout(() => setNotification(null), 3000); };

  // CALULS DE BASE (TDEE, Objectifs)
  const poids = parseFloat(profile.poids) || 80;
  const mbr = profile.sexe === "homme"
    ? Math.round(10*poids + 6.25*(parseFloat(profile.taille)||186) - 5*(parseFloat(profile.age)||22) + 5)
    : Math.round(10*poids + 6.25*(parseFloat(profile.taille)||186) - 5*(parseFloat(profile.age)||22) - 161);
  const actFactor = ACTIVITY_LEVELS.find(a=>a.id===profile.activite)?.factor || 1.725;
  const tdee = Math.round(mbr * actFactor);
  const objData = OBJECTIFS.find(o=>o.id===objectif) || OBJECTIFS[4];
  
  // DONNÉES DU JOUR SELECTIONNÉ (NUTRITION)
  const nutriCardioData = cardioLog[selectedNutriDate] || [];
  const nutriCardioTotal = nutriCardioData.reduce((s,e)=>s+e.kcal, 0);
  const nutriMangeTotal = parseInt(calMangees[selectedNutriDate]) || 0;
  const nutriCibleKcal = tdee + objData.deficit + nutriCardioTotal; // Ce qu'il DOIT manger
  const nutriDeficitGenere = (nutriMangeTotal > 0) ? (tdee + nutriCardioTotal) - nutriMangeTotal : null;

  // DONNÉES HEADER (Aujourd'hui)
  const headerCardioTotal = (cardioLog[todayKey()] || []).reduce((s,e)=>s+e.kcal, 0);
  const headerCibleKcal = tdee + objData.deficit + headerCardioTotal;
  const headerMangeTotal = parseInt(calMangees[todayKey()]) || 0;
  const headerDeficitGenere = (headerMangeTotal > 0) ? (tdee + headerCardioTotal) - headerMangeTotal : null;

  const cibleProt = Math.round(poids * objData.protPerKg);
  const cibleLip = Math.round(poids * objData.fatPerKg);
  const cibleGluc = Math.max(0, Math.round((headerCibleKcal - cibleProt*4 - cibleLip*9) / 4));

  // FONCTION UNIVERSELLE DE RECAP
  const getRecapInfos = (startKey, endKey) => {
    let depenseTotal = 0;
    let mangeTotal = 0;
    let jours = 0;
    
    // On ne calcule le déficit QUE pour les jours où tu as rentré tes calories
    Object.keys(calMangees).forEach(date => {
      if (date >= startKey && date <= endKey) {
        const cal = parseInt(calMangees[date]);
        if (cal > 0) {
          jours++;
          mangeTotal += cal;
          const cardioJour = (cardioLog[date] || []).reduce((sum, item) => sum + item.kcal, 0);
          depenseTotal += (tdee + cardioJour);
        }
      }
    });
    return { jours, depense: depenseTotal, mange: mangeTotal, deficit: depenseTotal - mangeTotal };
  };

  // RECAP DE LA SEMAINE EN COURS (Lundi à Aujourd'hui)
  const recapSemaine = (() => {
    const now = new Date(), dow = now.getDay()===0?7:now.getDay(), lundi = new Date(now);
    lundi.setDate(now.getDate() - dow + 1);
    return getRecapInfos(dateToKey(lundi), todayKey());
  })();

  // RECAP CUSTOM
  const recapCustomStats = getRecapInfos(customRecapDate, todayKey());

  const deficitChartData = (() => {
    const datesSet = new Set([...Object.keys(calMangees), ...Object.keys(cardioLog)]);
    const allDates = Array.from(datesSet).sort().slice(-14);
    
    return allDates.filter(d => parseInt(calMangees[d]) > 0).map(date => {
      const eaten = parseInt(calMangees[date]);
      const cardioJour = (cardioLog[date] || []).reduce((s,e)=>s+e.kcal, 0);
      return { 
        deficit: Math.round((tdee + cardioJour) - eaten), 
        label: new Date(date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"}) 
      };
    });
  })();

  const todayDow = new Date().getDay();
  const todayProgram = PROGRAM[todayDow] || PROGRAM[0];
  const isToday = selectedSessionDate === todayKey();
  const currentSets = sessions[selectedExo]?.[selectedSessionDate] || [];
  const exo = EXERCISES.find(e=>e.id===selectedExo) || EXERCISES[0];
  const current1RM = maxes[selectedExo] || exo.default1RM;

  const navDaySession = offset => {
    const d = keyToDate(selectedSessionDate); d.setDate(d.getDate() + offset);
    const nk = dateToKey(d); if (nk <= todayKey()) setSelectedSessionDate(nk);
  };

  const navDayNutri = offset => {
    const d = keyToDate(selectedNutriDate); d.setDate(d.getDate() + offset);
    const nk = dateToKey(d); if (nk <= todayKey()) setSelectedNutriDate(nk);
  };

  const getRecommendedWeight = (exoId, intensityPct) => {
    const rm = maxes[exoId] || EXERCISES.find(e=>e.id===exoId)?.default1RM || 0;
    const exoSessions = sessions[exoId] || {};
    const pastDates = Object.keys(exoSessions).filter(d=>d!==selectedSessionDate).sort().reverse();
    const last = pastDates.length ? {date:pastDates[0], sets:exoSessions[pastDates[0]]} : null;
    const progExo = Object.values(PROGRAM).flatMap(p=>p.exercises||[]).find(e=>e.exoId===exoId);
    if (last?.sets?.length > 0) {
      const lw = last.sets[0].weight, avgReps = last.sets.reduce((s,x)=>s+x.reps,0)/last.sets.length;
      if (progExo) {
        if (avgReps >= progExo.repsMax) return {weight:round(lw+2.5), tag:"↑ +2.5kg", tagColor:"#44CC44"};
        if (avgReps >= progExo.repsMin) return {weight:lw, tag:"= Maintien", tagColor:"#FFB300"};
        return {weight:round(Math.max(lw-2.5,0)), tag:"↓ −2.5kg", tagColor:"#FF4444"};
      }
      return {weight:lw, tag:"= Maintien", tagColor:"#888"};
    }
    if (intensityPct) return {weight:round(rm*intensityPct/100), tag:`${intensityPct}% 1RM`, tagColor:"#888"};
    return {weight:null, tag:"Nouveau", tagColor:"#888"};
  };

  const getLastSession = exoId => {
    const s = sessions[exoId] || {};
    const dates = Object.keys(s).filter(d=>d!==selectedSessionDate).sort().reverse();
    return dates.length ? {date:dates[0], sets:s[dates[0]]} : null;
  };

  const addSet = () => {
    const w = parseFloat(logWeight), r = parseInt(logReps);
    if (isNaN(w)||isNaN(r)||r<=0||w<=0) return;
    const newSet = {weight:w, reps:r, time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})};
    const newSets = [...currentSets, newSet];
    setSessions(prev=>({...prev,[selectedExo]:{...(prev[selectedExo]||{}),[selectedSessionDate]:newSets}}));
    const est1RM = round(w*(1+r/30));
    if (est1RM > current1RM) { setMaxes(prev=>({...prev,[selectedExo]:est1RM})); notify(`🔥 Nouveau 1RM : ${est1RM} kg !`, "pr"); }
    else notify(`Série ${newSets.length} enregistrée ✓`);
    const best = newSets.reduce((b,s)=>round(s.weight*(1+s.reps/30))>round(b.weight*(1+b.reps/30))?s:b);
    setHistory(prev=>({...prev,[selectedExo]:{...(prev[selectedExo]||{}),[WEEK_KEY()]:{weight:best.weight,reps:best.reps,sets:newSets.length,estimated1RM:round(best.weight*(1+best.reps/30)),date:new Date().toLocaleDateString("fr-FR")}}}));
    if (isToday) startTimer(timerDuration);
    setLogWeight(""); setLogReps("");
  };

  const duplicateLastSet = () => {
    if (!currentSets.length) return;
    const last = currentSets[currentSets.length-1];
    const newSets = [...currentSets, {weight:last.weight, reps:last.reps, time:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}];
    setSessions(prev=>({...prev,[selectedExo]:{...(prev[selectedExo]||{}),[selectedSessionDate]:newSets}}));
    notify(`🔁 Série ${newSets.length} dupliquée`);
    if (isToday) startTimer(timerDuration);
  };

  const deleteSet = idx => {
    const updated = currentSets.filter((_,i)=>i!==idx);
    setSessions(prev=>({...prev,[selectedExo]:{...(prev[selectedExo]||{}),[selectedSessionDate]:updated}}));
    notify("Série supprimée");
  };

  const cardioTypeData = CARDIO_TYPES.find(c=>c.id===cardioType);
  const isDistance = !!cardioTypeData?.isDistance, isIncline = !!cardioTypeData?.isIncline, isSteps = !!cardioTypeData?.isSteps;
  const calcTapisKcal = () => {
    const v=parseFloat(tapisVitesse),p=parseFloat(tapisPente),d=parseFloat(tapisDuree);
    if (isNaN(v)||isNaN(p)||isNaN(d)||d<=0) return 0;
    const MET = (0.1*(v*1000/60) + 1.8*(v*1000/60)*(p/100) + 3.5) / 3.5;
    return Math.round(MET * poids * (d/60));
  };
  const kcalEstimee = isIncline ? calcTapisKcal() : (cardioVal ? (isSteps ? Math.round((parseFloat(cardioVal)/1000)*poids*0.5) : isDistance ? Math.round(parseFloat(cardioVal)*poids*(cardioTypeData?.kcalPerKm||1)) : Math.round(parseFloat(cardioVal)*(cardioTypeData?.kcalPerMin?.[cardioIntensite]||10))) : 0);

  const logCardio = () => {
    if (isIncline) {
      if (kcalEstimee<=0) return;
      setCardioLog({...cardioLog,[selectedNutriDate]:[...nutriCardioData,{type:cardioType,nom:`Tapis ${tapisVitesse}km/h ${tapisPente}%`,val:parseFloat(tapisDuree),unit:"min",kcal:kcalEstimee,heure:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}]});
      setTapisVitesse(""); setTapisPente(""); setTapisDuree("");
    } else {
      const val = parseFloat(cardioVal); if (isNaN(val)||val<=0) return;
      setCardioLog({...cardioLog,[selectedNutriDate]:[...nutriCardioData,{type:cardioType,nom:cardioTypeData.name,val,unit:isSteps?"pas":isDistance?"km":"min",kcal:kcalEstimee,heure:new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})}]});
      setCardioVal("");
    }
    notify(`Cardio logué le ${fmtShort(selectedNutriDate)} : ~${kcalEstimee} kcal 🔥`);
  };

  const logPoids = () => {
    const val = parseFloat(inputPoids.toString().replace(",", "."));
    if (isNaN(val)||val<30||val>200) return;
    setPoidsLog({...poidsLog,[todayKey()]:val});
    setProfile(p=>({...p,poids:val}));
    setInputPoids("");
    notify(`Poids : ${val} kg enregistré`);
  };

  const deletePoids = (date) => {
    const newLog = {...poidsLog}; delete newLog[date]; setPoidsLog(newLog);
    notify("Poids supprimé");
  };

  const poidsEntries = Object.entries(poidsLog).sort((a,b)=>b[0].localeCompare(a[0]));
  const poidsAujourdhui = poidsLog[todayKey()];
  const poidsHier = (() => { const h=new Date(); h.setDate(h.getDate()-1); return poidsLog[h.toISOString().split("T")[0]]; })();
  const poidsTendance = poidsHier && poidsAujourdhui ? +(poidsAujourdhui - poidsHier).toFixed(1) : null;
  const weightChartData = poidsEntries.slice(0,14).reverse().map(([date,val])=>({val, label:new Date(date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}));

  const chargeChartData = Object.entries(sessions[statsExo]||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-12).map(([date,sets])=>({val:sets.length?Math.max(...sets.map(s=>s.weight)):0, label:fmtShort(date)}));
  const repsChartData = Object.entries(sessions[statsExo]||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-12).map(([date,sets])=>({val:sets.length?+(sets.reduce((s,x)=>s+x.reps,0)/sets.length).toFixed(1):0, label:fmtShort(date)}));
  const rm1ChartData = Object.entries(history[statsExo]||{}).sort((a,b)=>a[0].localeCompare(b[0])).slice(-12).map(([wk,d])=>({val:d.estimated1RM, label:`S${wk.split("-W")[1]||""}`}));

  const askCoach = async () => {
    if (!coachInput.trim()||coachLoading) return;
    const userMsg = coachInput.trim(); setCoachInput("");
    const newHist = [...coachHistory, {role:"user",content:userMsg}];
    setCoachHistory(newHist); setCoachLoading(true);
    try {
      const sys = `Tu es un coach fitness expert, direct, en français. Profil: ${profile.age}ans, ${profile.taille}cm, ${poids}kg. Objectif: ${objData.label} → ${headerCibleKcal}kcal/j. Macros: ${cibleProt}g P/${cibleGluc}g G/${cibleLip}g L. PPL 5j/sem. 1RM DC:${maxes.dc||95}kg Squat:${maxes.squat||100}kg. Réponds en max 150 mots.`;
      const res = await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:400,system:sys,messages:newHist})});
      const data = await res.json();
      setCoachHistory([...newHist, {role:"assistant",content:data.content?.[0]?.text||"Erreur."}]);
    } catch { setCoachHistory([...newHist, {role:"assistant",content:"Erreur de connexion."}]); }
    setCoachLoading(false);
  };

  if (!isLoaded) return (
    <div style={{minHeight:"100vh",background:"#0A0A0F",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontSize:48}}>🏋️</div>
      <div style={{color:"#FF6B35",fontWeight:700,fontSize:16}}>Chargement de tes données...</div>
      <div style={{color:"#444",fontSize:12}}>Connexion à la base de données</div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0A0A0F",fontFamily:"'DM Sans','Segoe UI',sans-serif",color:"#F0F0F0"}}>
      {notification && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",background:notification.type==="pr"?"linear-gradient(135deg,#FF6B35,#FF4444)":"#101820",border:"1px solid #2A4A2A",color:"#fff",padding:"12px 24px",borderRadius:12,fontWeight:700,zIndex:999,fontSize:14,whiteSpace:"nowrap"}}>{notification.msg}</div>}

      {timerActive && (
        <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#111118",borderTop:"2px solid #FF6B35",padding:"12px 20px 14px",zIndex:100}}>
          <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:10}}>
            <div style={{minWidth:64}}>
              <div style={{fontSize:9,color:"#555",textTransform:"uppercase"}}>Repos</div>
              <div style={{fontSize:30,fontWeight:900,color:timerSeconds<15?"#FF4444":"#FF6B35",lineHeight:1}}>{Math.floor(timerSeconds/60)}:{(timerSeconds%60).toString().padStart(2,"0")}</div>
            </div>
            <div style={{flex:1}}><div style={{background:"#1A1A2A",borderRadius:6,height:8,overflow:"hidden"}}><div style={{background:timerSeconds<15?"#FF4444":"#FF6B35",borderRadius:6,height:8,width:`${Math.min(100,(timerSeconds/timerDuration)*100)}%`,transition:"width 1s linear"}}/></div></div>
          </div>
          <button onClick={stopTimer} style={{width:"100%",background:"#1A1A0A",border:"2px solid #FF6B35",borderRadius:12,color:"#FF6B35",padding:12,cursor:"pointer",fontWeight:800,fontSize:15}}>⏭ Skip le repos</button>
        </div>
      )}

      {/* HEADER TOUJOURS SUR "AUJOURD'HUI" */}
      <div style={{background:"#111118",borderBottom:"1px solid #1A1A2E",padding:"16px 20px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:10,letterSpacing:4,color:"#FF6B35",fontWeight:700,textTransform:"uppercase"}}>PPL TRACKER</div>
            <div style={{fontSize:18,fontWeight:900,letterSpacing:-1}}>Salut <span style={{color:"#FF6B35",textTransform:"capitalize"}}>{user}</span> 👋</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:900,color:"#FF6B35"}}>{headerCibleKcal.toLocaleString()}</div>
            <div style={{fontSize:9,color:"#555"}}>kcal cible aujourd'hui</div>
            <div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end",marginTop:2}}>
              {isSaving && <div style={{fontSize:9,color:"#444"}}>💾 auto-save...</div>}
              <button onClick={onLogout} style={{background:"transparent",border:"none",color:"#333",fontSize:10,cursor:"pointer"}}>changer d'utilisateur</button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginTop:10}}>
          {[
            {label:"Mangé", val:headerMangeTotal>0?`${headerMangeTotal} kcal`:"—", color:headerMangeTotal>0?"#F0F0F0":"#444"},
            {label:"Cardio", val:headerCardioTotal>0?`+${headerCardioTotal}`:"—", color:headerCardioTotal>0?"#FF6B35":"#444"},
            {label:"Déficit", val:headerDeficitGenere!==null?`${headerDeficitGenere>0?"+":""}${headerDeficitGenere}`:"—", color:headerDeficitGenere!==null?(headerDeficitGenere>0?"#44CC44":headerDeficitGenere<-200?"#FF4444":"#FFB300"):"#444"},
          ].map(item=>(
            <div key={item.label} style={{flex:1,background:"#0D0D14",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
              <div style={{fontSize:9,color:"#444"}}>{item.label}</div>
              <div style={{fontSize:12,fontWeight:800,color:item.color,marginTop:2}}>{item.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TABS */}
      <div style={{padding:"8px 12px 0",overflowX:"auto"}}>
        <div style={{display:"flex",gap:4,background:"#111118",borderRadius:12,padding:4,minWidth:"max-content"}}>
          {TABS.map(({id,label})=>(
            <button key={id} onClick={()=>setActiveTab(id)}
              style={{padding:"8px 11px",border:"none",borderRadius:9,cursor:"pointer",background:activeTab===id?"#1E1E2E":"transparent",color:activeTab===id?"#F0F0F0":"#555",fontWeight:activeTab===id?700:400,fontSize:11,whiteSpace:"nowrap"}}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{padding:"14px 16px",paddingBottom:timerActive?120:40}}>

        {/* SÉANCE */}
        {activeTab==="programme" && (
          <>
            <div style={{background:todayProgram.type?`linear-gradient(135deg,${catColor[todayProgram.type]}22,#111118)`:"#111118",border:`2px solid ${todayProgram.type?catColor[todayProgram.type]:"#2A2A3A"}`,borderRadius:16,padding:"16px 20px",marginBottom:14}}>
              <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:2,marginBottom:4}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</div>
              <div style={{fontSize:24,fontWeight:900,color:todayProgram.type?catColor[todayProgram.type]:"#444"}}>{todayProgram.name}</div>
              {todayProgram.cardio && <div style={{fontSize:12,color:"#555",marginTop:6}}>🏃 {todayProgram.cardio}</div>}
            </div>
            {(todayProgram.exercises||[]).map((progExo,i)=>{
              const exoData = EXERCISES.find(e=>e.id===progExo.exoId); if (!exoData) return null;
              const rec = getRecommendedWeight(progExo.exoId, progExo.intensityPct);
              const lastSess = getLastSession(progExo.exoId);
              const todaySets = sessions[progExo.exoId]?.[todayKey()] || [];
              const done = todaySets.length >= progExo.sets;
              return (
                <div key={i} style={{background:done?"#0A1A0A":"#111118",border:`1px solid ${done?"#2A4A2A":"#1E1E2E"}`,borderRadius:12,padding:14,marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,color:done?"#44CC44":"#F0F0F0"}}>{done?"✅ ":""}{exoData.emoji} {exoData.name}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{progExo.sets}×{progExo.repsMin}-{progExo.repsMax} • {progExo.note}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      {rec.weight && <div style={{fontSize:22,fontWeight:900,color:catColor[exoData.category]}}>{rec.weight} kg</div>}
                      <div style={{fontSize:11,fontWeight:700,color:rec.tagColor}}>{rec.tag}</div>
                      <div style={{fontSize:10,color:"#333"}}>1RM : {maxes[progExo.exoId]||exoData.default1RM} kg</div>
                    </div>
                  </div>
                  {lastSess && <div style={{background:"#0D0D14",borderRadius:8,padding:"6px 10px",marginBottom:8,fontSize:11,color:"#555"}}>Dernière ({fmtShort(lastSess.date)}) : {lastSess.sets.map((s,j)=><span key={j} style={{color:"#888"}}>{s.weight}×{s.reps}{j<lastSess.sets.length-1?", ":""}</span>)}</div>}
                  {todaySets.length>0 && <div style={{fontSize:11,color:"#44CC44",marginBottom:6}}>{todaySets.map(s=>`${s.weight}×${s.reps}`).join(", ")} ({todaySets.length}/{progExo.sets})</div>}
                  <button onClick={()=>{setSelectedExo(progExo.exoId);setFilterCat(exoData.category);setSelectedSessionDate(todayKey());setActiveTab("log");}}
                    style={{background:catColor[exoData.category]+"22",border:`1px solid ${catColor[exoData.category]}44`,borderRadius:8,color:catColor[exoData.category],padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12,width:"100%"}}>
                    {done?"✏️ Modifier":"📝 Logger →"}
                  </button>
                </div>
              );
            })}
            {todayProgram.exercises?.length===0 && <div style={{textAlign:"center",padding:"40px 20px"}}><div style={{fontSize:48}}>😴</div><div style={{fontSize:16,color:"#444",marginTop:12}}>Repos — mange bien, dors bien</div></div>}
          </>
        )}

        {/* LOGGER */}
        {activeTab==="log" && (
          <>
            <ExoSelector filterCat={filterCat} setFilterCat={setFilterCat} selectedExo={selectedExo} setSelectedExo={setSelectedExo}/>
            <div style={{background:"#111118",border:"1px solid #1E1E2E",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button onClick={()=>navDaySession(-1)} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:8,color:"#888",padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:18}}>←</button>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:14,color:isToday?"#FF6B35":"#F0F0F0"}}>{isToday?"📅 Aujourd'hui":fmtShort(selectedSessionDate)}</div>
                {!isToday && <div style={{fontSize:11,color:"#FF6B35",marginTop:2}}>⚠️ Mode édition historique</div>}
              </div>
              <button onClick={()=>navDaySession(1)} disabled={isToday} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:8,color:isToday?"#333":"#888",padding:"8px 14px",cursor:isToday?"not-allowed":"pointer",fontWeight:700,fontSize:18}}>→</button>
            </div>
            {(()=>{
              const progExoData = Object.values(PROGRAM).flatMap(p=>p.exercises||[]).find(e=>e.exoId===selectedExo);
              const rec = getRecommendedWeight(selectedExo, progExoData?.intensityPct);
              const lastSess = getLastSession(selectedExo);
              return (
                <div style={{background:"linear-gradient(135deg,#1A1000,#0A0A18)",border:`2px solid ${catColor[exo?.category]}55`,borderRadius:14,padding:14,marginBottom:12}}>
                  <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:2,marginBottom:8}}>🎯 Recommandation séance</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                    {progExoData && <>
                      <div style={{background:catColor[exo?.category]+"22",border:`1px solid ${catColor[exo?.category]}44`,borderRadius:8,padding:"8px 14px",flex:1,textAlign:"center"}}>
                        <div style={{fontSize:9,color:"#555"}}>SÉRIES</div>
                        <div style={{fontSize:24,fontWeight:900,color:catColor[exo?.category]}}>{progExoData.sets}</div>
                      </div>
                      <div style={{background:"#FFB30022",border:"1px solid #FFB30044",borderRadius:8,padding:"8px 14px",flex:1,textAlign:"center"}}>
                        <div style={{fontSize:9,color:"#555"}}>REPS</div>
                        <div style={{fontSize:24,fontWeight:900,color:"#FFB300"}}>{progExoData.repsMin}–{progExoData.repsMax}</div>
                      </div>
                      {rec.weight && <div style={{background:"#44CC4422",border:"1px solid #44CC4444",borderRadius:8,padding:"8px 14px",flex:1,textAlign:"center"}}>
                        <div style={{fontSize:9,color:"#555"}}>CHARGE</div>
                        <div style={{fontSize:24,fontWeight:900,color:"#44CC44"}}>{rec.weight} kg</div>
                      </div>}
                    </>}
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12,fontWeight:700,color:rec.tagColor}}>{rec.tag}{progExoData?.note?` • ${progExoData.note}`:""}</div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:9,color:"#555"}}>1RM</div><div style={{fontSize:20,fontWeight:900,color:catColor[exo?.category]}}>{current1RM} kg</div></div>
                  </div>
                  {lastSess && <div style={{marginTop:8,background:"#0D0D14",borderRadius:8,padding:"6px 10px",fontSize:11,color:"#555"}}>Dernière ({fmtShort(lastSess.date)}) : {lastSess.sets.map((s,j)=><span key={j} style={{color:"#888"}}>{s.weight}×{s.reps}{j<lastSess.sets.length-1?", ":""}</span>)}</div>}
                </div>
              );
            })()}
            <div style={{marginBottom:12}}>
              <Label>Temps de repos</Label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {REST_OPTIONS.map(r=>(
                  <button key={r.s} onClick={()=>setTimerDuration(r.s)}
                    style={{padding:"7px 12px",borderRadius:20,border:`1px solid ${timerDuration===r.s?"#FF6B35":"#1E1E2E"}`,cursor:"pointer",background:timerDuration===r.s?"#FF6B3522":"#111118",color:timerDuration===r.s?"#FF6B35":"#555",fontWeight:timerDuration===r.s?700:400,fontSize:12}}>{r.label}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
              <div><Label>Charge (kg)</Label><NumInput value={logWeight} onChange={setLogWeight} placeholder="ex: 90"/></div>
              <div><Label>Reps</Label><NumInput value={logReps} onChange={setLogReps} placeholder="ex: 5"/></div>
            </div>
            {logWeight && logReps && !isNaN(parseFloat(logWeight)) && !isNaN(parseInt(logReps)) && (
              <div style={{background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,padding:"10px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:12,color:"#555"}}>1RM estimé (Epley)</div>
                <div style={{fontSize:20,fontWeight:900,color:"#FF6B35"}}>{round(parseFloat(logWeight)*(1+parseInt(logReps)/30))} kg {round(parseFloat(logWeight)*(1+parseInt(logReps)/30))>current1RM&&<span style={{fontSize:12,color:"#44CC44",marginLeft:8}}>🔥 PR!</span>}</div>
              </div>
            )}
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <Btn onClick={addSet} color={catColor[exo?.category]} style={{flex:1}}>+ Série {currentSets.length+1}</Btn>
              {currentSets.length>0 && <button onClick={duplicateLastSet} style={{background:"#1E1E2E",border:`1px solid ${catColor[exo?.category]}44`,borderRadius:12,color:catColor[exo?.category],padding:"14px 16px",fontWeight:800,fontSize:20,cursor:"pointer"}}>🔁</button>}
            </div>
            {currentSets.length>0 && (
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><Label>Séries — {exo?.name}</Label><span style={{fontSize:12,color:"#555"}}>{currentSets.length} série{currentSets.length>1?"s":""}</span></div>
                {currentSets.map((s,i)=>{
                  const est = round(s.weight*(1+s.reps/30));
                  const isBest = i===currentSets.reduce((bi,x,j)=>round(x.weight*(1+x.reps/30))>round(currentSets[bi].weight*(1+currentSets[bi].reps/30))?j:bi,0);
                  return (
                    <div key={i} style={{background:isBest&&currentSets.length>1?"#141410":"#111118",border:`1px solid ${isBest&&currentSets.length>1?"#FFB30033":"#1E1E2E"}`,borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:28,height:28,borderRadius:"50%",background:catColor[exo?.category]+"22",border:`1px solid ${catColor[exo?.category]}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:catColor[exo?.category]}}>{i+1}</div>
                        <div><div style={{fontWeight:800,fontSize:15}}>{s.weight} kg × {s.reps} reps {isBest&&currentSets.length>1?"⭐":""}</div><div style={{fontSize:11,color:"#555"}}>~{est} kg{s.time?` • ${s.time}`:""}</div></div>
                      </div>
                      <button onClick={()=>deleteSet(i)} style={{background:"#2A0A0A",border:"1px solid #FF444433",borderRadius:8,color:"#FF4444",padding:"5px 8px",cursor:"pointer",fontSize:12}}>🗑️</button>
                    </div>
                  );
                })}
                {currentSets.length>=2 && <div style={{background:"#0D0D14",borderRadius:10,padding:"10px 14px",marginTop:4,fontSize:12,color:"#555",display:"flex",gap:16}}>
                  <span>⭐ {currentSets.reduce((b,s)=>round(s.weight*(1+s.reps/30))>round(b.weight*(1+b.reps/30))?s:b).weight}×{currentSets.reduce((b,s)=>round(s.weight*(1+s.reps/30))>round(b.weight*(1+b.reps/30))?s:b).reps}</span>
                  <span>∅ {(currentSets.reduce((s,x)=>s+x.weight,0)/currentSets.length).toFixed(1)} kg</span>
                  <span>Vol {currentSets.reduce((s,x)=>s+x.weight*x.reps,0)} kg</span>
                </div>}
              </div>
            )}
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <Label>1RM — {exo?.name}</Label>
                  {editingMax ? (
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <input type="text" inputMode="decimal" value={tempMax} onChange={e=>setTempMax(e.target.value)} style={{background:"#1A1A2A",border:"1px solid #FF6B35",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:20,fontWeight:700,width:90,outline:"none"}} autoFocus/>
                      <span style={{color:"#888"}}>kg</span>
                      <button onClick={()=>{const v=parseFloat(tempMax);if(!isNaN(v)&&v>0){setMaxes(p=>({...p,[selectedExo]:v}));setEditingMax(false);notify(`1RM : ${v} kg`);}}} style={{background:"#FF6B35",border:"none",borderRadius:8,color:"#000",padding:"6px 12px",fontWeight:800,cursor:"pointer"}}>OK</button>
                      <button onClick={()=>setEditingMax(false)} style={{background:"#222",border:"none",borderRadius:8,color:"#888",padding:"6px 10px",cursor:"pointer"}}>✕</button>
                    </div>
                  ) : (
                    <div style={{fontSize:34,fontWeight:900,color:catColor[exo?.category],letterSpacing:-1}}>{current1RM} <span style={{fontSize:14,color:"#555",fontWeight:400}}>kg</span></div>
                  )}
                </div>
                {!editingMax && <button onClick={()=>{setEditingMax(true);setTempMax(current1RM);}} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:10,color:"#888",padding:"10px 12px",cursor:"pointer",fontSize:13}}>✏️</button>}
              </div>
            </Card>
            {(()=>{
              const allDates = Object.keys(sessions[selectedExo]||{}).sort().reverse().filter(d=>d!==selectedSessionDate).slice(0,5);
              if (!allDates.length) return null;
              return (
                <div style={{marginTop:4}}>
                  <Label>Historique — {exo?.name}</Label>
                  {allDates.map(date=>(
                    <button key={date} onClick={()=>setSelectedSessionDate(date)} style={{width:"100%",background:"#0D0D14",border:"1px solid #1A1A2A",borderRadius:10,padding:"10px 14px",marginBottom:6,textAlign:"left",cursor:"pointer"}}>
                      <div style={{fontSize:11,color:"#555",marginBottom:4}}>{fmtShort(date)}</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(sessions[selectedExo][date]||[]).map((s,i)=><span key={i} style={{background:"#111118",borderRadius:6,padding:"3px 8px",fontSize:12,color:"#888"}}>{s.weight}×{s.reps}</span>)}</div>
                      <div style={{fontSize:10,color:"#4ECDC4",marginTop:4}}>Tap pour éditer →</div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </>
        )}

        {/* ========================================================================= */}
        {/* NUTRITION & CARDIO (FUSIONNÉS) */}
        {/* ========================================================================= */}
        {activeTab==="kcal" && (
          <>
            <Card>
              <Label>Mon objectif</Label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                {OBJECTIFS.map(o=>{
                  const tc = o.label.startsWith("🔥")?"#FF4444":o.label.startsWith("⚖️")?"#FFB300":o.label.startsWith("🎯")?"#4ECDC4":"#4488FF";
                  return <button key={o.id} onClick={()=>setObjectif(o.id)} style={{padding:"10px 12px",borderRadius:12,border:`1px solid ${objectif===o.id?tc:"#1E1E2E"}`,cursor:"pointer",textAlign:"left",background:objectif===o.id?tc+"22":"#111118",color:objectif===o.id?tc:"#666",fontWeight:objectif===o.id?800:400,fontSize:13}}>
                    <div style={{fontWeight:700}}>{o.label}</div><div style={{fontSize:11,opacity:0.7}}>{o.desc}</div>
                  </button>;
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <Label>Profil</Label>
                <button onClick={()=>{setEditingProfile(!editingProfile);setTmpProfile({...profile});}} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:8,color:"#888",padding:"5px 10px",cursor:"pointer",fontSize:12}}>{editingProfile?"Fermer":"✏️ Éditer"}</button>
              </div>
              {editingProfile && (
                <div style={{marginBottom:12}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                    {[{label:"Âge",key:"age"},{label:"Taille (cm)",key:"taille"},{label:"Poids (kg)",key:"poids"}].map(({label,key})=>(
                      <div key={key}><Label>{label}</Label><input type="text" inputMode="decimal" value={tmpProfile[key]||""} onChange={e=>setTmpProfile(p=>({...p,[key]:e.target.value}))} style={{width:"100%",background:"#0D0D14",border:"1px solid #2A2A3A",borderRadius:8,color:"#fff",padding:10,fontSize:15,fontWeight:700,outline:"none",boxSizing:"border-box"}}/></div>
                    ))}
                    <div><Label>Sexe</Label><div style={{display:"flex",gap:6}}>{["homme","femme"].map(s=><button key={s} onClick={()=>setTmpProfile(p=>({...p,sexe:s}))} style={{flex:1,padding:10,border:"none",borderRadius:8,cursor:"pointer",background:tmpProfile.sexe===s?"#FF6B35":"#111118",color:tmpProfile.sexe===s?"#000":"#555",fontWeight:700,fontSize:13}}>{s.charAt(0).toUpperCase()+s.slice(1)}</button>)}</div></div>
                  </div>
                  <Label>Niveau d'activité</Label>
                  {ACTIVITY_LEVELS.map(a=><button key={a.id} onClick={()=>setTmpProfile(p=>({...p,activite:a.id}))} style={{width:"100%",textAlign:"left",padding:"9px 12px",borderRadius:8,border:`1px solid ${tmpProfile.activite===a.id?"#FF6B35":"#1A1A2A"}`,cursor:"pointer",background:tmpProfile.activite===a.id?"#FF6B3522":"#0D0D14",color:tmpProfile.activite===a.id?"#FF6B35":"#666",marginBottom:5,fontSize:12}}><span style={{fontWeight:700}}>{a.label}</span> — <span style={{color:"#555"}}>{a.example}</span></button>)}
                  <Btn onClick={()=>{setProfile({...tmpProfile});setEditingProfile(false);notify("Profil mis à jour ✓");}} style={{marginTop:10}}>Sauvegarder</Btn>
                </div>
              )}
            </Card>

            {/* LE MASTER SELECTEUR DE DATE */}
            <div style={{background:"#0D0D14",border:"1px solid #1E1E2E",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <button onClick={()=>navDayNutri(-1)} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:8,color:"#888",padding:"8px 14px",cursor:"pointer",fontWeight:700,fontSize:18}}>←</button>
              <div style={{textAlign:"center"}}>
                <div style={{fontWeight:800,fontSize:14,color:selectedNutriDate===todayKey()?"#FF6B35":"#F0F0F0"}}>{selectedNutriDate===todayKey()?"📅 Aujourd'hui":fmtShort(selectedNutriDate)}</div>
                {selectedNutriDate!==todayKey() && <div style={{fontSize:11,color:"#FF6B35",marginTop:2}}>⚠️ Vision Historique</div>}
              </div>
              <button onClick={()=>navDayNutri(1)} disabled={selectedNutriDate===todayKey()} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:8,color:selectedNutriDate===todayKey()?"#333":"#888",padding:"8px 14px",cursor:selectedNutriDate===todayKey()?"not-allowed":"pointer",fontWeight:700,fontSize:18}}>→</button>
            </div>

            <Card>
              <Label>Calories mangées le {fmtShort(selectedNutriDate)}</Label>
              <div style={{display:"flex",gap:8,marginBottom:12}}>
                <NumInput 
                  value={calMangees[selectedNutriDate]||""} 
                  onChange={v=>setCalMangees(prev=>({...prev,[selectedNutriDate]:v}))} 
                  placeholder={`Cible du jour : ${nutriCibleKcal} kcal`} 
                  style={{flex:1, border:"1px solid #FF6B3555"}}
                />
                <button 
                  onClick={async () => {
                    setIsSaving(true);
                    await saveUserData(user, { maxes, history, sessions, profile, objectif, poidsLog, cardioLog, calMangees });
                    setIsSaving(false);
                    notify("✅ Calories sauvegardées !");
                  }} 
                  style={{background:"#FF6B35", border:"none", borderRadius:10, color:"#000", fontWeight:900, padding:"0 16px", cursor:"pointer", fontSize:14}}
                >
                  OK 💾
                </button>
              </div>
              
              <div style={{background:"#0D0D14", border:"1px solid #1E1E2E", borderRadius:12, padding:14, marginBottom:12}}>
                <div style={{fontSize:11, color:"#888", marginBottom:8, textTransform:"uppercase", letterSpacing:1}}>🧮 L'équation du Mutant</div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#F0F0F0", marginBottom:4}}>
                  <span>Métabolisme + Activité</span><span>{tdee} kcal</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#FF6B35", marginBottom:4}}>
                  <span>Cardio ce jour</span><span>+{nutriCardioTotal} kcal</span>
                </div>
                <div style={{height:1, background:"#2A2A3A", margin:"8px 0"}}/>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:800, color:"#fff", marginBottom:4}}>
                  <span>Dépense Totale (TDEE + Cardio)</span><span>{tdee + nutriCardioTotal} kcal</span>
                </div>
                <div style={{display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:800, color:"#44CC44", marginBottom:10}}>
                  <span>Mangé ce jour</span><span>- {nutriMangeTotal || 0} kcal</span>
                </div>
                
                {nutriMangeTotal > 0 ? (
                  <div style={{textAlign:"center", background:nutriDeficitGenere > 0 ? "#44CC4422" : "#FF444422", border:`1px solid ${nutriDeficitGenere > 0 ? "#44CC44" : "#FF4444"}`, borderRadius:8, padding:"10px", marginTop:8}}>
                    <div style={{fontSize:11, color:"#F0F0F0"}}>Déficit généré sur ce jour</div>
                    <div style={{fontSize:24, fontWeight:900, color:nutriDeficitGenere > 0 ? "#44CC44" : "#FF4444"}}>
                      {nutriDeficitGenere > 0 ? "+" : ""}{nutriDeficitGenere} kcal
                    </div>
                  </div>
                ) : (
                  <div style={{textAlign:"center", fontSize:12, color:"#555", marginTop:10}}>
                    Rentre tes calories pour voir le déficit réel de ce jour.
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <Label>Ajouter du Cardio à ce jour</Label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
                {CARDIO_TYPES.map(c=><button key={c.id} onClick={()=>setCardioType(c.id)} style={{padding:10,borderRadius:12,cursor:"pointer",background:cardioType===c.id?"#FF6B3522":"#0D0D14",border:`1px solid ${cardioType===c.id?"#FF6B35":"#1E1E2E"}`,color:cardioType===c.id?"#FF6B35":"#555",fontWeight:cardioType===c.id?800:400,fontSize:12,textAlign:"left"}}><span style={{fontSize:16}}>{c.emoji}</span> {c.name}</button>)}
              </div>
              {isIncline ? (
                <>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                    <div><Label>Vitesse km/h</Label><NumInput value={tapisVitesse} onChange={setTapisVitesse} placeholder="4"/></div>
                    <div><Label>Pente %</Label><NumInput value={tapisPente} onChange={setTapisPente} placeholder="15"/></div>
                    <div><Label>Durée min</Label><NumInput value={tapisDuree} onChange={setTapisDuree} placeholder="20"/></div>
                  </div>
                  {calcTapisKcal()>0 && <div style={{textAlign:"center",marginBottom:10,fontSize:28,fontWeight:900,color:"#FF6B35"}}>~{calcTapisKcal()} kcal</div>}
                </>
              ) : (
                <>
                  <NumInput value={cardioVal} onChange={setCardioVal} placeholder={isSteps?"ex: 8000":isDistance?"ex: 18.5":"ex: 30"} style={{marginBottom:isDistance||isSteps?10:6}}/>
                  {!isDistance && !isSteps && <div style={{display:"flex",gap:6,marginBottom:10}}>{[{id:"low",label:"🟢 Faible"},{id:"med",label:"🟡 Modérée"},{id:"high",label:"🔴 Haute"}].map(item=><button key={item.id} onClick={()=>setCardioIntensite(item.id)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:`1px solid ${cardioIntensite===item.id?"#FF6B35":"#1E1E2E"}`,cursor:"pointer",background:cardioIntensite===item.id?"#FF6B3522":"#111118",color:cardioIntensite===item.id?"#FF6B35":"#555",fontWeight:cardioIntensite===item.id?700:400,fontSize:12}}>{item.label}</button>)}</div>}
                  {cardioVal && kcalEstimee>0 && <div style={{textAlign:"center",marginBottom:10,fontSize:28,fontWeight:900,color:"#FF6B35"}}>~{kcalEstimee} kcal</div>}
                </>
              )}
              <Btn onClick={logCardio} color="#FF6B35">🔥 Logger le cardio pour le {fmtShort(selectedNutriDate)}</Btn>
              
              {nutriCardioData.length>0 && <div style={{marginTop:12}}><Label>Cardio enregistré ce jour-là</Label>{nutriCardioData.map((s,i)=><div key={i} style={{background:"#0D0D14",border:"1px solid #1E1E2E",borderRadius:10,padding:"10px 14px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontWeight:700,fontSize:13}}>{CARDIO_TYPES.find(c=>c.id===s.type)?.emoji} {s.nom}</div><div style={{fontSize:11,color:"#555"}}>{s.val} {s.unit} • {s.heure}</div></div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:16,fontWeight:900,color:"#FF6B35"}}>+{s.kcal}</div><button onClick={()=>setCardioLog({...cardioLog,[selectedNutriDate]:nutriCardioData.filter((_,j)=>j!==i)})} style={{background:"#2A0A0A",border:"1px solid #FF444433",borderRadius:8,color:"#FF4444",padding:"5px 8px",cursor:"pointer",fontSize:12}}>🗑️</button></div></div>)}</div>}
            </Card>

            {/* SECTION RECAP ET BILANS */}
            <div style={{margin:"24px 0 12px 0", fontSize:16, fontWeight:900, color:"#AA88FF", textTransform:"uppercase", letterSpacing:1}}>📈 Bilans & Statistiques</div>
            
            {deficitChartData.length>0 && (
              <Card>
                <Label>Déficit des 14 derniers jours logués</Label>
                <div style={{background:"#0D0D14",borderRadius:10,padding:12,marginBottom:12}}><BarChart data={deficitChartData}/></div>
                
                <Label>Bilan Semaine (Depuis Lundi)</Label>
                <div style={{background:"#0D0D14",borderRadius:10,padding:"10px 14px", marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:12,color:"#555"}}>{recapSemaine.jours} jour(s) logué(s)</div>
                    <div style={{fontSize:18,fontWeight:900,color:recapSemaine.deficit>0?"#44CC44":recapSemaine.deficit<-500?"#FF4444":"#FFB300"}}>{recapSemaine.deficit>0?"+":""}{recapSemaine.deficit} kcal</div>
                  </div>
                  <div style={{fontSize:11,color:"#444",marginTop:4}}>Perte théorique : ~{Math.abs(Math.round(recapSemaine.deficit/7700*100)/100)} kg</div>
                </div>

                <Label>Recap depuis une date précise</Label>
                <div style={{background:"#0D0D14", border:"1px solid #1E1E2E", borderRadius:10, padding:14}}>
                  <input type="date" value={customRecapDate} onChange={e=>setCustomRecapDate(e.target.value)} max={todayKey()} 
                    style={{width:"100%", background:"#1A1A2A", border:"1px solid #2A2A3A", borderRadius:8, color:"#fff", padding:"8px 12px", marginBottom:12, outline:"none"}} />
                  
                  <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#F0F0F0", marginBottom:4}}>
                    <span>Jours logués</span><span>{recapCustomStats.jours} jours</span>
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#F0F0F0", marginBottom:4}}>
                    <span>Dépense totale (TDEE+Cardio)</span><span>{recapCustomStats.depense} kcal</span>
                  </div>
                  <div style={{display:"flex", justifyContent:"space-between", fontSize:12, color:"#FFB300", marginBottom:8}}>
                    <span>Total Mangé</span><span>- {recapCustomStats.mange} kcal</span>
                  </div>
                  <div style={{height:1, background:"#2A2A3A", margin:"8px 0"}}/>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                    <span style={{fontSize:12, color:"#555", fontWeight:700, textTransform:"uppercase"}}>Déficit Total</span>
                    <span style={{fontSize:20, fontWeight:900, color:recapCustomStats.deficit>0?"#44CC44":"#FF4444"}}>{recapCustomStats.deficit>0?"+":""}{recapCustomStats.deficit} kcal</span>
                  </div>
                  <div style={{textAlign:"right", fontSize:11, color:"#888", marginTop:4}}>Soit ~{Math.abs(Math.round(recapCustomStats.deficit/7700*100)/100)} kg perdus</div>
                </div>
              </Card>
            )}
          </>
        )}

        {/* POIDS */}
        {activeTab==="poids" && (
          <>
            <Card style={{textAlign:"center"}}>
              <Label>Poids aujourd'hui</Label>
              {poidsAujourdhui ? (
                <>
                  <div style={{fontSize:52,fontWeight:900,color:"#4ECDC4",letterSpacing:-2}}>{poidsAujourdhui} <span style={{fontSize:18,color:"#555",fontWeight:400}}>kg</span></div>
                  {poidsTendance!==null && <div style={{fontSize:13,fontWeight:700,color:poidsTendance<=0?"#44CC44":"#FF4444",marginTop:4}}>{poidsTendance>0?"▲":"▼"} {Math.abs(poidsTendance)} kg vs hier {poidsTendance<=0?"📉":"📈"}</div>}
                  <button onClick={()=>deletePoids(todayKey())} style={{marginTop:10,background:"#2A0A0A",border:"1px solid #FF444433",borderRadius:8,color:"#FF4444",padding:"6px 14px",cursor:"pointer",fontSize:12}}>🗑️ Supprimer</button>
                </>
              ) : <div style={{color:"#333",fontSize:14,padding:"10px 0"}}>Pas encore pesé aujourd'hui</div>}
            </Card>
            <Label>Poids du matin (à jeun)</Label>
            <div style={{display:"flex",gap:8,marginBottom:4}}>
              <NumInput value={inputPoids} onChange={setInputPoids} placeholder="ex: 79.4" style={{flex:1}}/>
              <span style={{display:"flex",alignItems:"center",color:"#555"}}>kg</span>
            </div>
            <div style={{fontSize:11,color:"#444",marginBottom:10}}>💡 Virgule ou point acceptés (ex: 79,4 ou 79.4)</div>
            <Btn onClick={logPoids} color="#4ECDC4" textColor="#000">⚖️ Enregistrer</Btn>
            <div style={{background:"#0D0D14",borderRadius:10,padding:"10px 12px",fontSize:12,color:"#444",marginTop:8,marginBottom:14}}>💡 Chaque matin après les toilettes.</div>
            {weightChartData.length>=2 && (
              <Card>
                <Label>Courbe de poids</Label>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <div><div style={{fontSize:10,color:"#555"}}>Début</div><div style={{fontWeight:800,color:"#888"}}>{weightChartData[0]?.val} kg</div></div>
                  {(()=>{const d=+(weightChartData[weightChartData.length-1]?.val-weightChartData[0]?.val).toFixed(1);return<div style={{textAlign:"center"}}><div style={{fontSize:10,color:"#555"}}>Évolution</div><div style={{fontWeight:800,color:d<=0?"#44CC44":"#FF4444"}}>{d>0?"+":""}{d} kg</div></div>;})()}
                  <div style={{textAlign:"right"}}><div style={{fontSize:10,color:"#555"}}>Maintenant</div><div style={{fontWeight:800,color:"#4ECDC4"}}>{weightChartData[weightChartData.length-1]?.val} kg</div></div>
                </div>
                <LineChart data={weightChartData} color="#4ECDC4" unit=" kg"/>
              </Card>
            )}
            {poidsEntries.length>0 && (
              <div style={{marginTop:4}}>
                <Label>Historique</Label>
                {poidsEntries.slice(0,14).map(([date,p],i)=>{
                  const prev = poidsEntries[i+1]?.[1];
                  const diff = prev ? +(p-prev).toFixed(1) : null;
                  return (
                    <div key={date} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:i===0?"#111120":"#0D0D14",borderRadius:10,marginBottom:5,border:i===0?"1px solid #4ECDC433":"1px solid #1A1A2A"}}>
                      <div style={{fontSize:13,color:i===0?"#F0F0F0":"#666"}}>{fmtShort(date)}{i===0&&<span style={{marginLeft:8,fontSize:10,color:"#4ECDC4",fontWeight:700}}>AUJOURD'HUI</span>}</div>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        {diff!==null && <span style={{fontSize:12,color:diff<=0?"#44CC44":"#FF4444",fontWeight:700}}>{diff>0?"+":""}{diff} kg</span>}
                        <span style={{fontWeight:800,fontSize:16,color:i===0?"#4ECDC4":"#888"}}>{p} kg</span>
                        <button onClick={()=>deletePoids(date)} style={{background:"#2A0A0A",border:"1px solid #FF444433",borderRadius:8,color:"#FF4444",padding:"4px 8px",cursor:"pointer",fontSize:11}}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* STATS */}
        {activeTab==="stats" && (
          <>
            <ExoSelector filterCat={statsFilter} setFilterCat={setStatsFilter} selectedExo={statsExo} setSelectedExo={setStatsExo}/>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {[{id:"1rm",label:"🏆 1RM"},{id:"charge",label:"🏋️ Charge"},{id:"reps",label:"🔁 Reps"}].map(m=>(
                <button key={m.id} onClick={()=>setStatsMode(m.id)} style={{flex:1,padding:"10px 6px",borderRadius:12,border:`1px solid ${statsMode===m.id?"#FF6B35":"#1E1E2E"}`,cursor:"pointer",background:statsMode===m.id?"#FF6B3522":"#111118",color:statsMode===m.id?"#FF6B35":"#555",fontWeight:statsMode===m.id?800:400,fontSize:13}}>{m.label}</button>
              ))}
            </div>
            <Card>
              <Label>{statsMode==="1rm"?"Évolution 1RM":statsMode==="charge"?"Charge max/séance":"Reps moyennes/séance"} — {EXERCISES.find(e=>e.id===statsExo)?.name}</Label>
              {statsMode==="1rm" && (rm1ChartData.length>=2?<LineChart data={rm1ChartData} color={catColor[statsFilter]} unit=" kg"/>:<div style={{color:"#333",textAlign:"center",padding:16,fontSize:12}}>Log des séances pour voir la progression</div>)}
              {statsMode==="charge" && (chargeChartData.length>=2?<LineChart data={chargeChartData} color={catColor[statsFilter]} unit=" kg"/>:<div style={{color:"#333",textAlign:"center",padding:16,fontSize:12}}>Pas encore de données</div>)}
              {statsMode==="reps" && (repsChartData.length>=2?<><LineChart data={repsChartData} color="#AA88FF" unit=" reps"/><div style={{background:"#0D0D14",borderRadius:8,padding:"10px 12px",marginTop:10,fontSize:11,color:"#555"}}>💡 Reps en hausse → augmenter la charge (+2.5kg)</div></>:<div style={{color:"#333",textAlign:"center",padding:16,fontSize:12}}>Pas encore de données</div>)}
            </Card>
            <Card>
              <Label>1RM actuels — {statsFilter}</Label>
              {EXERCISES.filter(e=>e.category===statsFilter).map(e=>(
                <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1A1A2A"}}>
                  <div style={{fontSize:13,color:"#888"}}>{e.emoji} {e.name}</div>
                  <div style={{fontWeight:800,color:catColor[e.category]}}>{maxes[e.id]||e.default1RM} kg</div>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* CHARGES */}
        {activeTab==="calc" && (
          <>
            <ExoSelector filterCat={filterCat} setFilterCat={setFilterCat} selectedExo={selectedExo} setSelectedExo={setSelectedExo}/>
            <Card style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <div>
                <Label>1RM — {exo?.name}</Label>
                {editingMax ? (
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <input type="text" inputMode="decimal" value={tempMax} onChange={e=>setTempMax(e.target.value)} style={{background:"#1A1A2A",border:"1px solid #FF6B35",borderRadius:8,color:"#fff",padding:"6px 10px",fontSize:20,fontWeight:700,width:90,outline:"none"}} autoFocus/>
                    <span style={{color:"#888"}}>kg</span>
                    <button onClick={()=>{const v=parseFloat(tempMax);if(!isNaN(v)&&v>0){setMaxes(p=>({...p,[selectedExo]:v}));setEditingMax(false);notify(`1RM : ${v} kg`);}}} style={{background:"#FF6B35",border:"none",borderRadius:8,color:"#000",padding:"6px 12px",fontWeight:800,cursor:"pointer"}}>OK</button>
                    <button onClick={()=>setEditingMax(false)} style={{background:"#222",border:"none",borderRadius:8,color:"#888",padding:"6px 10px",cursor:"pointer"}}>✕</button>
                  </div>
                ) : (
                  <div style={{fontSize:34,fontWeight:900,color:catColor[exo?.category],letterSpacing:-1}}>{current1RM} <span style={{fontSize:14,color:"#555",fontWeight:400}}>kg</span></div>
                )}
              </div>
              {!editingMax && <button onClick={()=>{setEditingMax(true);setTempMax(current1RM);}} style={{background:"#1A1A2A",border:"1px solid #2A2A3A",borderRadius:10,color:"#888",padding:"10px 12px",cursor:"pointer",fontSize:13}}>✏️</button>}
            </Card>
            {ZONES.map(z=>(
              <div key={z.pct} style={{background:"#111118",borderLeft:`4px solid ${z.color}`,border:"1px solid #1E1E2E",borderRadius:12,padding:"12px 16px",marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><div style={{fontWeight:700,fontSize:14,color:z.color}}>{z.label}</div><div style={{fontSize:11,color:"#555"}}>{z.pct}% • {z.reps}</div></div>
                <div style={{textAlign:"right"}}><div style={{fontSize:24,fontWeight:900}}>{round(current1RM*z.pct/100)}</div><div style={{fontSize:11,color:"#555"}}>kg</div></div>
              </div>
            ))}
          </>
        )}

        {/* COACH */}
        {activeTab==="coach" && (
          <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 280px)"}}>
            <div style={{background:"linear-gradient(135deg,#1a0a2a,#0a0a1a)",border:"1px solid #6644AA33",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#AA88FF"}}>🤖 Coach IA</div>
              <div style={{fontSize:11,color:"#555",marginTop:2}}>Profil: {poids}kg • Cible: {headerCibleKcal} kcal • DC: {maxes.dc||95}kg</div>
            </div>
            <div style={{flex:1,overflowY:"auto",marginBottom:12}}>
              {coachHistory.length===0 && <div style={{padding:"10px 0"}}>{["Comment progresser au DC ?","Mon déficit est bon cette semaine ?","J'ai mal dormi, je m'entraîne quand même ?"].map((q,i)=><button key={i} onClick={()=>setCoachInput(q)} style={{display:"block",width:"100%",background:"#111118",border:"1px solid #1E1E2E",borderRadius:10,color:"#666",padding:"10px 14px",cursor:"pointer",marginBottom:8,fontSize:12,textAlign:"left"}}>"{q}"</button>)}</div>}
              {coachHistory.map((msg,i)=><div key={i} style={{marginBottom:12,display:"flex",justifyContent:msg.role==="user"?"flex-end":"flex-start"}}><div style={{maxWidth:"85%",background:msg.role==="user"?"#FF6B35":"#111118",border:msg.role==="user"?"none":"1px solid #1E1E2E",borderRadius:msg.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",padding:"10px 14px",fontSize:13,color:msg.role==="user"?"#000":"#E0E0E0",lineHeight:1.5}}>{msg.content}</div></div>)}
              {coachLoading && <div style={{display:"flex",justifyContent:"flex-start",marginBottom:12}}><div style={{background:"#111118",border:"1px solid #1E1E2E",borderRadius:"14px 14px 14px 4px",padding:"12px 16px",fontSize:13,color:"#555"}}>● ● ●</div></div>}
              <div ref={coachEndRef}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <input type="text" value={coachInput} onChange={e=>setCoachInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&askCoach()} placeholder="Pose ta question..." style={{flex:1,background:"#111118",border:"1px solid #2A2A3A",borderRadius:12,color:"#fff",padding:"12px 16px",fontSize:14,outline:"none"}}/>
              <button onClick={askCoach} disabled={coachLoading||!coachInput.trim()} style={{background:coachLoading||!coachInput.trim()?"#1A1A2A":"#AA88FF",border:"none",borderRadius:12,color:coachLoading||!coachInput.trim()?"#444":"#000",padding:"12px 18px",fontWeight:800,fontSize:16,cursor:coachLoading||!coachInput.trim()?"not-allowed":"pointer"}}>→</button>
            </div>
          </div>
        )}

      </div>
      <style>{`* { box-sizing: border-box; } input, textarea { -webkit-appearance: none; }`}</style>
    </div>
  );
}
