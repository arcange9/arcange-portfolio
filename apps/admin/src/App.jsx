import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, LogOut, User, FolderKanban, Wrench, GraduationCap, Award, Image as ImageIcon, FileText, Settings, Link as LinkIcon, Plus, Trash2, Pencil, RefreshCw, Palette, Save, Eye, Upload } from 'lucide-react';
import { API, contentApi, siteApi, uploadApi } from './api';
import './styles.css';

const modules = [
  ['Overview', 'overview', ShieldCheck], ['Profile', 'profiles', User], ['Projects', 'projects', FolderKanban],
  ['Skills', 'skills', Wrench], ['Education', 'education', GraduationCap], ['Experience', 'experience', GraduationCap],
  ['Achievements', 'achievements', Award], ['Certificates', 'certificates', Award], ['Media', 'media', ImageIcon],
  ['CV', 'cvs', FileText], ['Social Links', 'socials', LinkIcon], ['Settings', 'settings', Settings]
];

const fields = {
  profiles: [['name','Name','text',true],['title','Professional title','text'],['shortBio','Short bio','textarea'],['longBio','Full biography','textarea'],['photoUrl','Photo','url'],['location','Location','text'],['email','Email','email'],['phone','Phone','text'],['resumeUrl','Resume/CV URL','url']],
  projects: [['title','Project name','text',true],['slug','Slug','text',true],['description','Description','textarea'],['imageUrl','Project image','url'],['technologies','Technologies (comma separated)','text'],['githubUrl','GitHub URL','url'],['liveUrl','Live URL','url'],['category','Category','text'],['status','Status','text'],['featured','Featured','checkbox'],['published','Published','checkbox']],
  skills: [['name','Skill name','text',true],['category','Category','text'],['level','Level (0-100)','number'],['icon','Icon name','text'],['published','Published','checkbox'],['sortOrder','Order','number']],
  education: [['institution','Institution','text',true],['program','Program','text',true],['level','Level','text'],['startYear','Start year','number'],['endYear','End year','number'],['description','Description','textarea'],['featured','Featured','checkbox'],['published','Published','checkbox']],
  experience: [['organization','Organization','text',true],['role','Role','text',true],['type','Type','text'],['startDate','Start date','date'],['endDate','End date','date'],['description','Description','textarea'],['technologies','Technologies (comma separated)','text'],['url','URL','url'],['published','Published','checkbox']],
  achievements: [['title','Achievement title','text',true],['organization','Organization','text'],['year','Year','number'],['description','Description','textarea'],['link','Link','url'],['imageUrl','Achievement image','url'],['published','Published','checkbox']],
  certificates: [['title','Certificate title','text',true],['issuer','Issuer','text'],['issueDate','Issue date','date'],['credentialId','Credential ID','text'],['credentialUrl','Credential URL','url'],['imageUrl','Certificate image','url'],['published','Published','checkbox']],
  media: [['name','Media name','text',true],['url','Media file','url',true],['type','Type','text'],['alt','Alt text','text'],['folder','Folder','text'],['size','Size (bytes)','number'],['mimeType','MIME type','text'],['published','Published','checkbox']],
  cvs: [['title','CV title','text'],['url','CV URL','url',true],['version','Version','text'],['uploadedAt','Uploaded date','date'],['active','Active','checkbox']],
  socials: [['platform','Platform','text',true],['label','Label','text'],['url','URL','url',true],['icon','Icon name','text'],['enabled','Enabled','checkbox'],['sortOrder','Order','number']]
};

const colorDefaults = { primary:'#8b5cf6', secondary:'#ff4ecd', accent:'#42e8ff', background:'#070711', surface:'#111120', text:'#f7f7fb', muted:'#aaaabd' };
const uploadableKeys = new Set(['photoUrl','imageUrl']);

function normalizeValue(key, value) {
  if (['technologies'].includes(key)) return Array.isArray(value) ? value.join(', ') : (value || '');
  if (['featured','published','enabled','active'].includes(key)) return value !== false;
  if (value instanceof Date) return value.toISOString().slice(0,10);
  if (key.endsWith('Date') && value) return String(value).slice(0,10);
  return value ?? '';
}

