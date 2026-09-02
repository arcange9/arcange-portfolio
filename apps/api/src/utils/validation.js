const URL_FIELDS = new Set(['photoUrl','resumeUrl','imageUrl','githubUrl','liveUrl','url','link','credentialUrl']);
const STRING_LIMITS = { name:160,title:200,slug:120,shortBio:500,longBio:10000,description:10000,technologies:80,category:80,status:80,institution:200,program:200,level:80,organization:200,role:200,type:80,startDate:40,endDate:40,platform:80,label:120,icon:120,alt:300,folder:160,mimeType:100,version:50,credentialId:200,issueDate:40,uploadedAt:40,email:254,phone:40,siteName:160,tagline:300,copyrightText:300,seoTitle:200,seoDescription:500 };
const BOOLEAN_FIELDS = new Set(['published','featured','enabled','active']);
const INTEGER_FIELDS = new Set(['level','sortOrder','startYear','endYear','year','size']);
const ALLOWED = {
  profiles:['name','title','shortBio','longBio','photoUrl','location','email','phone','resumeUrl'],
  projects:['title','slug','description','imageUrl','technologies','githubUrl','liveUrl','category','status','featured','published'],
  skills:['name','category','level','icon','published','sortOrder'],
  education:['institution','program','level','startYear','endYear','description','featured','published'],
  experience:['organization','role','type','startDate','endDate','description','technologies','url','published'],
  achievements:['title','organization','year','description','link','imageUrl','published'],
  certificates:['title','issuer','issueDate','credentialId','credentialUrl','imageUrl','published'],
  media:['name','url','type','alt','folder','size','mimeType','published'],
  cvs:['title','url','version','uploadedAt','active'],
  socials:['platform','label','url','icon','enabled','sortOrder'],
  settings:['siteName','tagline','copyrightText','seoTitle','seoDescription','primaryColor','secondaryColor','accentColor','backgroundColor','surfaceColor','textColor','mutedColor']
};
const HEX=/^#[0-9a-fA-F]{6}$/;
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE=/^[+0-9()\- .]{7,40}$/;
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function bad(message){throw Object.assign(new Error(message),{status:400});}
function validDate(value,field){if(value&&Number.isNaN(Date.parse(String(value))))bad(`${field} must be a valid date`);}
export function validateContentPayload(type,payload={}){
  if(!payload||typeof payload!=='object'||Array.isArray(payload))bad('Invalid request body');
  const allowed=ALLOWED[type]; if(!allowed)bad('Unknown content type');
  for(const [key,value] of Object.entries(payload)){
    if(!allowed.includes(key))bad(`Unknown field: ${key}`); if(value===null)continue;
    if(typeof value==='string'){
      if(value.length>(STRING_LIMITS[key]||5000))bad(`${key} is too long`);
      if(URL_FIELDS.has(key)&&value)validateSafeUrl(value,key);
      if(['primaryColor','secondaryColor','accentColor','backgroundColor','surfaceColor','textColor','mutedColor'].includes(key)&&!HEX.test(value))bad(`${key} must be a valid 6-digit hex color`);
      if(key==='slug'&& !SLUG.test(value))bad('slug must contain only lowercase letters, numbers and hyphens');
      if(key==='email'&&value&&!EMAIL.test(value))bad('email must be valid');
      if(key==='phone'&&value&&!PHONE.test(value))bad('phone contains invalid characters');
    }
    if(BOOLEAN_FIELDS.has(key)&&typeof value!=='boolean')bad(`${key} must be boolean`);
    if(INTEGER_FIELDS.has(key)&&(!Number.isInteger(Number(value))||Number(value)<0||Number(value)>100000))bad(`${key} must be a valid non-negative integer`);
    if(key==='technologies'&&(!Array.isArray(value)||value.length>30||value.some(v=>typeof v!=='string'||v.length>80)))bad('technologies must be an array of short strings');
    if(key.endsWith('Date')||['issueDate','uploadedAt'].includes(key))validDate(value,key);
  }
  if(type==='skills'&&payload.level!==undefined&&Number(payload.level)>100)bad('Skill level must be 0-100');
  if(type==='media'&&payload.size!==undefined&&Number(payload.size)>5*1024*1024)bad('Media file is too large');
  return payload;
}
export function validateSafeUrl(value,field='URL'){
  let url; try{url=new URL(String(value));}catch{bad(`${field} must be a valid URL`);}
  if(!['https:','http:'].includes(url.protocol))bad(`${field} must use HTTP or HTTPS`);
  if(url.username||url.password)bad(`${field} cannot contain credentials`);
  if(url.hostname.length>253)bad(`${field} has an invalid hostname`);
  return true;
}
