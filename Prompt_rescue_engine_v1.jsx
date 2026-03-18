export default function App() {


// ─── DATA ────────────────────────────────────────────────────────────────────

const PURSUIT_ANIMALS = [
  "Polar Bear","Arctic Wolf","Grizzly Bear","Siberian Tiger","Snow Leopard",
  "Pack of Wolves","Moose","Siberian Lynx","Wild Boar","Black Bear",
  "Cougar / Puma","Wolverine"
];

const PURSUIT_MILITARY = [
  "Military Helicopter","Black Hawk Pursuit","Armed Patrol Unit","Night Vision Squad",
  "Armored Vehicle Chase","Drone Swarm","Sniper Pursuit","Special Ops Team",
  "Search Spotlight Chopper","Border Patrol Unit"
];

const RESCUE_ANIMALS = [
  "Polar Bear Cub","Arctic Wolf Pup","Injured Reindeer","Stranded Beluga Whale",
  "Trapped Arctic Fox","Exhausted Snow Leopard Cub","Frozen Fawn","Siberian Tiger Cub",
  "Injured Eagle","Seal Pup on Ice","Wolf Pup in Snow","Moose Calf Stuck in Ice"
];

const CHAR_DESC = "Young woman, long straight blonde hair, piercing blue eyes, fair skin, dark navy padded survival jacket, snow-dusted. Lean, resilient, mid-20s.";

const CINEMATIC_STYLES = {
  arctic:   "photorealistic 8K cinematic, anamorphic lens distortion, cold desaturated arctic palette — ice-blue shadows, pale gold highlights — shallow depth of field, breath condensation visible, National Geographic wildlife quality, 35mm film grain",
  forest:   "cinematic realism, deep forest lighting, shafts of cold light through dense canopy, high-contrast shadows, muted greens and charcoal greys, 35mm film grain, oppressive claustrophobic atmosphere, Denis Villeneuve visual language",
  apex:     "ultra-cinematic slow-motion aesthetic, dramatic rim lighting — cold blue backlight + warm amber key contrast — subject razor-sharp, background compressed bokeh blur, anamorphic lens flares, 8K photorealistic, IMAX quality tension",
  military: "tactical cinematic thriller, desaturated military palette — grey-green-black — hard directional searchlight beams cutting through darkness, high-contrast shadows, gritty realism, Christopher Nolan / Michael Mann visual style, 8K",
  night:    "cinematic noir, near-darkness lit only by cold moonlight and sweeping searchlights, extreme contrast, deep blacks, hard white light beams, 35mm grain, breathless thriller atmosphere, every shadow is a hiding place",
};

// ─── SYSTEM PROMPT BUILDERS ──────────────────────────────────────────────────

function autoSelectStyle(mode, subject) {
  if (mode === "military") return CINEMATIC_STYLES.military;
  const s = subject.toLowerCase();
  if (s.includes("night") || s.includes("dark") || s.includes("drone")) return CINEMATIC_STYLES.night;
  if (s.includes("tiger") || s.includes("leopard") || s.includes("cougar") || s.includes("lynx") || s.includes("wolverine")) return CINEMATIC_STYLES.apex;
  if (s.includes("boar") || s.includes("bear") || s.includes("moose")) return CINEMATIC_STYLES.forest;
  return CINEMATIC_STYLES.arctic;
}

function buildPursuitSys(mode, subject) {
  const styleDesc = autoSelectStyle(mode, subject);
  let p = "You are a viral YouTube Shorts director and cinematic prompt engineer.\n";
  p += "MODE: " + (mode === "animal" ? "ANIMAL PURSUIT" : "MILITARY PURSUIT") + "\n";
  p += "SUBJECT: " + subject + "\n";
  p += "VISUAL STYLE: " + styleDesc + "\n";
  p += "CHARACTER: " + CHAR_DESC + "\n\n";
  p += "Output 5 clips. Each clip must have: NARRATIVE BEAT, EMOTIONAL BEAT, GOOGLE FLOW (IMAGE PROMPT), GROK VIDEO (ANIMATION PROMPT), ASMR SOUNDS, and CAPCUT NOTE.\n";
  p += "Structure your response with === CLIP [N] === headers.";
  return p;
}

function buildRescueSys(subject) {
  const styleDesc = "photorealistic 8K, GoPro chest-cam, cold arctic palette, National Geographic rescue quality";
  let p = "You are a viral YouTube Shorts director and cinematic prompt engineer.\n";
  p += "MODE: ANIMAL RESCUE BODY CAM\n";
  p += "SUBJECT: " + subject + "\n";
  p += "STYLE: " + styleDesc + "\n\n";
  p += "Output 5 clips following a rescue arc. Structure your response with === CLIP [N] === headers.";
  return p;
}

// ─── PARSERS ─────────────────────────────────────────────────────────────────

function parseClips(text) {
  if (!text) return [];
  const clips = [];
  const parts = text.split(/===\s*CLIP\s*\[?\d+\]?\s*===/i);
  for (let i = 1; i < parts.length; i++) {
    const block = parts[i];
    const getField = (label) => {
      const re = new RegExp(label + ":\\s*([\\s\\S]*?)(?=\\n[A-Z ]+:|---|$)", "i");
      const m = block.match(re);
      return m ? m[1].trim() : "";
    };
    const getSection = (label) => {
      const re = new RegExp("---\\s*" + label + "\\s*---([\\s\\S]*?)(?=---|===|$)", "i");
      const m = block.match(re);
      return m ? m[1].trim() : "";
    };
    clips.push({
      num: i,
      narrative: getField("NARRATIVE BEAT"),
      flowPrompt: getSection("GOOGLE FLOW \\(IMAGE PROMPT\\)"),
      grokPrompt: getSection("GROK VIDEO \\(ANIMATION PROMPT\\)"),
      asmr: getField("ASMR SOUNDS"),
      capcut: getField("CAPCUT NOTE"),
    });
  }
  return clips;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{ padding: '4px 8px', fontSize: '10px', cursor: 'pointer', background: copied ? '#2ecc71' : '#1e4a7a', color: 'white', border: 'none', borderRadius: '4px' }}>
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function ClipCard({ clip }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', marginBottom: '15px', borderRadius: '10px', padding: '15px', border: '1px solid #333' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <strong style={{ color: '#4a9ab8' }}>CLIP {clip.num}</strong>
        <span style={{ fontSize: '11px', color: '#888' }}>{clip.narrative}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#4285f4', fontWeight: 'bold', marginBottom: '5px' }}>IMAGE PROMPT (FLOW)</div>
          <div style={{ fontSize: '11px', background: '#000', padding: '8px', borderRadius: '5px', minHeight: '40px' }}>{clip.flowPrompt}</div>
          <div style={{marginTop: '5px'}}><CopyBtn text={clip.flowPrompt} /></div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: '#e0a030', fontWeight: 'bold', marginBottom: '5px' }}>VIDEO PROMPT (GROK)</div>
          <div style={{ fontSize: '11px', background: '#000', padding: '8px', borderRadius: '5px', minHeight: '40px' }}>{clip.grokPrompt}</div>
          <div style={{marginTop: '5px'}}><CopyBtn text={clip.grokPrompt} /></div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function PursuitEngine() {
  const [appMode, setAppMode] = useState(null);
  const [pursuitMode, setPursuitMode] = useState("animal");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [clips, setClips] = useState([]);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem("gemini_key") || "");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const subjectList = appMode === "rescue" ? RESCUE_ANIMALS : (pursuitMode === "animal" ? PURSUIT_ANIMALS : PURSUIT_MILITARY);

  async function generate() {
    if (!geminiKey) { setShowKeyModal(true); return; }
    setLoading(true);
    setClips([]);
    try {
      const system = appMode === "rescue" ? buildRescueSys(subject) : buildPursuitSys(pursuitMode, subject);
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Create a sequence for: ${subject}` }] }],
          systemInstruction: { parts: [{ text: system }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 4000 }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "API Error");
      const text = data.candidates[0].content.parts[0].text;
      setClips(parseClips(text));
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  }

  if (!appMode) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#080b12', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ letterSpacing: '4px' }}>🎬 PURSUIT ENGINE</h1>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button onClick={() => setAppMode("pursuit")} style={{ padding: '20px 40px', background: '#e05030', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>PURSUIT</button>
        <button onClick={() => setAppMode("rescue")} style={{ padding: '20px 40px', background: '#20b060', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>RESCUE</button>
      </div>
      <button onClick={() => setShowKeyModal(true)} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#444', cursor: 'pointer' }}>🔑 API SETTINGS</button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#080b12', color: 'white', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => {setAppMode(null); setClips([]);}} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>← VOLTAR</button>
          <h2 style={{ fontSize: '14px', letterSpacing: '2px' }}>{appMode.toUpperCase()} ENGINE</h2>
          <button onClick={() => setShowKeyModal(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>🔑</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <select value={subject} onChange={e => setSubject(e.target.value)} style={{ flex: 1, padding: '12px', background: '#111', border: '1px solid #333', color: 'white', borderRadius: '8px' }}>
            <option value="">Escolha o tema...</option>
            {subjectList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={generate} disabled={loading || !subject} style={{ padding: '0 30px', background: loading ? '#333' : '#1a4a7a', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            {loading ? "GERANDO..." : "GERAR"}
          </button>
        </div>

        {clips.map(c => <ClipCard key={c.num} clip={c} />)}

        {showKeyModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <div style={{ background: '#111', padding: '30px', borderRadius: '15px', border: '1px solid #333', width: '400px' }}>
              <h3>Gemini API Key</h3>
              <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)} placeholder="Insere a tua API Key aqui..." style={{ width: '100%', padding: '12px', background: '#000', border: '1px solid #444', color: 'white', borderRadius: '5px', marginBottom: '20px' }} />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => { localStorage.setItem("gemini_key", keyInput); setGeminiKey(keyInput); setShowKeyModal(false); }} style={{ flex: 1, padding: '10px', background: '#1a4a7a', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>GUARDAR</button>
                <button onClick={() => setShowKeyModal(false)} style={{ flex: 1, padding: '10px', background: '#333', border: 'none', color: 'white', borderRadius: '5px', cursor: 'pointer' }}>FECHAR</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}