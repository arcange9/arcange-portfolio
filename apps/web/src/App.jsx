const skills = ['Python','C','C++','Java','JavaScript','React.js','Node.js','Express.js','Electron.js','MongoDB','MySQL','SQL','NoSQL'];
const projects = [
  {name:'Munyarwanda AI',type:'AI / RAG',description:'A Kinyarwanda-focused AI project exploring retrieval-augmented generation and AI integration.'},
  {name:'Arcange AI Assistant',type:'AI / Desktop',description:'Personal AI assistant concept combining desktop software with AI APIs.'},
  {name:'NextBit Updates',type:'Technology Media',description:'Technology and ICT news brand focused on current digital developments.'},
  {name:'NextByte Academy',type:'Education',description:'A technology learning platform concept for practical programming education.'}
];

export default function App(){
  return <div className="site">
    <nav className="nav"><a className="logo" href="#home">ARCANGE<span>.</span></a><div className="links"><a href="#about">About</a><a href="#skills">Skills</a><a href="#projects">Projects</a><a href="#experience">Experience</a><a href="#contact">Contact</a><a className="admin" href="/admin">Admin</a></div></nav>
    <main>
      <section id="home" className="hero"><div className="orb orb1"/><div className="orb orb2"/><p className="eyebrow">SOFTWARE • AI • COMPUTER SYSTEMS</p><h1>Mukamyi Izere <span>Arcange</span></h1><p className="lead">Software developer, AI builder and Computer Systems & Architecture student creating practical digital experiences.</p><div className="actions"><a className="button primary" href="#projects">Explore my work</a><a className="button" href="#contact">Contact me</a></div><div className="hero-tags">{skills.slice(0,6).map(s=><span key={s}>{s}</span>)}</div></section>
      <section id="about" className="section"><p className="eyebrow">01 / ABOUT</p><h2>Building with curiosity, code & technology.</h2><p className="text">I am focused on programming, web development, AI, databases and computer systems. My portfolio brings together the projects, learning journey and technology experiments I build as I grow as a developer.</p></section>
      <section id="skills" className="section"><p className="eyebrow">02 / TECHNOLOGIES</p><h2>My technical toolbox</h2><div className="skill-grid">{skills.map((s,i)=><div className="skill" key={s}><small>{String(i+1).padStart(2,'0')}</small><strong>{s}</strong></div>)}</div></section>
      <section id="projects" className="section"><p className="eyebrow">03 / SELECTED WORK</p><h2>Projects with purpose.</h2><div className="project-grid">{projects.map((p,i)=><article className="card" key={p.name}><span>0{i+1}</span><p>{p.type}</p><h3>{p.name}</h3><div>{p.description}</div><a href="https://github.com/arcange9" target="_blank" rel="noreferrer">View GitHub ↗</a></article>)}</div></section>
      <section id="experience" className="section split"><div><p className="eyebrow">04 / EXPERIENCE</p><h2>Ejo Labs</h2></div><div className="experience"><h3>Technology Training Program</h3><p className="meta">Ejo Labs · 1 Month · 2026</p><p>Participated in a one-month technology training program, developing practical knowledge around AI integration, RAG, software development and collaborative project work.</p></div></section>
      <section id="contact" className="section contact"><p className="eyebrow">05 / CONNECT</p><h2>Let's build something useful.</h2><p className="text">Find my work and follow my technology journey.</p><div className="socials"><a href="https://github.com/arcange9">GitHub</a><a href="https://instagram.com/arcangegram">Instagram</a><a href="https://t.me/izerearcange">Telegram</a><a href="https://facebook.com/arcange.froky">Facebook</a><a href="https://wa.me/250724026920">WhatsApp</a></div></section>
    </main>
    <footer>© {new Date().getFullYear()} Mukamyi Izere Arcange. All rights reserved.</footer>
  </div>
}
