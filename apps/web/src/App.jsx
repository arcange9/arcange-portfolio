import { motion } from 'framer-motion';
import { ArrowUpRight, Github, Instagram, Send, Facebook, MessageCircle, Sparkles, Code2, Database, Bot, Monitor, GraduationCap } from 'lucide-react';

const skills = [
  ['Python','Programming'],['C','Programming'],['C++','Programming'],['Java','Programming'],['JavaScript','Programming'],
  ['HTML5','Frontend'],['CSS3','Frontend'],['React.js','Frontend'],['Node.js','Backend'],['Express.js','Backend'],
  ['Electron.js','Desktop'],['MongoDB','Database'],['MySQL','Database'],['SQL','Database'],['NoSQL','Database']
];

const projects = [
  {name:'Munyarwanda AI',type:'AI / RAG',description:'A Kinyarwanda-focused AI project exploring retrieval-augmented generation and AI integration.',icon:Bot},
  {name:'Arcange AI Assistant',type:'AI / Desktop',description:'A personal AI assistant concept combining desktop software with AI APIs.',icon:Monitor},
  {name:'NextBit Updates',type:'Technology Media',description:'A technology and ICT news brand focused on digital developments.',icon:Sparkles},
  {name:'NextByte Academy',type:'Education',description:'A technology learning platform concept for practical programming education.',icon:GraduationCap},
];

const socials = [
  ['GitHub','https://github.com/arcange9',Github],['Instagram','https://instagram.com/arcangegram',Instagram],
  ['Telegram','https://t.me/izerearcange',Send],['Facebook','https://facebook.com/arcange.froky',Facebook],
  ['WhatsApp','https://wa.me/250724026920',MessageCircle]
];

function Section({eyebrow,title,children,id}){return <section id={id} className="section"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{children}</section>}

export default function App(){
  const year = new Date().getFullYear();
  return <div className="site">
    <nav className="nav"><a className="logo" href="#home">ARCANGE<span>.</span></a><div className="links"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a className="admin" href="/admin">Admin</a></div></nav>
    <main>
      <section id="home" className="hero"><div className="orb orb1"/><div className="orb orb2"/><motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="eyebrow">SOFTWARE • AI • COMPUTER SYSTEMS</motion.p><motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:.1}}>Mukamyi Izere <span>Arcange</span></motion.h1><p className="lead">Software developer, AI builder and Computer Systems & Architecture student creating practical digital experiences.</p><div className="actions"><a className="button primary" href="#projects">Explore my work <ArrowUpRight size={17}/></a><a className="button" href="#contact">Contact me</a></div><div className="hero-tags">{skills.slice(0,7).map(([s])=><span key={s}>{s}</span>)}</div></section>
      <Section id="about" eyebrow="01 / ABOUT" title="Building with curiosity, code & technology."><p className="text">I am focused on programming, web development, AI, databases and computer systems. This portfolio brings together the projects, technical interests, learning journey and experiments I build as I grow as a developer.</p><div className="feature-row"><div><Code2/><strong>Software</strong><span>Web & desktop applications</span></div><div><Bot/><strong>AI</strong><span>AI integration & RAG</span></div><div><Database/><strong>Data</strong><span>SQL & NoSQL databases</span></div></div></Section>
      <Section id="skills" eyebrow="02 / TECHNOLOGIES" title="My technical toolbox"><div className="skill-grid">{skills.map(([s,c],i)=><motion.div whileHover={{y:-6}} className="skill" key={s}><small>{String(i+1).padStart(2,'0')} · {c}</small><strong>{s}</strong></motion.div>)}</div></Section>
      <Section id="projects" eyebrow="03 / SELECTED WORK" title="Projects with purpose."><div className="project-grid">{projects.map((p,i)=>{const Icon=p.icon;return <motion.article whileHover={{y:-7}} className="card" key={p.name}><span>0{i+1}</span><Icon className="card-icon"/><p>{p.type}</p><h3>{p.name}</h3><div>{p.description}</div><a href="https://github.com/arcange9" target="_blank" rel="noreferrer">View GitHub <ArrowUpRight size={15}/></a></motion.article>})}</div></Section>
      <Section id="experience" eyebrow="04 / TRAINING & EXPERIENCE" title="Learning through real programs."><div className="experience"><div className="experience-badge"><GraduationCap/></div><div><h3>Ejo Labs — Technology Training Program</h3><p className="meta">Ejo Labs · 1 Month · 2026</p><p>Participated in a one-month technology training program, developing practical knowledge around AI integration, Retrieval-Augmented Generation (RAG), software development and collaborative project work.</p></div></div></Section>
      <Section id="contact" eyebrow="05 / CONNECT" title="Let's build something useful."><p className="text">Find my work, follow my technology journey, or connect with me.</p><div className="socials">{socials.map(([name,url,Icon])=><a key={name} href={url} target="_blank" rel="noreferrer"><Icon size={17}/>{name}</a>)}</div></Section>
    </main>
    <footer>© {year} Mukamyi Izere Arcange. All rights reserved. <span>Built with code & curiosity.</span></footer>
  </div>
}
