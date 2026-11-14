const root = document.querySelector('#record');
function el(tag,text){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node}
function field(list,label,value){const row=el('div');row.append(el('dt',label),el('dd',value));list.append(row)}
function disclosure(view,id,title,subtitle,detail){const row=el('details');row.id=id;const summary=el('summary',title);summary.append(el('small',subtitle));row.append(summary,el('p',detail));view.append(row);return row}
async function init(){
 const response=await fetch('./campaign.json',{cache:'no-cache'});if(!response.ok)throw Error();const data=await response.json();
 document.querySelector('#checkpoint').textContent=data.checkpoint;root.replaceChildren();
 const nav=document.querySelector('nav'),views={};
 for(const key of ['Camp','Character','Skills','Inventory','Story']){const id=key.toLowerCase(),link=el('a',key==='Camp'?'Overview':key),view=el('article');link.href='#'+id;const paths={Camp:'M2 20 12 3l10 17H2z M8 20l4-7 4 7',Character:'M12 3 4 6v6c0 4 4 7 8 9 4-2 8-5 8-9V6z',Skills:'M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z',Inventory:'M4 8h16v12H4z M8 8V5h8v3 M4 12h16',Story:'M3 4l9 2 9-2v15l-9 2-9-2z M12 6v15'};const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path fill="none" stroke="currentColor" stroke-width="1.5" d="'+paths[key]+'"/>';link.prepend(svg);nav.append(link);view.id=id;view.append(el('h1',key));root.append(view);views[id]=view}
 const home=views.camp;
 home.querySelector('h1').textContent='Campaign overview';
 const latest=data.story.at(-1);
 if(latest){
   const checkpoint=el('section');checkpoint.className='checkpoint';
   checkpoint.append(el('small',data.checkpoint),el('h2',latest.title),el('p',latest.text));
   const chronicle=el('a','Read story record →');chronicle.href='#'+latest.id;checkpoint.append(chronicle);home.append(checkpoint);
 }
 const menu=el('div');menu.className='records-index';home.append(menu);
 const destinations=[
   ['character','Character',data.character.affinity+' affinity'],
   ['skills','Skills',data.skills.length+' '+(data.skills.length===1?'capability':'capabilities')+' recorded'],
   ['inventory','Inventory',data.inventory.length+' possessions recorded'],
   ['story','Story',data.story.length+' entries']
 ];
 for(const [id,title,summary] of destinations){
   const link=el('a');link.href='#'+id;
   const icon=nav.querySelector('a[href="#'+id+'"] svg').cloneNode(true);
   const label=el('div');label.append(el('strong',title),el('small',summary));
   link.append(icon,label,el('span','›'));menu.append(link);
 }
 const c=data.character,stats=el('dl');const sheet=el('div');sheet.className='sheet';stats.className='stats';
 const plate=el('a');plate.className='plate';plate.href='./creek-coat.jpg';plate.setAttribute('aria-label','Open full current portrait');
 const art=el('img');art.src=plate.href;art.width=600;art.height=900;art.alt='Current portrait wearing the ink-blue coat, Saint Christopher medal and laced boots';plate.append(art,el('span','Creek-bank outfit'));
 const gallery=el('dialog');gallery.setAttribute('aria-label','Full current portrait');const close=el('button','Close portrait ×');const full=art.cloneNode();full.removeAttribute('width');full.removeAttribute('height');gallery.append(close,full);document.body.append(gallery);plate.onclick=e=>{e.preventDefault();gallery.showModal()};close.onclick=()=>gallery.close();gallery.onclose=()=>plate.focus();sheet.append(plate,stats);views.character.append(sheet);field(stats,'Mana reserves',c.reserve);field(stats,'Affinity',c.affinity);field(stats,'Appearance',c.appearance);field(stats,'Condition',c.condition);field(stats,'Defining trait',c.trait);
 const capacity=el('div');capacity.className='capacity';for(const [label,value] of [['Reserves',c.reserve],['Affinity',c.affinity]]){const cell=el('div');cell.append(el('small',label),el('strong',value));capacity.append(cell)}views.skills.append(capacity,el('h2','Fundamentals'));
 for(const s of data.skills){disclosure(views.skills,s.id,'◇ '+s.name,s.assessment+' · '+s.summary,s.detail)}
 for(const group of new Set(data.inventory.map(i=>i.location))){const owned=data.inventory.filter(i=>i.location===group);const kit=el('section');kit.className='kit';const heading=el('h2',group);kit.append(heading,el('small',owned.length+' possessions'));views.inventory.append(kit);for(const item of data.inventory.filter(i=>i.location===group)){const row=disclosure(kit,item.id,item.name,item.status+' · Quantity '+item.quantity,item.description+' Recorded from: '+item.source+'.');row.dataset.item=item.id}}
 const cover=el('div');cover.className='chapter';cover.append(el('small',data.checkpoint),el('h2',data.story.at(-1)?.title||'Chronicle'));views.story.append(cover);for(const event of data.story){const entry=el('section');entry.className='story';entry.id=event.id;entry.append(el('h2',event.title),el('p',event.text));if(event.id==="awakening"){const original=el("a","View arrival portrait");original.href="./arrival.jpg";original.style.color="var(--gold)";entry.append(original)}views.story.append(entry)}
 function show(){const raw=location.hash.slice(1),id=({mana:'skills',origin:'story'})[raw]||raw;const target=document.getElementById(id);const view=target?.closest('article')||views.camp;for(const v of Object.values(views))v.hidden=v!==view;for(const a of nav.children){if(a.hash==='#'+view.id)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')}if(target?.tagName==='DETAILS')target.open=true}
 show();window.addEventListener('hashchange',show)
}
init().catch(()=>root.textContent='Campaign record unavailable. Refresh to retry.');