function Editor({ type, initial, onSaved, onCancel }) {
  const definition = fields[type] || [];
  const [form, setForm] = useState(() => Object.fromEntries(definition.map(([key]) => [key, normalizeValue(key, initial?.[key])] )));
  const [saving,setSaving] = useState(false);
  const [uploading,setUploading] = useState('');
  function set(key,value){setForm(prev=>({...prev,[key]:value}));}
  async function handleUpload(key, event){
    const file = event.target.files?.[0];
    event.target.value = '';
    if(!file) return;
    setUploading(key);
    try {
      const result = await uploadApi.image(file);
      set(key, result.url);
      if(type === 'media') {
        set('name', form.name || file.name.replace(/\.[^.]+$/, ''));
        set('type', 'image');
        set('mimeType', result.mimeType);
        set('size', result.size);
      }
    } catch(e){ alert(e.message); } finally { setUploading(''); }
  }
  async function save(e){
    e.preventDefault(); setSaving(true);
    try {
      const body={...form};
      if (body.technologies !== undefined) body.technologies=String(body.technologies).split(',').map(x=>x.trim()).filter(Boolean);
      for (const key of ['startYear','endYear','year','level','sortOrder','size']) if(body[key] === '') delete body[key]; else if(body[key] !== undefined) body[key]=Number(body[key]);
      for (const key of ['startDate','endDate','issueDate','uploadedAt']) if(body[key] === '') delete body[key];
      if(initial) await contentApi.update(type, initial._id, body); else await contentApi.create(type, body);
      onSaved();
    } catch(e){ alert(e.message); } finally { setSaving(false); }
  }
  return <form className="editor" onSubmit={save}><h3>{initial?'Edit':'Add'} {type}</h3>{definition.map(([key,label,inputType,required])=>inputType==='checkbox'?<label className="check" key={key}><input type="checkbox" checked={!!form[key]} onChange={e=>set(key,e.target.checked)}/>{label}</label>:<label key={key}>{label}<>{inputType==='textarea'?<textarea value={form[key]} onChange={e=>set(key,e.target.value)} required={required}/>:<div className="input-with-upload"><input type={inputType} value={form[key]} onChange={e=>set(key,e.target.value)} required={required}/>{(uploadableKeys.has(key) || (type === 'media' && key === 'url'))&&<label className="upload-btn"><Upload size={14}/>{uploading===key?'Uploading…':'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={e=>handleUpload(key,e)} disabled={!!uploading} hidden/></label>}</div>}</></label>)}<p className="upload-note">Images are stored on the portfolio API server with a random filename. Maximum 5 MB. SVG files are blocked.</p><div className="editor-actions"><button type="button" onClick={onCancel}>Cancel</button><button className="save" disabled={saving || !!uploading}>{saving?'Saving…':'Save changes'}</button></div></form>;
}

function SettingsEditor({ initial, onSaved }) {
  const [form,setForm]=useState(()=>({siteName:initial?.siteName||'',tagline:initial?.tagline||'',copyrightText:initial?.copyrightText||'All rights reserved.',copyrightStartYear:initial?.copyrightStartYear||new Date().getFullYear(),autoUpdateCopyrightYear:initial?.autoUpdateCopyrightYear!==false,seoTitle:initial?.seoTitle||'',seoDescription:initial?.seoDescription||'',colors:{...colorDefaults,...initial?.colors}}));
  const [saving,setSaving]=useState(false);
  const update=(k,v)=>setForm(f=>({...f,[k]:v})); const updateColor=(k,v)=>setForm(f=>({...f,colors:{...f.colors,[k]:v}}));
  async function save(e){e.preventDefault();setSaving(true);try{const saved=await siteApi.save(initial?._id,form);onSaved(saved);}catch(e){alert(e.message)}finally{setSaving(false)}}
  return <form className="editor settings-editor" onSubmit={save}><div className="settings-title"><Palette/><div><h3>Website & Admin Theme</h3><p>One color system controls the public portfolio and this protected admin panel.</p></div></div><label>Site name<input value={form.siteName} onChange={e=>update('siteName',e.target.value)}/></label><label>Tagline<input value={form.tagline} onChange={e=>update('tagline',e.target.value)}/></label><label>Copyright text<input value={form.copyrightText} onChange={e=>update('copyrightText',e.target.value)}/></label><label>Copyright start year<input type="number" value={form.copyrightStartYear} onChange={e=>update('copyrightStartYear',Number(e.target.value))}/></label><label className="check"><input type="checkbox" checked={form.autoUpdateCopyrightYear} onChange={e=>update('autoUpdateCopyrightYear',e.target.checked)}/> Automatically use the current year</label><label>SEO title<input value={form.seoTitle} onChange={e=>update('seoTitle',e.target.value)}/></label><label>SEO description<textarea value={form.seoDescription} onChange={e=>update('seoDescription',e.target.value)}/></label><div className="color-grid">{Object.entries(form.colors).map(([key,value])=><label key={key}><span>{key}</span><div className="color-input"><input type="color" value={value} onChange={e=>updateColor(key,e.target.value)}/><input value={value} onChange={e=>updateColor(key,e.target.value)}/></div></label>)}</div><div className="theme-preview"><div style={{background:form.colors.background,color:form.colors.text,borderColor:form.colors.accent}}><strong>Live preview</strong><span style={{color:form.colors.muted}}>Public + Admin theme</span><button type="button" style={{background:form.colors.primary}}>Primary</button><button type="button" style={{background:form.colors.secondary}}>Secondary</button></div></div><div className="editor-actions"><button type="submit" className="save" disabled={saving}><Save size={15}/>{saving?'Saving…':'Save theme & settings'}</button></div></form>;
}

export default function App(){
 const [user,setUser]=useState(null),[loading,setLoading]=useState(true),[active,setActive]=useState('Overview'),[data,setData]=useState([]),[busy,setBusy]=useState(false),[editing,setEditing]=useState(null),[settings,setSettings]=useState(null);
 const current=modules.find(x=>x[0]===active)||modules[0]; const type=current[1];
 const load=()=>{if(type==='overview'||type==='settings')return;setBusy(true);contentApi.list(type).then(setData).catch(e=>{if(e.message.includes('401'))setUser(null);else alert(e.message)}).finally(()=>setBusy(false));};
 const loadSettings=()=>siteApi.get().then(setSettings).catch(()=>{});
 useEffect(()=>{fetch(`${API}/api/auth/me`,{credentials:'include'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>setUser(d.user)).catch(()=>setUser(null)).finally(()=>setLoading(false))},[]);
 useEffect(()=>{if(user){loadSettings();load()}},[user,active]);
 const rows=useMemo(()=>data,[data]);
 const theme=settings?.colors||colorDefaults;
 const themeStyle={'--primary':theme.primary,'--secondary':theme.secondary,'--accent':theme.accent,'--bg':theme.background,'--surface':theme.surface,'--text':theme.text,'--muted':theme.muted};
 if(loading)return <div className="admin-loading" style={themeStyle}>Checking secure session…</div>;
 if(!user)return <main className="login" style={themeStyle}><div className="login-card"><div className="shield"><ShieldCheck/></div><p className="eyebrow">ARCANGE ADMIN</p><h1>Private workspace.</h1><p>Sign in with your authorized Google account to manage your portfolio.</p><a className="google-btn" href={`${API}/api/auth/google`}><span>G</span> Continue with Google</a><a className="back" href="https://arcange-portfolio.vercel.app">← Back to portfolio</a></div></main>;
 async function remove(id){if(!confirm('Delete this item?'))return;try{await contentApi.remove(type,id);load()}catch(e){alert(e.message)}}
 return <div className="dashboard" style={themeStyle}><aside><div className="brand">ARCANGE<span>.</span></div><p className="admin-label">ADMIN PANEL</p><nav>{modules.map(([name,_type,Icon])=><button className={active===name?'active':''} onClick={()=>{setActive(name);setEditing(null);setData([])}} key={name}><Icon size={17}/>{name}</button>)}</nav><div className="side-user"><img src={user.photo||''} alt=""/><div><strong>{user.name}</strong><small>{user.email}</small></div></div></aside><section className="main"><header><div><p className="eyebrow">SECURE CMS</p><h2>{active}</h2></div><div className="header-actions"><a href="https://arcange-portfolio.vercel.app" target="_blank" rel="noreferrer" className="view-site"><Eye size={15}/> View site</a><button className="logout" onClick={async()=>{await fetch(`${API}/api/auth/logout`,{method:'POST',credentials:'include'});location.reload()}}><LogOut size={16}/> Logout</button></div></header><div className="content">{active==='Overview'?<><div className="welcome"><div><p className="eyebrow">WELCOME BACK</p><h1>Control your digital identity.</h1><p>Authenticated as <strong>{user.email}</strong>. Every editable public section is connected to this CMS.</p></div><ShieldCheck size={80}/></div><div className="stats"><div><span>11</span><strong>CMS modules</strong><p>Profile, projects, skills, education and more</p></div><div><span>∞</span><strong>Editable content</strong><p>Add, edit, publish or remove entries</p></div><div><span>7</span><strong>Theme colors</strong><p>Control public and admin colors</p></div></div></>:active==='Settings'?<>{settings?<SettingsEditor initial={settings} onSaved={(saved)=>setSettings(saved)}/>:<p>Loading settings…</p>}</>:<div className="module"><div className="module-head"><div><p className="eyebrow">CONTENT MANAGER</p><h3>{active}</h3><small>Changes here are used by the public portfolio.</small></div><div><button className="icon-btn" onClick={load} title="Refresh"><RefreshCw size={16}/></button><button className="add" onClick={()=>setEditing('new')}><Plus size={16}/> Add</button></div></div>{editing?<Editor type={type} initial={editing==='new'?null:editing} onSaved={()=>{setEditing(null);load()}} onCancel={()=>setEditing(null)}/>:busy?<p>Loading…</p>:rows.length===0?<div className="empty small"><h3>No {active.toLowerCase()} yet</h3><p>Use Add to create your first entry.</p></div>:<div className="table">{rows.map(row=><div className="row" key={row._id}><div><strong>{row.title||row.name||row.institution||row.organization||row.platform||row.program||'Untitled'}</strong><small>{row.description||row.longBio||row.url||row.data?.description||'No description'}</small></div><span className={(row.published??row.enabled??row.active??true)?'status on':'status'}>{(row.published??row.enabled??row.active??true)?'Published':'Draft'}</span><div className="row-actions"><button onClick={()=>setEditing(row)} title="Edit"><Pencil size={15}/></button><button onClick={()=>remove(row._id)} title="Delete"><Trash2 size={15}/></button></div></div>)}</div>}</div>}</div></section></div>;
}
